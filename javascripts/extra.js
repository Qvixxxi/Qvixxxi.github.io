// 随机名言显示
document.addEventListener('DOMContentLoaded', function() {
  const quotes = [
    "于道各努力，千里自同风",
    "循此苦旅，以达星辰",
    "不积跬步，无以至千里",
    "学然后知不足，教然后知困",
    "纸上得来终觉浅，绝知此事要躬行",
    "业精于勤，荒于嬉",
    "天行健，君子以自强不息",
    "博学之，审问之，慎思之，明辨之，笃行之",
    "知之为知之，不知为不知，是知也",
    "学而不思则罔，思而不学则殆"
  ];
  
  const quoteElement = document.getElementById('random-quote');
  if (quoteElement) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
  }
  
  // 添加页面加载动画
  document.body.classList.add('loaded');
  
  // 为卡片添加悬停效果
  const featuredItems = document.querySelectorAll('.featured-item');
  featuredItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    });
  });
  
  // 平滑滚动效果
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});
