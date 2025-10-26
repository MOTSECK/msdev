const header = document.querySelector('header');

// --- Apparition lente du header au chargement ---
window.addEventListener('load', () => {
    if (header) {
        void header.offsetWidth;
        setTimeout(() => {
            header.classList.add('begin');
        }, 900);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // --- Sélecteurs sûrs ---
    const header = document.querySelector('header');
    const burger = document.getElementById('burger');
    const navCenter = document.querySelector('.nav-center');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay'); // ✅ Ajouté

    // Si éléments manquants, on arrête proprement
    if (!header || !navCenter || !mobileMenu) {
        console.warn('Éléments introuvables — script arrêté.');
        return;
    }

    // --- Burger toggle ---
    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation(); // ✅ Empêche la propagation
            toggleMobileMenu();
        });
    }

    // Fonction pour ouvrir/fermer le menu
    function toggleMobileMenu() {
        const isActive = !mobileMenu.classList.contains('active');

        burger.classList.toggle('toggle');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        burger.setAttribute('aria-expanded', isActive);

        // Gérer l'overlay si il existe
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
    }

    // Fonction pour fermer le menu
    function closeMobileMenu() {
        burger.classList.remove('toggle');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
        burger.setAttribute('aria-expanded', 'false');

        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
    }

    // Fermer le menu mobile quand on clique un lien dedans
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });

    // Fermer le menu en cliquant sur l'overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            e.target !== burger &&
            !burger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fermer avec ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
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

    setTimeout(() => (scrollReady = true), 1000);

    window.addEventListener("scroll", () => {
        if (!scrollReady) return;
        // ✅ CONDITION AJOUTÉE : Ne pas cacher le header si le menu mobile est ouvert
        if (mobileMenu.classList.contains('active')) {
            return; // On quitte la fonction si le menu est ouvert
        }

        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // === MOBILE ===
        if (window.innerWidth <= 1098) {
            if (scrollTop > lastScrollTop) {
                header.classList.add("hidden");
                header.classList.remove("visible");
            } else {
                header.classList.add("visible");
                header.classList.remove("hidden");
            }
            floatingNav.classList.remove("active");
        }
        // === DESKTOP ===
        else {
            if (scrollTop > 150 && scrollTop > lastScrollTop) {
                header.classList.add("hide");
                floatingNav.classList.add("active");
            } else if (scrollTop < lastScrollTop) {
                floatingNav.classList.remove("active");
                if (scrollTop < 100) {
                    header.classList.remove("hide");
                }
            }
            header.classList.remove("hidden", "visible");
        }

        lastScrollTop = Math.max(scrollTop, 0);
    });

    // --- Smooth anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = 80;
            const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
            smoothScrollTo(targetY, 500);
        });
    });
});

// --- smoothScrollTo ---
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
window.scrollTo(0, 0);




