// scroll.js
document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du scroll fluide avec Lenis
  const lenis = new Lenis({
    duration: 1.8, // durée du mouvement (plus élevé = plus doux)
    easing: (t) => 1 - Math.pow(2, -10 * t), // effet d’amorti fluide
    smoothWheel: true,
    smoothTouch: true,
  });

  // Boucle d’animation
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);


  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "transform 1s ease-out, opacity 1.2s ease-out";
          entry.target.style.transform = "translateY(0)";
          entry.target.style.opacity = "1";
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((sec) => observer.observe(sec));
});
