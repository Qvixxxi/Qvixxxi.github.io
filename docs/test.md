# 折腾实验室

这里放一些正在尝试、还没整理成正式文章的小实验。

不一定完整，但会记录过程、问题和结论。等某个内容成熟了，再把它整理到 Blog 里。

## 最近在折腾

<div class="grid cards" markdown>

- :material-server: **服务器部署**

    1Panel、反向代理、Supervisor 常驻运行，以及项目上线时遇到的小问题。

- :material-language-python: **Python 小工具**

    数据处理、接口测试、自动化脚本，还有一些临时验证想法。

- :material-book-open-page-variant: **MkDocs 博客**

    主题配置、页面布局、插件尝试和写作工作流。

- :material-linux: **Linux 命令**

    服务器排错、常用命令、端口检查和服务管理。

</div>

## 常用命令

```bash
# 启动 SpeedyLease
python3 app.py --host 0.0.0.0 --port 8000 --no-browser

# 健康检查
curl http://127.0.0.1:8000/health

# 查看 8000 端口
ss -lntp | grep 8000

# MkDocs 本地预览
conda activate mk
mkdocs serve
```

## 问题记录

| 日期 | 问题 | 结论 |
| --- | --- | --- |
| 2026-05-26 | 终端关闭后服务停止 | 用 1Panel Supervisor 常驻运行 |
| 2026-05-26 | 域名访问提示备案 | 中国大陆服务器域名访问需要备案或接入备案 |
| 2026-05-26 | 反向代理访问失败 | 检查 Python 服务、代理地址和端口放行 |
| 2026-05-26 | 大屏图表显示不完整 | 调整页面高度、图表坐标和浏览器缓存 |
