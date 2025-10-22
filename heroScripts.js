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
