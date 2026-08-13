const initQviFeatured = (scope = document) => {
  scope.querySelectorAll("[data-qvi-featured]").forEach((carousel) => {
    if (carousel.dataset.qviReady === "true") return;

    const slides = [...carousel.querySelectorAll("[data-qvi-featured-slide]")];
    if (!slides.length) return;

    const previous = carousel.querySelector("[data-qvi-featured-prev]");
    const next = carousel.querySelector("[data-qvi-featured-next]");
    const current = carousel.querySelector("[data-qvi-featured-current]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 56.26em)").matches;
    const duration = 6500;
    let active = 0;
    let timer = 0;

    const stop = () => {
      window.clearTimeout(timer);
      carousel.classList.remove("is-running");
    };

    const start = () => {
      stop();
      if (slides.length < 2 || reduceMotion || !desktop || document.hidden) return;
      carousel.style.setProperty("--qvi-featured-duration", `${duration}ms`);
      void carousel.offsetWidth;
      carousel.classList.add("is-running");
      timer = window.setTimeout(() => show(active + 1), duration);
    };

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const selected = slideIndex === active;
        slide.hidden = !selected;
        slide.classList.toggle("is-active", selected);
        slide.setAttribute("aria-hidden", selected ? "false" : "true");
      });
      if (current) current.textContent = String(active + 1);
      start();
    };

    previous?.addEventListener("click", () => show(active - 1));
    next?.addEventListener("click", () => show(active + 1));
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) start();
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(active - 1);
      if (event.key === "ArrowRight") show(active + 1);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    carousel.dataset.qviReady = "true";
    show(0);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("qvi-theme");
  if (savedTheme === "default" || savedTheme === "slate") {
    document.body.dataset.mdColorScheme = savedTheme;
  }

  document.querySelectorAll("[data-qvi-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme =
        document.body.dataset.mdColorScheme === "slate" ? "default" : "slate";

      document.body.dataset.mdColorScheme = nextTheme;
      localStorage.setItem("qvi-theme", nextTheme);

      const frame = document.querySelector(".giscus-frame");
      if (frame) {
        frame.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: nextTheme === "slate" ? "transparent_dark" : "light",
              },
            },
          },
          "https://giscus.app",
        );
      }
    });
  });

  const quoteElement = document.getElementById("random-quote");

  if (quoteElement) {
    const quotes = [
      "于道各努力，千里自同风",
      "循此苦旅，以达星辰",
      "不积跬步，无以至千里",
      "纸上得来终觉浅，绝知此事要躬行",
      "知之为知之，不知为不知，是知也",
    ];
    const dayIndex = Math.floor(Date.now() / 86400000) % quotes.length;
    quoteElement.textContent = quotes[dayIndex];
  }

  initQviFeatured();
});

if (typeof document$ !== "undefined") {
  document$.subscribe(() => initQviFeatured());
}
