document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =========================================================
       GLOBAL
    ========================================================= */

    const body = document.body;
    const html = document.documentElement;


    /* =========================================================
       PAGE LOADER
    ========================================================= */

    const loader = $(".page-loader");

    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("done");

                setTimeout(() => {
                    loader.remove();
                }, 900);
            }, 900);
        });
    }


    /* =========================================================
       CURSOR GLOW
    ========================================================= */

    const cursorGlow = $(".cursor-glow");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener("pointermove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
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


    /* =========================================================
       CURSOR HOVER EFFECT
    ========================================================= */

    const interactiveElements = $$(
        "a, button, .nav-item, .product-card, .logo-tile, .icon-btn"
    );

    interactiveElements.forEach((element) => {

        element.addEventListener("pointerenter", () => {
            cursorGlow?.classList.add("active");
        });

        element.addEventListener("pointerleave", () => {
            cursorGlow?.classList.remove("active");
        });

    });


    /* =========================================================
       CLICK RIPPLE
    ========================================================= */

    document.addEventListener("pointerdown", (event) => {

        const ripple = document.createElement("span");

        ripple.className = "click-ripple";

        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;

        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 700);

    });


    /* =========================================================
       SCROLL PROGRESS
    ========================================================= */

    const progress = document.createElement("div");

    progress.className = "scroll-progress";

    progress.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:0%;
        height:2px;
        z-index:99999;
        pointer-events:none;
        background:linear-gradient(
            90deg,
            #f48fb1,
            #c084fc,
            #8b5cf6
        );
        box-shadow:
            0 0 15px rgba(244,143,177,.7),
            0 0 30px rgba(139,92,246,.4);
    `;

    body.appendChild(progress);

    function updateScrollProgress() {

        const scrollTop =
            window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            scrollHeight > 0
                ? (scrollTop / scrollHeight) * 100
                : 0;

        progress.style.width = `${percentage}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements = $$(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting)
                    return;

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach((element, index) => {

        element.style.transitionDelay =
            `${Math.min(index * 35, 280)}ms`;

        revealObserver.observe(element);

    });


    /* =========================================================
       3D TILT CARDS
    ========================================================= */

    $$(".tilt-card").forEach((card) => {

        card.addEventListener("pointermove", (event) => {

            if (window.innerWidth < 850)
                return;

            const rect =
                card.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const rotateX = y * -7;
            const rotateY = x * 7;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
            `;

            card.style.setProperty(
                "--mouse-x",
                `${(x + 0.5) * 100}%`
            );

            card.style.setProperty(
                "--mouse-y",
                `${(y + 0.5) * 100}%`
            );

        });

        card.addEventListener("pointerleave", () => {

            card.style.transform = "";

        });

    });


    /* =========================================================
       MAGNETIC BUTTONS
    ========================================================= */

    $$(".magnetic").forEach((element) => {

        element.addEventListener("pointermove", (event) => {

            if (window.innerWidth < 850)
                return;

            const rect =
                element.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            element.style.transform =
                `translate(${x * 0.14}px, ${y * 0.14}px)`;

        });

        element.addEventListener("pointerleave", () => {

            element.style.transform = "";

        });

    });


    /* =========================================================
       HERO PARALLAX
    ========================================================= */

    const hero = $(".hero");

    const heroOrbs = $$(".hero-orb");

    if (hero && heroOrbs.length) {

        hero.addEventListener("pointermove", (event) => {

            if (window.innerWidth < 850)
                return;

            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            heroOrbs.forEach((orb, index) => {

                const strength =
                    (index + 1) * 12;

                orb.style.transform = `
                    translate(
                        ${x * strength}px,
                        ${y * strength}px
                    )
                `;

            });

        });

        hero.addEventListener("pointerleave", () => {

            heroOrbs.forEach((orb) => {
                orb.style.transform = "";
            });

        });

    }


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const sidebar =
        $("#sidebar");

    const mobileMenu =
        $(".mobile-menu");

    let menuOpen = false;

    function openMenu() {

        if (!sidebar || !mobileMenu)
            return;

        menuOpen = true;

        sidebar.classList.add("open");

        body.classList.add("menu-open");

        const spans =
            $$("span", mobileMenu);

        if (spans[0]) {
            spans[0].style.transform =
                "translateY(5px) rotate(45deg)";
        }

        if (spans[1]) {
            spans[1].style.opacity = "0";
        }

        if (spans[2]) {
            spans[2].style.transform =
                "translateY(-5px) rotate(-45deg)";
        }

        $$(".nav-item", sidebar).forEach(
            (item, index) => {

                item.style.transitionDelay =
                    `${index * 45}ms`;

                item.style.transform =
                    "translateX(0)";

                item.style.opacity = "1";

            }
        );
    }


    function closeMenu() {

        if (!sidebar || !mobileMenu)
            return;

        menuOpen = false;

        sidebar.classList.remove("open");

        body.classList.remove("menu-open");

        const spans =
            $$("span", mobileMenu);

        spans.forEach((span) => {
            span.style.transform = "";
            span.style.opacity = "";
        });

    }


    mobileMenu?.addEventListener(
        "click",
        () => {

            if (menuOpen)
                closeMenu();
            else
                openMenu();

        }
    );


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const navItems =
        $$(".nav-item");

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

            closeMenu();

        });

    });


    /* =========================================================
       ACTIVE SECTION ON SCROLL
    ========================================================= */

    const sections =
        $$("main section[id]");

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting)
                        return;

                    const id =
                        entry.target.id;

                    navItems.forEach((item) => {

                        const href =
                            item.getAttribute("href");

                        if (href === `#${id}`) {
                            navItems.forEach(
                                n => n.classList.remove("active")
                            );

                            item.classList.add("active");
                        }

                    });

                });

            },
            {
                threshold: 0.35
            }
        );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });


    /* =========================================================
       SMOOTH ANCHOR SCROLL
    ========================================================= */

    $$("a[href^='#']").forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#")
                return;

            const target =
                $(targetId);

            if (!target)
                return;

            event.preventDefault();

            const offset = 85;

            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

        });

    });


    /* =========================================================
       CONTACT MODAL
    ========================================================= */

    const modal =
        $("#contactModal");

    const modalClose =
        $(".modal-close");

    const modalBackdrop =
        $(".modal-backdrop");

    function openModal() {

        if (!modal)
            return;

        modal.classList.add("open");

        body.classList.add("modal-open");

        setTimeout(() => {

            const input =
                modal.querySelector("input");

            input?.focus();

        }, 300);

    }


    function closeModal() {

        if (!modal)
            return;

        modal.classList.remove("open");

        body.classList.remove("modal-open");

    }


    $$("[data-modal='contact']")
        .forEach((button) => {

            button.addEventListener(
                "click",
                openModal
            );

        });


    modalClose?.addEventListener(
        "click",
        closeModal
    );

    modalBackdrop?.addEventListener(
        "click",
        closeModal
    );


    /* =========================================================
       ESC KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape")
                return;

            closeModal();
            closeMenu();

        }
    );


    /* =========================================================
       TOAST
    ========================================================= */

    const toast =
        $("#toast");

    const toastText =
        toast?.querySelector("span");

    let toastTimer = null;

    function showToast(message) {

        if (!toast)
            return;

        if (toastText)
            toastText.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 2800);

    }


    $$("[data-toast]").forEach((element) => {

        element.addEventListener(
            "click",
            () => {

                showToast(
                    element.dataset.toast
                );

            }
        );

    });


    /* =========================================================
       SEARCH
    ========================================================= */

    const search =
        $("#search");

    const products =
        $$(".product-card");

    search?.addEventListener(
        "input",
        () => {

            const query =
                search.value
                    .toLowerCase()
                    .trim();

            products.forEach((product) => {

                const title =
                    (
                        product.dataset.title ||
                        product.textContent
                    ).toLowerCase();

                const category =
                    (
                        product.dataset.category ||
                        ""
                    ).toLowerCase();

                const match =
                    !query ||
                    title.includes(query) ||
                    category.includes(query);

                if (match) {

                    product.style.display = "";

                    requestAnimationFrame(() => {
                        product.style.opacity = "1";
                        product.style.transform = "";
                    });

                } else {

                    product.style.opacity = "0";
                    product.style.transform =
                        "scale(.94)";

                    setTimeout(() => {

                        if (
                            product.style.opacity === "0"
                        ) {
                            product.style.display =
                                "none";
                        }

                    }, 250);

                }

            });

        }
    );


    /* =========================================================
       CTRL + K SEARCH
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                search?.focus();

                search?.select();

            }

        }
    );


    /* =========================================================
       ANIMATED COUNTERS
    ========================================================= */

    const counters =
        $$(".hero-stats strong");

    let countersStarted = false;

    function animateCounter(element) {

        const target =
            Number(element.dataset.count || 0);

        const suffix =
            target === 99 ? "%" : "+";

        const duration = 1300;

        const startTime =
            performance.now();

        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    4
                );

            const current =
                Math.floor(
                    target * eased
                );

            element.textContent =
                `${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }

        }

        requestAnimationFrame(update);

    }


    const stats =
        $(".hero-stats");

    if (stats) {

        const counterObserver =
            new IntersectionObserver(
                (entries) => {

                    if (
                        !entries[0].isIntersecting ||
                        countersStarted
                    ) {
                        return;
                    }

                    countersStarted = true;

                    counters.forEach(
                        animateCounter
                    );

                },
                {
                    threshold: 0.6
                }
            );

        counterObserver.observe(stats);

    }


    /* =========================================================
       THEME BUTTON
    ========================================================= */

    $("#themeToggle")?.addEventListener(
        "click",
        () => {

            showToast(
                "tema sistemi backend asamasinda aktif edilecek"
            );

        }
    );


    /* =========================================================
       FAKE FORM
    ========================================================= */

    $(".fake-form .primary-btn")
        ?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showToast(
                    "iletisim sistemi backend asamasinda baglanacak"
                );

            }
        );


    /* =========================================================
       PRODUCT HOVER GLOW
    ========================================================= */

    $$(".product-card").forEach((card) => {

        card.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    });


    /* =========================================================
       LOGO TILE RANDOM FLOAT
    ========================================================= */

    $$(".logo-tile").forEach(
        (tile, index) => {

            tile.style.animationDelay =
                `${index * -0.35}s`;

        }
    );


    /* =========================================================
       WINDOW SCROLL EFFECT
    ========================================================= */

    let lastScroll = 0;

    const topbar =
        $(".topbar");

    window.addEventListener(
        "scroll",
        () => {

            const current =
                window.scrollY;

            if (topbar) {

                if (current > 50) {
                    topbar.classList.add(
                        "scrolled"
                    );
                } else {
                    topbar.classList.remove(
                        "scrolled"
                    );
                }

            }

            lastScroll = current;

        },
        { passive: true }
    );


    /* =========================================================
       PREVENT BODY SHIFT
    ========================================================= */

    const style =
        document.createElement("style");

    style.textContent = `

        body.menu-open,
        body.modal-open {
            overflow: hidden;
        }

        .click-ripple {
            position: fixed;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(244,143,177,.25);
            border: 1px solid rgba(244,143,177,.7);
            animation: heraRipple .65s ease-out forwards;
        }

        .cursor-glow.active {
            width: 380px;
            height: 380px;
            opacity: .7;
        }

        @keyframes heraRipple {
            0% {
                transform:
                    translate(-50%, -50%)
                    scale(0);
                opacity: 1;
            }

            70% {
                opacity: .45;
            }

            100% {
                transform:
                    translate(-50%, -50%)
                    scale(8);
                opacity: 0;
            }
        }

        .product-card {
            transition:
                opacity .25s ease,
                transform .25s ease;
        }

        .topbar.scrolled {
            box-shadow:
                0 12px 40px rgba(0,0,0,.18);
        }

        @media (max-width: 850px) {

            .sidebar .nav-item {
                transform:
                    translateX(-20px);
                opacity: 0;
                transition:
                    transform .35s ease,
                    opacity .35s ease;
            }

            .sidebar.open .nav-item {
                transform:
                    translateX(0);
                opacity: 1;
            }

        }

    `;

    document.head.appendChild(style);


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    requestAnimationFrame(() => {

        document.body.classList.add(
            "app-ready"
        );

    });

});




/* =========================================================
   SPA PAGE SYSTEM
   ========================================================= */

const pageLinks = document.querySelectorAll(".page-link");

const internalPages = document.querySelectorAll(".internal-page");

const homeContent = document.querySelectorAll(
    "main > .hero, main > .ticker, main > .section, main > .cta-section, main > footer"
);


function showPage(pageName) {

    /*
     * once her seyi kapat
     */

    internalPages.forEach(page => {
        page.classList.remove("active");
    });


    /*
     * anasayfa elemanlarini gizle
     */

    homeContent.forEach(element => {

        element.style.display = "none";

    });


    /*
     * istenen sayfayi bul
     */

    const target =
        document.getElementById(pageName);


    if (!target)
        return;


    /*
     * sayfayi ac
     */

    target.classList.add("active");


    /*
     * sidebar active
     */

    pageLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.dataset.page === pageName
        ) {
            link.classList.add("active");
        }

    });


    /*
     * sayfanin basina git
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showHome() {

    internalPages.forEach(page => {
        page.classList.remove("active");
    });


    homeContent.forEach(element => {

        element.style.display = "";

    });


    pageLinks.forEach(link => {
        link.classList.remove("active");
    });


    const homeLink =
        document.querySelector(
            '[data-target=""]'
        );

    homeLink?.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
 * sidebar linkleri
 */

pageLinks.forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        const page =
            link.dataset.page;

        if (!page)
            return;


        /*
         * browser adresini degistir
         * ama sayfayi yeniden yukleme
         */

        history.pushState(
            {
                page: page
            },
            "",
            `#${page}`
        );


        showPage(page);

    });

});


