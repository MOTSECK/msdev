const header = document.querySelector('header');

// --- Apparition lente du header au chargement ---
window.addEventListener('load', () => {
    if (header) {
        // On force un reflow pour que la transition démarre proprement
        void header.offsetWidth;

        setTimeout(() => {
            header.classList.add('begin');
        }, 900); // petit délai fluide
    }

    // ❌ supprimé : le scroll forcé qui faisait remonter la page
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
let scrollReady = false;

// attendre un peu après l'animation de début
setTimeout(() => (scrollReady = true), 1000);

window.addEventListener("scroll", () => {
    if (!scrollReady) return; // on attend que l'anim d'entrée soit finie

    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // === MOBILE ===
    if (window.innerWidth <= 1098) {
        if (scrollTop > lastScrollTop) {
            // on descend → cacher le header
            header.classList.add("hidden");
            header.classList.remove("visible");
        } else {
            // on remonte → montrer le header
            header.classList.add("visible");
            header.classList.remove("hidden");
        }

        // floatingNav désactivé sur mobile
        floatingNav.classList.remove("active");
    }

    // === DESKTOP ===
    else {
        if (scrollTop > 150 && scrollTop > lastScrollTop) {
            // on descend → cacher le header et montrer floatingNav
            header.classList.add("hide");
            floatingNav.classList.add("active");
        } 
        else if (scrollTop < lastScrollTop) {
            // on remonte → cacher le floatingNav
            floatingNav.classList.remove("active");

            // si on est presque en haut → montrer le header
            if (scrollTop < 100) {
                header.classList.remove("hide");
            }
        }

        // pas de hidden/visible sur desktop
        header.classList.remove("hidden", "visible");
    }

    lastScrollTop = Math.max(scrollTop, 0);
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
            const offset = 80; // ajuste selon la navbar fixe
            const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
            smoothScrollTo(targetY, 500); 
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


// --- Toujours revenir en haut au chargement ---
window.history.scrollRestoration = "manual"; // empêche le navigateur de se souvenir du scroll précédent



  // Initialisation du scroll fluide
  const lenis = new Lenis({
    duration: 2.0, // durée du scroll (plus grand = plus lent)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing doux
    smoothWheel: true, // active la fluidité à la molette
    smoothTouch: true, // fluide aussi sur mobile
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);


