---
date: 2026-08-21
authors:
  - squidfunk
categories:
  - 项目复盘
  - 微信小程序
---

# 泷腾二手车小程序一期：从车源到成交，真正需要管住的是状态

这不是一个面向 C 端的二手车商城，而是给门店员工和总部管理员使用的内部协同小程序。重点不是“展示多少辆车”，而是要解决一辆车被谁跟进、是否占用、最后有没有线下成交的问题。

技术上采用：**微信原生小程序 + 微信云托管 Express + MySQL + 云存储**。下面不讲概念，直接记录几个最核心的实现。

<!-- more -->

## 先定业务状态，再写页面

系统最核心的状态只有三种：

```text
available  可售
reserved   已占用，正在跟进
sold       已成交
```

购车意向的状态和车辆状态不是一回事。前者描述订单处理进度，后者描述这辆车能不能继续推荐：

```js
const transitions = {
  pending: {
    approve: ["approved", "reserved"],
    reject:  ["rejected", "available"]
  },
  approved: {
    complete: ["completed", "sold"],
    cancel:   ["cancelled", "available"]
  }
};
```

这样门店提交意向后，车辆立刻从 `available` 变为 `reserved`；总部审核通过后仍保持占用；成交才改为 `sold`；拒绝或取消则释放回 `available`。

## 架构：小程序不直接碰公网 API

小程序没有配置传统的公网 API 域名，而是使用 `wx.cloud.callContainer` 通过微信云托管的私有链路调用服务：

```text
微信小程序
  └─ wx.cloud.callContainer
       └─ 微信云托管容器（Express :80）
            ├─ MySQL：车辆、员工、门店、意向、分期方案
            └─ 云存储：车辆图片、检测报告
```

前端请求层只保留一个入口，所有请求都会自动带上云托管服务名和登录令牌：

```js
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callContainer({
      config: { env: config.cloudEnvId },
      path: `/api${path}`,
      method: options.method || "GET",
      data: options.data,
      timeout: options.timeout || 15000,
      header: {
        "X-WX-SERVICE": config.cloudService,
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return resolve(response.data);
        }
        reject(new Error(response.data?.error?.message || "请求失败"));
      },
      fail() {
        reject(new Error("云托管连接失败，请检查环境 ID 和服务名称"));
      }
    });
  });
}

module.exports = {
  get: path => request(path),
  post: (path, data) => request(path, { method: "POST", data }),
  patch: (path, data) => request(path, { method: "PATCH", data })
};
```

这样的好处是服务不需要暴露公网入口，后端也能从云托管注入的 `x-wx-openid` 识别调用者。

## 首次登录：微信身份和员工手机号绑定

后端先读微信 OpenID；如果还没有绑定员工，就创建一个短时绑定票据，让用户用手机号完成第一次绑定：

```js
app.post("/api/auth/wechat", asyncRoute(async (req, res) => {
  const openid = req.headers["x-wx-openid"];

  if (!openid) {
    throw new HttpError(401, "未获取到微信身份，请使用 callContainer 调用");
  }

  const found = await db.one(
    "SELECT id FROM employees WHERE openid=? AND enabled=1",
    [openid]
  );

  if (found) {
    return res.json({
      requiresBinding: false,
      token: await issueSession(found.id),
      user: await employee(found.id)
    });
  }

  const bindToken = makeToken();
  await db.run(
    "INSERT INTO login_tickets(token,openid,expires_at) VALUES(?,?,?)",
    [bindToken, openid, afterDays(1)]
  );
  res.json({ requiresBinding: true, bindToken });
}));
```

绑定时还要处理两个并发问题：一个手机号不能被不同微信重复绑定，一个微信也不能绑定多个员工。这个判断不能只放在前端，必须由数据库事务兜底：

```js
await db.transaction(async tx => {
  const updated = await tx.run(
    "UPDATE employees SET openid=? WHERE id=? AND (openid IS NULL OR openid=?)",
    [ticket.openid, employee.id, ticket.openid]
  );

  if (updated.changes !== 1) {
    throw new HttpError(409, "手机号刚刚被其他微信绑定");
  }

  await tx.run("DELETE FROM login_tickets WHERE token=?", [bindToken]);
});
```

