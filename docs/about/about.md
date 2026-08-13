---
title: About Me
hide:
  #- navigation  #隐藏边框目录
  - toc
  - path
  - feedback
glightbox: false
comments: true  #默认不开启评论
---
<script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js" charset="utf-8"></script>
# <span id="jinrishici-sentence" class="center">今日诗词</span> {.about-hero-title}

<div class="flip-container">
<div class="image-container">
    <img src="https://avatars.githubusercontent.com/u/155136161?s=400&u=c443d94617f3997d385efdf2231740294d9eafbf&v=4" alt="Back Image">
    <img src="../../images/照骗.JPG" alt="Front Image">
</div>
</div>
<style>
    .flip-container {
    position: relative;
    width: 290px;
    height: 290px;
    margin: 10px auto;
    display: flex;
    align-items: flex-start;
    /* 对齐顶部 */
    justify-content: flex-end;
    /* 将文字放置右上角 */
    }
    .image-container {
        position: relative;
        position: relative;
        width: 290px;
        height: 290px;
    }
    .image-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;    /* 图片填满容器 */
        border-radius: 50%;
        border: 4px solid #ffffff; /* 白色边框 */
        box-shadow: 0 8px 24px rgba(14, 30, 37, 0.15); /* 阴影 */
        backface-visibility: hidden; /* 隐藏背面 */
        transition: transform 0.6s ease-in-out; /* 仅对transform过渡 */
    }
    .image-container img:first-child {
        z-index: 1;
        backface-visibility: hidden;
    }
    .image-container img:last-child {
        z-index: 0;
        transform: rotateY(180deg);
        backface-visibility: hidden;
    }
    .image-container:hover img:first-child {
        transform: rotateY(180deg);
        z-index: 2;
    }
    .image-container:hover img:last-child {
        transform: rotateY(0deg);
        z-index: 3;
    }
</style>


<!-- script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js" charset="utf-8" ></script>-->

<div class="grid cards" markdown>

- :simple-qq: __QQ:__ 1586517373
- :simple-wechat: __WeChat:__ Qvi15523375720
- :telephone_receiver: __Tel1:__ 15523375720
- :telephone_receiver: __Tel2:__ 18010405720
- :simple-neteasecloudmusic: __网易云音乐:__ wkkkkyo
- :simple-github: [__GitHub:__ Qvidx](https://github.com/Qvidx){ target="_blank" }
- :simple-tiktok: [__抖音:__ sleeep](https://www.douyin.com/user/MS4wLjABAAAAHUzLA-zgJikwHAtsf7V083S7zfaa5CSlR2EOR6XNSVI?from_tab_name=main){ target="_blank" }
</div>

??? warning
    能私下解决，就不发消息；
    能发消息，就不打电话；
    谢绝直接du语音！！！

## 我的履历

<section class="journey" aria-labelledby="journey-title">
    <header class="journey__header">
        <h2 id="journey-title">来时路</h2>
        <p>从高中、本科到工程实践，按时间记录。</p>
    </header>
    <div class="journey__layout">
      <ol class="journey__grid">
        <li class="journey-card journey-card--school">
            <div class="journey-card__meta">
                <span>高中</span>
                <time>2018-2021</time>
            </div>
            <h3><a href="https://baike.baidu.com/item/%E9%87%8D%E5%BA%86%E5%B8%82%E5%9E%AB%E6%B1%9F%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E6%A0%A1/19829123" target="_blank">重庆市垫江实验中学校</a></h3>
            <p>平凡的三年</p>
        </li>
        <li class="journey-card journey-card--degree">
            <div class="journey-card__meta">
                <span>本科</span>
                <time>2021-2024</time>
            </div>
            <h3><a href="https://www.cque.edu.cn/" target="_blank">CQUE</a></h3>
            <p>计算机科学与技术专业学士</p>
        </li>
        <li class="journey-card journey-card--practice">
            <div class="journey-card__meta">
                <span>工程实践</span>
                <time>2024-2025</time>
            </div>
            <h3><a href="https://eie.cqu.edu.cn/index.htm" target="_blank">重庆大学国家卓越工程师学院</a></h3>
            <p>智能网联汽车专业</p>
        </li>
        <li class="journey-card journey-card--next">
            <div class="journey-card__meta">
                <span>下一站</span>
                <time>继续更新</time>
            </div>
            <h3>未完待续</h3>
            <p>于道各努力，千里自同风</p>
        </li>
      </ol>
    </div>
</section>
