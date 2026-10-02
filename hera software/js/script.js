document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);     const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const body = document.body;

    /* PAGE LOADER - Hızlı & Güvenli Yapı */
    const loader = $(".page-loader");
    if (loader) {
        const hideLoader = () => {
            if (loader.classList.contains("done")) return;
            loader.classList.add("done");
            setTimeout(() => {
                if (loader.parentNode) loader.remove();
            }, 800);
        };

        // Sayfa zaten yüklendiyse hemen kapat
        if (document.readyState === "complete") {
            setTimeout(hideLoader, 300);
        } else {
            window.addEventListener("load", hideLoader);
            // Her ihtimale karşı (resim takılması vs.) maksimum 1.8sn sonra zorla kapat
            setTimeout(hideLoader, 1800);
        }
    }

    /* CURSOR GLOW */
    const cursorGlow = $(".cursor-glow");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;

    window.addEventListener("pointermove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* MODAL HANDLING (CONTACT & AUTH) */
    const modals = $$(".modal");          function openModal(modalEl) {         if (!modalEl) return;         modalEl.classList.add("open");         body.style.overflow = "hidden";     }      function closeModal(modalEl) {         if (!modalEl) return;         modalEl.classList.remove("open");         body.style.overflow = "";     }      // Modal Tetikleyicileri     $$("[data-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalType = btn.dataset.modal;
            if (modalType === "contact") {
                openModal($("#contactModal"));
            } else if (modalType === "auth") {
                const authModal = $("#authModal");                 const initialTab = btn.dataset.tab \vert{}\vert{} "login";                 switchAuthTab(initialTab);                 openModal(authModal);             }         });     });      // Kapatma Butonları & Backdrop     $$(".modal-close, .modal-backdrop").forEach((el) => {
        el.addEventListener("click", () => {
            modals.forEach(closeModal);
        });
    });

    // Auth Modal Sekme Değiştirici
    function switchAuthTab(tabName) {
        const tabs = $$(".auth-tab-btn");         const panels = $$(".auth-panel");

        tabs.forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.authTab === tabName);
        });

        panels.forEach((panel) => {
            panel.classList.toggle("active", panel.id === `auth-${tabName}-panel`);
        });
    }

    $$(".auth-tab-btn").forEach((btn) => {         btn.addEventListener("click", () => {             switchAuthTab(btn.dataset.authTab);         });     });      /* ESC TUŞU İLE KAPATMA */     document.addEventListener("keydown", (e) => {         if (e.key === "Escape") modals.forEach(closeModal);     });      /* SAYAÇ ANIMASYONU */     const counters = $$
(".hero-stats strong");
    let countersStarted = false;

    function animateCounter(element) {
        const target = Number(element.dataset.count || 0);
        const suffix = target === 99 ? "%" : "+";
        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(target * progress);
            element.textContent = `${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const stats = $(".hero-stats");     if (stats) {         const observer = new IntersectionObserver((entries) => {             if (entries[0].isIntersecting && !countersStarted) {                 countersStarted = true;                 counters.forEach(animateCounter);             }         }, { threshold: 0.5 });         observer.observe(stats);     }      /* SPA YÖNLENDİRME SİSTEMİ */     const pageLinks = $$(".page-link");
    const internalPages = $$(".internal-page");     const homeContent = $$("main > .hero, main > .ticker, main > .section, main > .cta-section");

    function showPage(pageName) {
        internalPages.forEach(p => p.classList.remove("active"));
        homeContent.forEach(e => e.style.display = "none");

        const target = document.getElementById(pageName);
        if (target) {
            target.classList.add("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function showHome() {
        internalPages.forEach(p => p.classList.remove("active"));
        homeContent.forEach(e => e.style.display = "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    pageLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                history.pushState({ page }, "", `#${page}`);
                showPage(page);
            }
        });
    });

    $('[data-target="vitrin"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState({}, "", window.location.pathname);
        showHome();
    });

    window.addEventListener("popstate", () => {
        const page = window.location.hash.replace("#", "");
        if (page) showPage(page);
        else showHome();
    });

    const initialPage = window.location.hash.replace("#", "");
    if (initialPage) showPage(initialPage);
});
