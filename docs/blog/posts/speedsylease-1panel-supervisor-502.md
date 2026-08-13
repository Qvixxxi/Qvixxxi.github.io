---
date: 2026-06-01
authors:
  - squidfunk
categories:
  - 部署
  - 排障
featured: true
featured_visual:
  from: Browser
  via: Nginx
  to: SpeedyLease
  status: "502"
  detail: 端口 8000 未建立连接
  tone: error
---

# 1Panel 进程守护显示运行中，但 SpeedyLease 访问 502 怎么排查

把 SpeedyLease 放到服务器上以后，我遇到一个很典型的问题：1Panel 的 Supervisor 页面里进程显示“运行中”，启动命令看起来也没问题，但浏览器访问 `公网 IP:8000` 时却提示 502，页面打不开。

这类问题不能只看“运行中”三个字。Supervisor 只能说明进程被拉起来了，不代表 Python 服务真的监听在目标端口，也不代表防火墙、安全组、反向代理都通了。

<!-- more -->

## 当前启动命令

1Panel 进程守护里配置的是：

```bash
python3 app.py --host 0.0.0.0 --port 8000 --no-browser
```

几个参数的意思：

| 参数 | 说明 |
| --- | --- |
| `--host 0.0.0.0` | 监听所有网卡，公网或反代才有机会访问 |
| `--port 8000` | 指定应用端口 |
| `--no-browser` | 服务器环境不自动打开浏览器 |

如果要换端口，例如换成 `8010`：

```bash
python3 app.py --host 0.0.0.0 --port 8010 --no-browser
```

改完后要重启 Supervisor 里的这个守护进程。

## 先看服务本机是否正常

不要一上来就用公网 IP 测，先在服务器本机测。

```bash
curl -i http://127.0.0.1:8000/health
```

正常应该返回：

```json
{"status":"ok"}
```

如果你改成了 `8010`，就测：

```bash
curl -i http://127.0.0.1:8010/health
```

只要本机 `curl` 不通，就不要继续查域名、浏览器或安全组，先处理 Python 进程本身。

## 确认端口真的在监听

看端口监听：

```bash
ss -lntp | grep :8000
```

或者换端口后：

```bash
ss -lntp | grep :8010
```

正常要能看到类似：

```text
LISTEN 0  ... 0.0.0.0:8000 ... python3
```

如果没有输出，说明服务并没有监听这个端口。Supervisor 显示运行中，也可能只是进程刚启动又异常，或者启动到了别的端口。

## 为什么会出现“运行中但打不开”

之前应用代码里有一个开发期友好的逻辑：如果指定端口被占用，会自动换到随机端口。

这个逻辑在本地很方便，但放到服务器就容易迷惑：

```text
Supervisor 以为进程运行中
浏览器访问 8000
应用其实已经换到别的端口
于是公网访问 8000 失败
```

所以部署时更好的做法是：指定端口不可用就直接报错退出，让 Supervisor 日志暴露真实原因。

现在应用已经改成固定端口模式：如果 `8000` 被占用，会直接报错：

```text
Port 8000 is unavailable on 0.0.0.0.
Stop the process using it or start this app with another --port.
```

这样排障会清楚很多。

## 查看 Supervisor 日志

在 1Panel 里点这个守护进程的“日志”，重点看几类错误：

| 日志现象 | 说明 |
| --- | --- |
| `Port 8000 is unavailable` | 端口被占用，停掉占用进程或换端口 |
| `ModuleNotFoundError` | 服务器 Python 环境缺依赖 |
| `Permission denied` | 目录权限或文件权限问题 |
| 反复启动、退出 | 命令或工作目录配置错误 |

不要只看状态列里的“运行中”。日志才是这类问题的真相现场。

## 换端口的完整步骤

例如从 `8000` 换到 `8010`：

1Panel 进程守护里把启动命令改成：

```bash
python3 app.py --host 0.0.0.0 --port 8010 --no-browser
```

保存后重启守护进程。

服务器本机检查：

```bash
curl -i http://127.0.0.1:8010/health
ss -lntp | grep :8010
```

公网访问：

```text
http://服务器公网 IP:8010
```

如果本机通、公网不通，通常就是安全组或防火墙没放行。

## 防火墙和安全组

如果要直接通过 `公网 IP:8010` 访问，需要同时确认：

| 位置 | 要做的事 |
| --- | --- |
| 云服务器安全组 | 放行 TCP 8010 |
| 系统防火墙 | 放行 8010 |
| 1Panel 防火墙设置 | 如果启用，也要放行 8010 |

本机能访问但公网不行，优先查这些。

## 也可以不暴露端口

更推荐的正式部署方式是：Python 应用监听内网端口，例如 `8010`，外部只访问域名。

访问链路：

```text
浏览器
  -> 域名 / HTTPS
  -> 1Panel OpenResty
  -> http://127.0.0.1:8010
  -> SpeedyLease Python 服务
```

这样公网只开放 `80` 和 `443`，不用把 `8010` 暴露出去。

1Panel 里可以创建反向代理站点：

| 项目 | 内容 |
| --- | --- |
| 域名 | `score.example.com` |
| 代理地址 | `http://127.0.0.1:8010` |
| SSL | 先 HTTP 跑通，再申请 HTTPS |

如果 1Panel/OpenResty 在容器里，`127.0.0.1` 不一定指宿主机。这种情况下可以改成服务器内网 IP。

## 登录账号的问题

SpeedyLease 现在不开放公开注册，避免外部用户知道 IP 和端口后自助注册。

第一次启动时，如果还没有账号，系统会自动创建默认管理员：

```text
用户名：admin
```

初始密码在服务器项目目录里：

```bash
cat data/auth_config.json
```

看里面的：

```json
{
  "defaultUserPassword": "..."
}
```

登录进去后，可以在配置页的“账号管理”里添加内部账号。新增账号统一使用 `defaultUserPassword` 作为初始密码。

## 我的排查顺序

以后遇到 502，我会按这个顺序排：

1. 看 Supervisor 日志，不只看“运行中”
2. 本机执行 `curl http://127.0.0.1:端口/health`
3. 用 `ss -lntp | grep :端口` 确认端口监听
4. 确认启动命令里的 `--host 0.0.0.0`
5. 确认云服务器安全组和系统防火墙放行
6. 如果走域名，再检查 1Panel 反向代理地址

这个顺序能快速判断问题在 Python 应用、端口、防火墙，还是反向代理。

## 小结

1Panel 的 Supervisor 显示“运行中”，只说明进程管理层面没有立刻报错；真正能不能访问，要看端口监听和 `/health`。

部署 SpeedyLease 时，我更推荐：

- 进程守护固定端口，例如 `8010`
- 本机先用 `curl /health` 验证
- 正式访问走 1Panel 反向代理和 HTTPS
- 登录页不开放注册，账号从系统内部添加

这样服务状态、访问入口和账号安全都会更清楚。
