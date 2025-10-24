 // Animation infinie du logo MSDEV
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("footer-logo");
  const sequence = [" ","M","S","D","E","V"];
  let i = 0;
  let deleting = false;

  function animate() {
    if (!deleting) {
      // Écriture
      logo.textContent = sequence.slice(0, i + 1).join("");
      i++;
      if (i === sequence.length) {
        deleting = true;
        setTimeout(animate, 1000); // pause avant effacement
        return;
      }
      setTimeout(animate, 150); // vitesse d'écriture
    } else {
      // Effacement rapide
      logo.textContent = sequence.slice(0, i).join("");
      i--;
      if (i < 0) {
        deleting = false;
        i = 0;
      }
      setTimeout(animate, 50); // vitesse d’effacement
    }
  }

  animate();
});