## 提交购车意向时，用事务锁住车辆

最不能接受的情况是：两个门店同时看到一辆可售车，都成功提交了意向。因此创建意向时，不是先查状态、再单独更新，而是在一个事务里用 `FOR UPDATE` 锁住对应车辆：

```js
app.post("/api/orders", asyncRoute(async (req, res) => {
  const body = req.body;
  const orderId = makeId("LT");

  await db.transaction(async tx => {
    const vehicle = await tx.one(
      "SELECT id, status FROM vehicles WHERE id=? FOR UPDATE",
      [body.vehicleId]
    );

    if (!vehicle || vehicle.status !== "available") {
      throw new HttpError(409, "车辆已被其他门店占用或当前不可售");
    }

    await tx.run(
      "UPDATE vehicles SET status='reserved', version=version+1 WHERE id=?",
      [body.vehicleId]
    );

    await tx.run(
      `INSERT INTO orders(
        id, vehicle_id, store_id, salesperson_id,
        customer, phone, type, finance_plan_id,
        amount, down_payment, note, status
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,'pending')`,
      [
        orderId, body.vehicleId, req.auth.user.store_id, req.auth.user.id,
        body.customer, body.phone, body.type, body.financePlanId || null,
        Number(body.amount), Number(body.downPayment) || 0, body.note || ""
      ]
    );
  });

  res.status(201).json({ id: orderId });
}));
```

这段代码保证了“锁车”和“创建意向”要么同时成功，要么同时失败，避免只占车却没有订单的脏数据。

## 上传图片和检测报告：文件不进容器

云托管容器是运行代码的地方，不应该拿来长期保存车辆图片或检测报告。小程序上传文件到云存储后，只把 `fileID`、原始文件名、大小和分类登记进 MySQL：

```js
async function upload(filePath, category, originalName = "") {
  const extension = (originalName || filePath)
    .match(/\.[a-zA-Z0-9]{1,8}$/)?.[0] || "";
  const cloudPath = `longteng/${category}/${Date.now()}-${
    Math.random().toString(36).slice(2)
  }${extension}`;

  const result = await wx.cloud.uploadFile({ cloudPath, filePath });
  const info = await new Promise(resolve =>
    wx.getFileInfo({ filePath, success: resolve, fail: () => resolve({ size: 0 }) })
  );

  return request("/uploads/register", {
    method: "POST",
    data: {
      fileId: result.fileID,
      name: originalName || cloudPath.split("/").pop(),
      size: info.size || 0,
      category
    }
  });
}
```

后端只接受 `cloud://` 开头的文件标识，并限制文件分类为车辆图片或车辆报告：

```js
app.post("/api/uploads/register", asyncRoute(async (req, res) => {
  const { fileId, category } = req.body;

  if (!String(fileId || "").startsWith("cloud://")) {
    throw new HttpError(400, "云存储文件标识无效");
  }

  if (!["vehicle-image", "vehicle-report"].includes(category)) {
    throw new HttpError(400, "仅允许登记车辆图片或车辆报告");
  }

  // 记录文件元数据，再由车辆记录关联它。
  res.status(201).json({ ok: true });
}));
```

## 云托管镜像与健康检查

后端容器很小：Node 启动 Express，使用 `80` 端口，并提供 `/api/health` 给云托管检查。

```dockerfile
FROM node:24-bookworm-slim

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=80

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

COPY . ./
EXPOSE 80
CMD ["node", "cloud-server.js"]
```

健康检查接口保持简单，重点让部署平台能判断进程和数据库配置是否已进入预期模式：

```js
app.get("/api/health", asyncRoute(async (req, res) => {
  res.json({
    ok: true,
    service: "longteng-used-vehicle-cloud-api",
    database: "mysql",
    testLogin: allowTest,
    time: new Date().toISOString()
  });
}));
```

## 一期留下的边界

当前版本刻意没有接入支付、线上签约和完整 CRM。先把**车辆状态、员工身份、意向单、线下成交登记**这一条链路做成可追踪、可回退、不会重复占车的闭环。

后续是否扩展审批流、客户跟进和统计分析，不取决于能不能多写几个页面，而取决于门店实际怎么使用这条流程。先让业务状态正确，再谈更多功能。
