// darkmode.js
document.addEventListener("DOMContentLoaded", () => {
  const darkModeStyle = document.getElementById("darkmode-style");

  // Crée le bouton
  const toggleButton = document.createElement("button");
  toggleButton.className = "darkmode-toggle";
  toggleButton.setAttribute("aria-label", "Changer le thème");

  // SVG Lune / Soleil
  const sunSVG = `<svg class="icon sun" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>`;

  const moonSVG = `<svg class="icon moon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>`;

  document.body.appendChild(toggleButton);

  // Initialiser le thème automatiquement selon le système
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  let isDark = localStorage.getItem("darkMode") === "true" || (!localStorage.getItem("darkMode") && prefersDark.matches);

  function applyTheme() {
    darkModeStyle.disabled = !isDark;
    document.body.style.transition = "background 0.4s, color 0.4s";

    // Affiche seulement l'icône opposée
    toggleButton.innerHTML = isDark ? sunSVG : moonSVG;

    // Change le fond du bouton
    toggleButton.style.background = isDark ? "#fff" : "#000";
    toggleButton.style.color = isDark ? "#000" : "#fff";
  }

  applyTheme();

  // Basculer le darkmode au clic
  toggleButton.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("darkMode", isDark);
    applyTheme();
  });

  // Écoute changement système
  prefersDark.addEventListener("change", e => {
    if (!localStorage.getItem("darkMode")) {
      isDark = e.matches;
      applyTheme();
    }
  });

  // Style rapide du bouton
  Object.assign(toggleButton.style, {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    border: "2px solid #888",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    transition: "all 0.4s ease, transform 0.3s ease"
  });

  toggleButton.addEventListener("mouseenter", () => toggleButton.style.transform = "scale(1.1)");
  toggleButton.addEventListener("mouseleave", () => toggleButton.style.transform = "scale(1)");
});
