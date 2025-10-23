 const hero = document.getElementById("hero");
let lastPointTime = 0;
const interval = 35; // un peu plus rapide pour plus de fluidité
const colors = [
  "#0D0D0D", // Noir profond
  "#F5F5F5", // Gris très clair (presque blanc, pour des reflets)
  "#3A86FF", // Bleu moderne (accent principal)
  "#FFBE0B", // Jaune doré chaud (accent secondaire)
  "#8D99AE"  // Gris bleuté neutre (tons de fond)
];


hero.addEventListener("mousemove", (e) => {
  const now = performance.now();
  if (now - lastPointTime < interval) return;
  lastPointTime = now;

  const point = document.createElement("div");
  point.className = "hero-point";

  const rect = hero.getBoundingClientRect();
  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = (Math.random() - 0.5) * 40;

  point.style.left = `${e.clientX - rect.left + offsetX}px`;
  point.style.top = `${e.clientY - rect.top + offsetY}px`;

  const size = 10 + Math.random() * 20;
  point.style.width = `${size}px`;
  point.style.height = `${size}px`;

  point.style.background = colors[Math.floor(Math.random() * colors.length)];
  point.style.borderRadius = Math.random() > 0.5 ? "50%" : "4px"; // forme aléatoire
  point.style.boxShadow = `0 0 ${8 + Math.random() * 12}px ${point.style.background}`;
  point.style.opacity = "0.9";
  point.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 20 - 10}deg)`;
  point.style.transition = "all 0.8s ease-out";

  hero.appendChild(point);

  // Animation de disparition plus douce
  requestAnimationFrame(() => {
    point.style.transform += " scale(0)";
    point.style.opacity = "0";
  });

  setTimeout(() => point.remove(), 3000);
});

// Bouton dark mode
const toggle = document.getElementById("toggle-dark");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}
//annimation logo hero
const logoParts = ["M", "S", "D", "E", "V"];
const logo = document.getElementById("hero-logo");

let currentIndex = 0;

function nextStep() {
  if (currentIndex >= logoParts.length) {
    // révéler sous-titre et bouton si nécessaire
    const subtitle = document.querySelector(".hero-subtitle");
    const btn = document.querySelector(".hero-btn");
    if (subtitle) subtitle.classList.add("appear");
    if (btn) btn.classList.add("appear");
    return;
  }

  // Ajouter la lettre avant le point final
  const span = document.createElement("span");
  span.textContent = logoParts[currentIndex];
  span.style.opacity = 0;
  span.style.display = "inline-block";
  span.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
  logo.insertBefore(span, logo.lastChild);

  // Animer la lettre avec bounce
  setTimeout(() => {
    span.style.opacity = 1;
    span.style.transform = "translateY(-8px) scale(1.1)"; // monte un peu
    setTimeout(() => {
      span.style.transform = "translateY(0) scale(1)"; // retombe doucement
    }, 200);
  }, 50);

  currentIndex++;
  setTimeout(nextStep, 200);
}


document.addEventListener("DOMContentLoaded", nextStep);

// hero resize

  function ajusterHero() {
    const isDesktop = window.innerWidth >= 1098; // 👉 seuil pour desktop
    if (isDesktop) {
      const headerHeight = header.offsetHeight;
      hero.style.minHeight = `calc(100vh - ${headerHeight}px)`;
    } else {
      // Sur mobile : on remet la hauteur par défaut
      hero.style.minHeight = "";
    }
  }

  ajusterHero();
  window.addEventListener("resize", ajusterHero);
