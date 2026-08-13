---
date: 2026-05-26
authors:
  - squidfunk
categories:
  - 随笔
  - 部署
featured: true
featured_visual:
  from: Domain
  via: OpenResty
  to: Python
  status: "8000"
  detail: 域名到 Python 服务的访问链路
  tone: normal
---

# 用 1Panel 部署 SpeedyLease 项目

这次把一个 Python 小项目放到服务器上，用 1Panel 做反向代理，再通过域名访问。过程不复杂，但里面有几个容易踩的小坑：监听地址、反向代理地址、DNS、备案和服务常驻。

<!-- more -->

## 最终访问链路

```text
浏览器
  -> 域名
  -> 1Panel / OpenResty
  -> http://服务器内网 IP:8000
  -> Python app.py
```

Python 服务只负责应用本身，域名、HTTPS 和转发交给 1Panel。

## 启动项目

进入项目目录：

```bash
cd /opt/speedsylease
```

启动服务：

```bash
python3 app.py --host 0.0.0.0 --port 8000 --no-browser
```

这几个参数的意思：

| 参数 | 说明 |
| --- | --- |
| `--host 0.0.0.0` | 监听所有网卡，方便 1Panel 访问 |
| `--port 8000` | 应用运行在 8000 端口 |
| `--no-browser` | 服务器环境不自动打开浏览器 |

启动成功后会看到：

```text
Driver scoring server is running at http://0.0.0.0:8000
```

## 检查服务是否正常

先在服务器本机测试：

```bash
curl http://127.0.0.1:8000/health
```

正常返回：

```json
{"status":"ok"}
```

再看服务器内网 IP：

```bash
hostname -I
```

例如我这里优先用：

```text
10.1.8.8
```

于是 1Panel 反向代理地址就是：

```text
http://10.1.8.8:8000
```

## 1Panel 反向代理

在 1Panel 里创建网站：

```text
网站 -> 创建网站 -> 反向代理
```

填写：

| 项目 | 内容 |
| --- | --- |
| 域名 | `score.speedsylease.com` |
| 端口 | `80` |
| 代理地址 | `http://10.1.8.8:8000` |
| SSL | 先不开，HTTP 能访问后再申请 |

不要优先填 `127.0.0.1:8000`，因为 1Panel/OpenResty 可能在容器里，容器里的 `127.0.0.1` 不一定是宿主机。

## DNS 解析

在域名服务商添加 A 记录：

| 项目 | 内容 |
| --- | --- |
| 记录类型 | `A` |
| 主机记录 | `score` |
| 记录值 | 服务器公网 IP |

解析生效后访问：

```text
http://score.speedsylease.com
```

如果 HTTP 可以打开，再到 1Panel 给这个站点申请 HTTPS 证书。

## 关于备案

我这里还遇到一个现象：

```text
IP:8000 可以访问
域名访问提示未备案
```

原因是 IP 访问和域名访问不是一回事。访问域名时，请求里会带上 `Host: score.speedsylease.com`，如果这个域名接入的是中国大陆云服务器，就可能触发备案检查。

所以正式上线时，要么完成备案/接入备案，要么使用已经可用的域名，要么换到不需要备案的区域。

## 服务常驻

直接在终端运行 Python，关掉终端服务就停。正式使用建议放到 1Panel 的进程守护：

```text
工具箱 -> 进程守护 / Supervisor
```

配置：

| 项目 | 内容 |
| --- | --- |
| 名称 | `speedsylease` |
| 运行目录 | `/opt/speedsylease` |
| 启动命令 | `python3 app.py --host 0.0.0.0 --port 8000 --no-browser` |
| 自动重启 | 开启 |
| 开机自启 | 开启 |

## 小结

这次部署的关键点其实就三件事：

1. Python 服务监听 `0.0.0.0:8000`
2. 1Panel 反向代理到服务器内网 IP
3. 域名解析到服务器公网 IP

临时测试可以用 `http://公网IP:8000`，但正式使用还是建议走域名、HTTPS 和反向代理，这样更清晰，也更安全。