/*
 * anasayfa linki
 */

document
    .querySelectorAll(
        '[data-target="vitrin"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                history.pushState(
                    {},
                    "",
                    window.location.pathname
                );

                showHome();

            }
        );

    });


/*
 * geri / ileri butonlari
 */

window.addEventListener(
    "popstate",
    () => {

        const page =
            window.location.hash
                .replace("#", "");


        if (page) {

            showPage(page);

        } else {

            showHome();

        }

    }
);


/*
 * sayfa ilk acildiginda
 * hash varsa direkt o sayfayi ac
 */

const initialPage =
    window.location.hash
        .replace("#", "");


if (initialPage) {

    setTimeout(() => {
        showPage(initialPage);
    }, 50);

}


/* =========================================================
   STATIC MARKET CART (database-ready, no backend requests)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const catalog = {
    "interface-kit": { id:"interface-kit", name:"studio interface kit", price:2400, type:"ui / ux", symbol:"UI" },
    "poster-pack": { id:"poster-pack", name:"editorial poster pack", price:950, type:"graphic", symbol:"✳" }
  };
  const storageKey = "hera_static_cart_v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (!Array.isArray(cart)) cart=[]; } catch (_) { cart=[]; }
  const money = value => new Intl.NumberFormat("tr-TR", {style:"currency",currency:"TRY",maximumFractionDigits:0}).format(value);
  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch (_) {} };
  const countNodes = document.querySelectorAll("[data-cart-count]");
  const itemHost = document.getElementById("cart-items");
  const countHost = document.getElementById("cart-item-count");
  const subtotalHost = document.getElementById("cart-subtotal");
  const totalHost = document.getElementById("cart-total");
  function renderCart() {
    const count = cart.reduce((sum,item)=>sum+item.qty,0);
    const total = cart.reduce((sum,item)=>sum+(catalog[item.id]?.price||0)*item.qty,0);
    countNodes.forEach(node=>node.textContent=count);
    if (countHost) countHost.textContent=`${count} ürün`;
    if (subtotalHost) subtotalHost.textContent=money(total);
    if (totalHost) totalHost.textContent=money(total);
    if (!itemHost) return;
    itemHost.replaceChildren();
    if (!cart.length) {
      const empty=document.createElement("div"); empty.className="cart-empty";
      empty.innerHTML='<span>◇</span><h3>sepetin şimdilik boş</h3><p>market sayfasından ilgini çeken ürünleri sepetine ekleyebilirsin.</p><a href="#market" class="page-link" data-page="market">markete dön ↗</a>';
      itemHost.appendChild(empty);
      empty.querySelector("a").addEventListener("click",event=>{event.preventDefault();history.pushState({page:"market"},"","#market");if(typeof showPage==="function")showPage("market");});
      return;
    }
    cart.forEach(item=>{ const product=catalog[item.id]; if(!product)return; const row=document.createElement("article"); row.className="cart-row";
      const thumb=document.createElement("div");thumb.className="cart-thumb";thumb.textContent=product.symbol;
      const info=document.createElement("div");const title=document.createElement("h3");title.textContent=product.name;const desc=document.createElement("p");desc.textContent=`${product.type} · adet: ${item.qty}`;info.append(title,desc);
      const price=document.createElement("div");price.className="cart-row-price";const amount=document.createElement("strong");amount.textContent=money(product.price*item.qty);const remove=document.createElement("button");remove.className="remove-cart-item";remove.type="button";remove.textContent="ürünü çıkar";remove.addEventListener("click",()=>{cart=cart.filter(entry=>entry.id!==item.id);persist();renderCart();});price.append(amount,remove);row.append(thumb,info,price);itemHost.appendChild(row);
    });
  }
  document.querySelectorAll("[data-add-cart]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.addCart;if(!catalog[id])return;const existing=cart.find(item=>item.id===id);if(existing)existing.qty+=1;else cart.push({id,qty:1});persist();renderCart();const original=button.innerHTML;button.innerHTML='sepete eklendi <span>✓</span>';setTimeout(()=>button.innerHTML=original,1200);}));
  document.getElementById("checkout-button")?.addEventListener("click",()=>{if(!cart.length){document.querySelector("#toast span")?.replaceChildren(document.createTextNode("önce marketten ürün eklemelisin"));document.getElementById("toast")?.classList.add("show");setTimeout(()=>document.getElementById("toast")?.classList.remove("show"),2600);return;}const lines=cart.map(item=>`${catalog[item.id].name} x ${item.qty} — ${money(catalog[item.id].price*item.qty)}`).join("\n");const total=cart.reduce((sum,item)=>sum+catalog[item.id].price*item.qty,0);const message=`Hera Software sipariş talebi\n${lines}\nToplam: ${money(total)}\n\nBu talep statik siteden oluşturulmuştur.`;if(navigator.clipboard?.writeText){navigator.clipboard.writeText(message).then(()=>alert("sipariş özeti kopyalandı. ödeme ve sipariş onayı için Hera Software ile iletişime geçebilirsin."));}else{alert(message);}});
  renderCart();
  const menu=document.querySelector(".mobile-menu");menu?.addEventListener("click",()=>{const header=document.querySelector(".topbar");const opened=header?.classList.toggle("nav-open")||false;menu.setAttribute("aria-expanded",String(opened));});
  document.querySelectorAll(".top-nav .page-link").forEach(link=>link.addEventListener("click",()=>document.querySelector(".topbar")?.classList.remove("nav-open")));
});
