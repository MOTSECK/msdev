window.addEventListener("scroll", () => {
  const aboutUs = document.getElementById("aboutUs");
  const scrollY = window.scrollY;
  const start = window.innerHeight; // hauteur section accueil
  const end = start + window.innerHeight;

  if (scrollY >= start && scrollY <= end) {
    const progress = (scrollY - start) / window.innerHeight; // 0 -> 1
    aboutUs.style.transform = `translateY(${-100 + progress * 100}%)`;
  } else if (scrollY < start) {
    aboutUs.style.transform = "translateY(-100%)";
  } else {
    aboutUs.style.transform = "translateY(0)";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // --- Sélecteurs sûrs ---
  const header = document.querySelector('header');
  const burger = document.getElementById('burger');
  const navCenter = document.querySelector('.nav-center');

  // Si éléments manquants, on arrête proprement (évite erreurs JS)
  if (!header || !navCenter) {
    console.warn('Header ou .nav-center introuvable — script arrêté.');
    return;
  }

  // --- Mobile menu (création) ---
  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu');
  mobileMenu.innerHTML = `
    <ul class="nav-links">
      <li><a href="#acceuil">Accueil.</a></li>
      <li><a href="#aboutUs">Bio.</a></li>
      <li><a href="#realisations">Mission.</a></li>
      <li><a href="#services">Services.</a></li>
      <li><a href="#contact">Contact.</a></li>
    </ul>
  `;
  header.appendChild(mobileMenu);


  // --- Burger toggle (si burger présent) ---
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('toggle');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Fermer le menu mobile quand on clique un lien dedans
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      if (burger) burger.classList.remove('toggle');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });


  // --- Ripple buttons ---
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // --- Fonction pour la surbrillance (highlight) ---
  function setupNavHighlight(container) {
    if (!container) return;
    const navLinks = container.querySelectorAll('.nav-links a');
    const highlight = container.querySelector('.nav-highlight');

    if (!highlight || navLinks.length === 0) return;

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', e => {
        const rect = e.target.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();

        highlight.style.width = rect.width + 'px';
        highlight.style.left = (rect.left - parentRect.left) + 'px';
        highlight.style.opacity = '1';
      });
    });

    container.addEventListener('mouseleave', () => {
      highlight.style.opacity = '0';
    });
  }

  // Appliquer au menu principal
  setupNavHighlight(navCenter);

  // --- Créer UN SEUL floatingNav et l'ajouter ---
  const floatingNav = document.createElement('div');
  floatingNav.classList.add('nav-center-floating');
  // on clone le contenu HTML (liens + nav-highlight)
  floatingNav.innerHTML = navCenter.innerHTML;
  document.body.appendChild(floatingNav);

  // Appliquer l'effet de surbrillance au floating nav
  setupNavHighlight(floatingNav);

  // --- Empêcher menu contextuel sur images ---
  document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  // --- Show/hide header & floatingNav on scroll ---
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 150 && scrollTop > lastScrollTop) {
      header.classList.add('hide');
      floatingNav.classList.add('active');
    }else if (scrollTop < lastScrollTop && scrollTop < 100) {
      header.classList.remove('hide');
      floatingNav.classList.remove('active');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // --- Smooth anchors (utilise la fonction plus bas) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // si href = "#" ou ancre invalide, laisser comportement normal
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // ajuste selon ta navbar fixe
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
      smoothScrollTo(targetY, 500); // durée très lente
    });
  });
}); // fin DOMContentLoaded

// --- smoothScrollTo (en dehors du DOMContentLoaded, disponible globalement) ---
function smoothScrollTo(targetY, duration = 2500) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const time = timestamp - startTime;
    const progress = Math.min(time / duration, 1);

    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, Math.round(startY + diff * ease));

    if (time < duration) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}


// --- Apparition lente du header au chargement ---
// --- Toujours revenir en haut au chargement ---
window.history.scrollRestoration = "manual"; // empêche le navigateur de se souvenir du scroll précédent
window.scrollTo(0, 0);

// --- Apparition lente du header au chargement ---
window.addEventListener('load', () => {
  const header = document.querySelector('header');
  if (header) {
        setTimeout(() => {
      header.classList.add('debut');
    }, 900); // petit délai fluide


    // On force un reflow pour que la transition démarre proprement
    void header.offsetWidth;

    header.classList.remove('debut');
  }

  // 🔄 Forcer le scroll tout en haut une dernière fois (sécurité mobile/Safari)
  setTimeout(() => window.scrollTo(0, 0), 50);

});

