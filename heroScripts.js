/**
 * Fonction pour animer des points autour de la souris sur un container
 * @param {HTMLElement} container - L'élément sur lequel apparaissent les points
 * @param {Object} options - Options de personnalisation
 */
function initHeroPoints(container, options = {}) {
  if (!container) return;

  let lastPointTime = 0;
  const interval = options.interval || 35;
  const colors = options.colors || ["#0D0D0D", "#F5F5F5", "#3A86FF", "#FFBE0B", "#8D99AE"];
  const maxOffset = options.maxOffset || 40;
  const maxSize = options.maxSize || 30;
  const lifeTime = options.lifeTime || 3000;

  container.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastPointTime < interval) return;
    lastPointTime = now;

    const point = document.createElement("div");
    point.className = "hero-point";

    const rect = container.getBoundingClientRect();
    const offsetX = (Math.random() - 0.5) * maxOffset;
    const offsetY = (Math.random() - 0.5) * maxOffset;

    point.style.left = `${e.clientX - rect.left + offsetX}px`;
    point.style.top = `${e.clientY - rect.top + offsetY}px`;

    const size = 10 + Math.random() * maxSize;
    point.style.width = `${size}px`;
    point.style.height = `${size}px`;

    const color = colors[Math.floor(Math.random() * colors.length)];
    point.style.background = color;
    point.style.borderRadius = Math.random() > 0.5 ? "50%" : "4px";
    point.style.boxShadow = `0 0 ${8 + Math.random() * 12}px ${color}`;
    point.style.opacity = "0.9";
    point.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 20 - 10}deg)`;
    point.style.transition = "all 0.8s ease-out";
    container.appendChild(point);

    requestAnimationFrame(() => {
      point.style.transform += " scale(0)";
      point.style.opacity = "0";
    });

    setTimeout(() => point.remove(), lifeTime);
  });
}

/**
 * Fonction pour animer le logo lettre par lettre avec effet bounce
 * @param {HTMLElement} logoEl - L'élément contenant le logo
 * @param {Array} letters - Tableau de lettres du logo
 * @param {Object} options - Options de timing
 */
function animateLogo(logoEl, letters = [], options = {}) {
  if (!logoEl || letters.length === 0) return;

  const delayBetweenLetters = options.delayBetweenLetters || 200;

  let currentIndex = 0;

  function nextStep() {
    if (currentIndex >= letters.length) {
      const subtitle = document.querySelector(".hero-subtitle");
      const btn = document.querySelector(".hero-btn");
      if (subtitle) subtitle.classList.add("appear");
      if (btn) btn.classList.add("appear");
      return;
    }

    const span = document.createElement("span");
    span.textContent = letters[currentIndex];
    span.style.opacity = 0;
    span.style.display = "inline-block";
    span.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
    logoEl.insertBefore(span, logoEl.lastChild);

    setTimeout(() => {
      span.style.opacity = 1;
      span.style.transform = "translateY(-8px) scale(1.1)";
      setTimeout(() => {
        span.style.transform = "translateY(0) scale(1)";
      }, 200);
    }, 50);

    currentIndex++;
    setTimeout(nextStep, delayBetweenLetters);
  }

  document.addEventListener("DOMContentLoaded", nextStep);
}

/* ===== Utilisation ===== */
const hero = document.getElementById("hero");
const logo = document.getElementById("hero-logo");
const footer = document.querySelector("footer");
const footerlogo = document.getElementById("footer-logo");

initHeroPoints(hero, {
  colors: ["#0D0D0D", "#F5F5F5", "#3A86FF", "#FFBE0B", "#8D99AE"],
  interval: 35,
  maxOffset: 40,
  maxSize: 20,
  lifeTime: 3000
});
initHeroPoints(footer, {
  colors: ["#0D0D0D", "#F5F5F5", "#3A86FF", "#FFBE0B", "#8D99AE"],
  interval: 35,
  maxOffset: 40,
  maxSize: 20,
  lifeTime: 3000
});
initHeroPoints(header, {
  colors: ["#0D0D0D", "#F5F5F5", "#3A86FF", "#FFBE0B", "#8D99AE"],
  interval: 35,
  maxOffset: 40,
  maxSize: 20,
  lifeTime: 3000
});
animateLogo(logo, ["M", "S", "D", "E", "V"], { delayBetweenLetters: 200 });
/* Option Dark Mode */
const toggle = document.getElementById("toggle-dark");
if (toggle) {
  toggle.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
}


