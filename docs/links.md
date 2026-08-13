# 排名不分先后，都是鸽们 {.links-hero-title}

<div class="post-body">
  <div id="links">
    <style>
      /* 友链样式 */
      :root {
        --primary-color: #68536f;
        --secondary-color: #f8f9fa;
        --accent-color: #4f3d56;
        --text-color: #333;
        --light-text: #666;
        --border-radius: 10px;
        --box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        --transition: all 0.3s ease;
      }
      
      .links-title {
        position: relative;
        font-size: 1.8rem;
        margin: 2.5rem 0 1.5rem;
        padding-bottom: 0.5rem;
        color: var(--text-color);
        text-align: center;
      }
      
      .links-title::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: var(--primary-color);
        border-radius: 3px;
      }
      
      .links-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }
      
      .link-navigation {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
      }
      
      .card {
        width: 45%;
        max-width: 450px;
        font-size: 1rem;
        padding: 1.2rem 1.5rem;
        border-radius: var(--border-radius);
        background-color: var(--secondary-color);
        margin-bottom: 1.5rem;
        display: flex;
        box-shadow: var(--box-shadow);
        transition: var(--transition);
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .card:nth-child(1) { animation-delay: 0.1s; }
      .card:nth-child(2) { animation-delay: 0.2s; }
      .card:nth-child(3) { animation-delay: 0.3s; }
      .card:nth-child(4) { animation-delay: 0.4s; }
      .card:nth-child(5) { animation-delay: 0.5s; }
      
      .card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
      }
      
      .card a {
        border: none;
        text-decoration: none;
      }
      
      .card .ava {
        width: 4rem !important;
        height: 4rem !important;
        margin: 0 !important;
        margin-right: 1.2em !important;
        border-radius: var(--border-radius);
        object-fit: cover;
        box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
      }
      
      .card:hover .ava {
        transform: rotate(5deg);
      }
      
      .card .card-header {
        font-style: italic;
        overflow: hidden;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .card .card-header a {
        font-style: normal;
        color: var(--primary-color);
        font-weight: bold;
        text-decoration: none;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        transition: color 0.3s ease;
      }
      
      .card .card-header a:hover {
        color: #59475f;
      }
      
      .card .card-header .info {
        font-style: normal;
        color: var(--light-text);
        font-size: 0.9rem;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      
      /* 媒体查询：小屏幕 */
      @media (max-width: 768px) {
        .card {
          width: 100%;
          max-width: 100%;
          float: none;
        }
        
        .links-title {
          font-size: 1.5rem;
        }
      }
    </style>
    
    <h2 class="links-title">友情链接</h2>
    
    <div class="links-content">
      <div class="link-navigation">
        <!-- <div class="card">
          <img
            class="ava"
            src="https://avatars.githubusercontent.com/u/155136161?s=400&u=c443d94617f3997d385efdf2231740294d9eafbf&v=4"
          />
          <div class="card-header">
            <div>
              <a href="https://qvidx.github.io/" target=""_blank""
                >Qvi's blog</a
              >
            </div>
            <div class="info">这是一个偷师学艺的小站。</div>
          </div>
        </div>-->
        <div class="card">
          <img
            class="ava"
            src="https://avatars.githubusercontent.com/u/114280055?v=4"
          />
          <div class="card-header">
            <div>
              <a href="https://liwanr.com/" target="_blank">liWanr's blog</a>
            </div>
            <div class="info">人称外号小李子</div>
          </div>
        </div>
        <div class="card">
          <img
            class="ava"
            src="https://avatars.githubusercontent.com/u/103124991?v=4"
          />
          <div class="card-header">
            <div>
              <a href="https://dczcq.cn/" target="_blank">Sevenalist</a>
            </div>
            <div class="info">语言艺术家，理工男中的哲学家</div>
          </div>
        </div>
        <div class="card">
          <img
            class="ava"
            src="https://avatars.githubusercontent.com/u/73921248?v=4"
          />
          <div class="card-header">
            <div>
              <a href="https://dxlcq.cn/" target="_blank">骄骄</a>
            </div>
            <div class="info">一肚子的技术</div>
          </div>
        </div>
        <div class="card">
          <img
            class="ava"
            src="https://avatars.githubusercontent.com/u/136422686?v=4"
          />
          <div class="card-header">
            <div>
              <a href="https://wanjc.top/" target="_blank">W W</a>
            </div>
            <div class="info">毛毛球高玩</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
