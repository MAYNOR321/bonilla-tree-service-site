// ============================================================================
// BONILLA TREE SERVICE LLC — site behavior
// Vanilla JS, no build step, no dependencies.
// ============================================================================
// 1. CONFIG — business info + gallery data. Change phone/email/area here only.
// 2. i18n — EN/ES dictionary + applyLang()
// 3. Header scroll state
// 4. Scroll reveals (rise, why-cards, masonry)
// 5. Hero parallax
// 6. Signature rope: carabiner snap-to-section
// 7. Gallery render + lightbox (View Transitions)
// 8. Estimate form: validation, compose, fetch delivery (see CONFIG.FORM)
// 9. Mobile bar / misc wiring
// ============================================================================

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * 1. CONFIG
   * ------------------------------------------------------------------- */
  const CONFIG = {
    businessName: "Bonilla Tree Service LLC",

    // PHONES — primary is the number on the business card. The old 228
    // number is listed once in the footer as "Second line"; delete the
    // phoneSecondary lines (and the footer row that shows it) if the
    // client decides to drop it entirely.
    phoneDisplay: "601-466-9145",
    phoneTel: "+16014669145",
    phoneSecondaryDisplay: "228-918-0483",
    phoneSecondaryTel: "+12289180483",

    // TODO: replace once the domain is purchased, e.g.
    // info@bonillatreeservicellc.com — see README for the provider comparison.
    email: "bonillatreeservicesllc@gmail.com",

    // Footer copyright shows the FOUNDING year (client request) — never
    // auto-derive it from the current date. yearsInBusiness is hardcoded
    // too: bump it by hand each year (README has the reminder).
    companyFoundedYear: 2022,
    yearsInBusiness: 4,
    // No Facebook URL was supplied with the source materials — when it
    // arrives, set it here and re-add the footer Contact link for it.
    facebookUrl: "",

    // SERVICE AREA — Jackson, Mississippi (confirmed in the final pass).
    // Single source of truth: everything that shows the area or the city
    // list reads from here via [data-config]. The schema.org block in
    // index.html <head> mirrors city/region/areaCities — update both if
    // this changes.
    city: "Jackson",
    region: "MS",
    serviceArea: { en: "Jackson, Mississippi and surrounding areas", es: "Jackson, Mississippi y alrededores" },
    areaCities: ["Jackson", "Ridgeland", "Madison", "Brandon", "Pearl", "Clinton", "Flowood", "Byram", "Canton", "Richland", "Terry", "Florence"],

    hours: { en: "Open 24 hours, 7 days a week.", es: "Abierto 24 horas, los 7 días." },

    /* ---- FORM DELIVERY — fill these in to go live (Option A) ------------
     * The form is fully plumbed (fetch + loading/success/error states).
     * Until a key is set it falls back to opening the visitor's own email
     * app pre-filled, so the form is never a dead end.
     *
     * 1) EMAIL to the owner's inbox (no server needed):
     *    - Go to https://web3forms.com, create a free access key using the
     *      owner's email address (250 submissions/month free).
     *    - Paste the key below as web3formsKey. Done — every submission
     *      lands in his inbox.
     *    (Formspree works the same way: create a form, then set
     *     endpoint: "https://formspree.io/f/XXXX" instead of the key.)
     *
     * 2) WHATSAPP copy to the owner's phone:
     *    - CallMeBot/Twilio keys are PRIVATE and must not live in this
     *      file. Deploy serverless/whatsapp-webhook.js (Netlify/Vercel —
     *      instructions inside the file) with the key as an env var, then
     *      paste the deployed function URL below.
     *    - Leave "" to skip the WhatsApp copy; email still works.
     * ------------------------------------------------------------------ */
    FORM: {
      web3formsKey: "",
      whatsappWebhookUrl: "",
    },
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // w/h are the pixel dimensions of each file's -800 rendition (long edge
  // capped at 800px by scripts/process-images.js) — used for width/height
  // attributes so the browser reserves the right box before the image
  // loads (zero CLS). Update these if you re-export the source photos.
  const GALLERY = [
    {
      file: "climber-sectional-pine",
      captionEn: "Taking a tall pine down piece by piece",
      captionEs: "Bajando un pino alto pieza por pieza",
      span: "tall",
      w: 600,
      h: 800,
    },
    {
      file: "ground-bucking-chainsaw",
      captionEn: "Cutting up a fallen tree so we can haul it off",
      captionEs: "Cortando un árbol caído para llevárnoslo",
      span: "wide",
      w: 600,
      h: 800,
    },
    {
      file: "oak-canopy-backyard-pool",
      captionEn: "Trimming a big oak right over the pool",
      captionEs: "Podando un roble grande justo sobre la piscina",
      span: "tall",
      w: 450,
      h: 800,
    },
    {
      file: "skidsteer-stump-round-brick",
      captionEn: "Hauling out a freshly cut piece of trunk",
      captionEs: "Sacando una rodaja de tronco recién cortada",
      span: "normal",
      w: 450,
      h: 800,
    },
    {
      file: "climber-chainsaw-closeup",
      captionEn: "Careful cutting, high up in the tree",
      captionEs: "Cortando con cuidado, en lo alto del árbol",
      span: "normal",
      w: 600,
      h: 800,
    },
    {
      file: "skidsteer-felled-pine",
      captionEn: "Our skid steer moving a felled pine",
      captionEs: "Nuestro skid steer moviendo un pino talado",
      span: "tall",
      w: 412,
      h: 800,
    },
    {
      file: "climber-topping-pine",
      captionEn: "Topping a pine before bringing it down",
      captionEs: "Descopando un pino antes de bajarlo",
      span: "normal",
      w: 600,
      h: 800,
    },
    {
      file: "crew-job-park",
      captionEn: "Trimming trees over a playground on a commercial job",
      captionEs: "Podando árboles sobre un parque infantil, trabajo comercial",
      span: "wide",
      w: 600,
      h: 800,
    },
    {
      file: "climber-rappel-dead-tree",
      captionEn: "Working down a dead tree, one piece at a time",
      captionEs: "Bajando un árbol seco, pieza por pieza",
      span: "normal",
      w: 459,
      h: 800,
    },
    {
      file: "climber-standing-dead-trunk",
      captionEn: "Our climber at work — no bucket truck needed",
      captionEs: "Nuestro escalador en acción — sin camión de canasta",
      span: "tall",
      w: 416,
      h: 800,
    },
    {
      file: "skidsteer-yard-fence",
      captionEn: "Clearing out a tight backyard with the skid steer",
      captionEs: "Despejando un patio angosto con el skid steer",
      span: "normal",
      // 416x800 since 31-Aug-2026: the source was an iPhone screenshot with a
      // back-chevron tab on the right edge and a letterbox bar at the bottom,
      // both cropped off in source-assets/image7.jpeg (right 8%, bottom 221px).
      w: 416,
      h: 800,
    },
  ];

  /* ---------------------------------------------------------------------
   * 2. i18n
   * ------------------------------------------------------------------- */
  function detectInitialLang() {
    // ?lang= wins over everything: the hreflang alternate in <head> points
    // crawlers (and anyone sharing a link) at ?lang=es, so that URL has to
    // actually render Spanish for the annotation to be truthful.
    const param = new URLSearchParams(location.search).get("lang");
    if (param === "en" || param === "es") return param;
    const stored = localStorage.getItem("bts-lang");
    if (stored === "en" || stored === "es") return stored;
    return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  }

  let currentLang = detectInitialLang();

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem("bts-lang", lang);
    document.documentElement.lang = lang;

    // Keep the URL in step with the visible language so a shared link opens
    // in the same language, and so the ?lang=es hreflang alternate stays
    // consistent with what the page actually shows.
    try {
      const url = new URL(location.href);
      if (lang === "es") url.searchParams.set("lang", "es");
      else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
    } catch {
      // Non-blocking: older engines or a file:// context just keep the URL.
    }

    document.querySelectorAll("[data-en]").forEach((el) => {
      const value = lang === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en");
      if (value == null) return;
      if (el.hasAttribute("data-target-attr")) {
        el.setAttribute(el.getAttribute("data-target-attr"), value);
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-lang-toggle] button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    // Re-render dynamic content that carries its own bilingual data
    renderGallery();
    updateAsideConfig();
  }

  /* ---------------------------------------------------------------------
   * 3. Header scroll state
   * ------------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  /* ---------------------------------------------------------------------
   * 4. Scroll reveals
   * ------------------------------------------------------------------- */
  // Observer-driven reveals fail CLOSED (content stays invisible) in engines
  // where IntersectionObserver callbacks never run — e.g. some in-app
  // webviews. Every reveal gets a timed failsafe that forces the end state;
  // in healthy browsers the observer wins the race and the timer is a no-op.
  const REVEAL_FAILSAFE_MS = 3000;

  function setupReveal(selector, className) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add(className));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    setTimeout(() => els.forEach((el) => el.classList.add(className)), REVEAL_FAILSAFE_MS);
  }

  function setupStaggeredReveal(containerSelector, itemSelector, className, staggerMs) {
    document.querySelectorAll(containerSelector).forEach((container) => {
      const items = Array.from(container.querySelectorAll(itemSelector));
      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add(className));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = items.indexOf(entry.target);
              setTimeout(() => entry.target.classList.add(className), index >= 0 ? (index % 6) * staggerMs : 0);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
      );
      items.forEach((el) => io.observe(el));
      setTimeout(() => items.forEach((el) => el.classList.add(className)), REVEAL_FAILSAFE_MS);
    });
  }

  // Native loading="lazy" never fired on the deployed site in at least one
  // engine (0/11 gallery images loaded even sitting in the viewport), so
  // this promotes lazy images to eager as they approach the viewport and
  // retries any that ended up in an error state. Idempotent — safe to call
  // again after re-rendering (language toggle re-creates the gallery).
  let lazyRescueIO = null;
  function rescueLazyImages() {
    const imgs = document.querySelectorAll('img[loading="lazy"]:not([data-lazy-rescue])');
    if (!imgs.length) return;
    if (!("IntersectionObserver" in window)) {
      imgs.forEach((img) => {
        img.setAttribute("data-lazy-rescue", "");
        img.loading = "eager";
      });
      return;
    }
    // A broken <img> inside <picture> keeps its errored candidate on a bare
    // src reset — the <source> still dictates currentSrc — so the retry
    // re-inserts the whole <picture>; if the webp candidate broke, the
    // second failure drops the webp <source>s and falls back to jpg.
    function retryBrokenImage(img) {
      if (!(img.complete && img.naturalWidth === 0)) return;
      const pic = img.closest("picture");
      if (pic) {
        if (img.hasAttribute("data-img-retried")) {
          pic.querySelectorAll("source").forEach((s) => s.remove());
        }
        img.setAttribute("data-img-retried", "");
        const clone = pic.cloneNode(true);
        pic.replaceWith(clone);
        const cloneImg = clone.querySelector("img");
        if (cloneImg) cloneImg.addEventListener("error", () => retryBrokenImage(cloneImg), { once: true });
        return;
      }
      const src = img.getAttribute("src");
      img.removeAttribute("src");
      img.setAttribute("src", src);
    }

    function promote(img) {
      img.loading = "eager";
      if (img.complete && img.naturalWidth === 0) {
        retryBrokenImage(img);
      } else {
        img.addEventListener("error", () => retryBrokenImage(img), { once: true });
      }
    }

    if (!lazyRescueIO) {
      lazyRescueIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            lazyRescueIO.unobserve(entry.target);
            promote(entry.target);
          });
        },
        { rootMargin: "900px 0px" }
      );
    }
    imgs.forEach((img) => {
      img.setAttribute("data-lazy-rescue", "");
      lazyRescueIO.observe(img);
    });
    // Failsafe: if the observer never fires, load everything outright —
    // a fully-loaded page beats a photo-less one on any connection.
    setTimeout(() => {
      imgs.forEach((img) => {
        lazyRescueIO.unobserve(img);
        promote(img);
      });
    }, 4000);
  }

  /* ---------------------------------------------------------------------
   * 5. Hero parallax
   * ------------------------------------------------------------------- */
  function setupHeroParallax() {
    const hero = document.querySelector(".hero");
    const planes = document.querySelectorAll(".hero-plane");
    if (!hero || !planes.length || prefersReducedMotion) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const MAX_SHIFT = 6;
    const LERP = 0.08;

    hero.addEventListener("pointermove", (e) => {
      const rect = hero.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * MAX_SHIFT;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * MAX_SHIFT;
    });

    hero.addEventListener("pointerleave", () => {
      target.x = 0;
      target.y = 0;
    });

    let scrollFactor = 0;
    window.addEventListener(
      "scroll",
      () => {
        scrollFactor = Math.min(window.scrollY / window.innerHeight, 1);
      },
      { passive: true }
    );

    let rafId = null;
    function frame() {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      planes.forEach((plane) => {
        const depth = Number(plane.dataset.depth || 0) / 10;
        const px = current.x * depth;
        const py = current.y * depth + scrollFactor * depth * 30;
        plane.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
      });
      rafId = requestAnimationFrame(frame);
    }

    // Only animate while the hero is on screen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && rafId === null) {
            rafId = requestAnimationFrame(frame);
          } else if (!entry.isIntersecting && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(hero);
    rafId = requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------------
   * 6. Signature rope: slack state at the last anchor
   * ------------------------------------------------------------------- */
  // The carabiner's position is pure CSS (transform + animation-timeline:
  // scroll(root) — see .carabiner in styles.css), so it glides continuously
  // in lockstep with the rope draw. This only toggles the rope's
  // slack/taut color at the final section.
  function setupRope() {
    const rail = document.querySelector(".rope-rail");
    const anchors = Array.from(document.querySelectorAll("[data-rope-anchor]"));
    if (!rail || !anchors.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rail.classList.toggle("is-slack", entry.target.hasAttribute("data-rope-end"));
          }
        });
      },
      { threshold: 0.35 }
    );
    anchors.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
   * 7. Gallery render + lightbox
   * ------------------------------------------------------------------- */
  let lightboxIndex = 0;

  function imgMarkup(item, widths) {
    const base = `assets/images/${item.file}`;
    const srcsetWebp = widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
    const srcsetJpg = widths.map((w) => `${base}-${w}.jpg ${w}w`).join(", ");
    return { base, srcsetWebp, srcsetJpg };
  }

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    grid.innerHTML = "";
    GALLERY.forEach((item, index) => {
      const caption = currentLang === "es" ? item.captionEs : item.captionEn;
      const { base, srcsetWebp, srcsetJpg } = imgMarkup(item, [800, 1600]);

      const fig = document.createElement("div");
      fig.className = `masonry-item masonry-item--${item.span}`;
      fig.innerHTML = `
        <button type="button" data-index="${index}" aria-label="${caption}">
          <picture>
            <source type="image/webp" srcset="${srcsetWebp}" sizes="(min-width: 900px) 33vw, 50vw">
            <img
              src="${base}-800.jpg"
              srcset="${srcsetJpg}"
              sizes="(min-width: 900px) 33vw, 50vw"
              width="${item.w}" height="${item.h}"
              loading="${index < 2 ? "eager" : "lazy"}"
              decoding="async"
              alt="${caption}">
          </picture>
          <span class="masonry-caption">${caption}</span>
        </button>`;
      grid.appendChild(fig);
    });

    setupStaggeredReveal("#gallery-grid", ".masonry-item", "is-visible", 90);
    wireGalleryButtons();
    rescueLazyImages();
  }

  function wireGalleryButtons() {
    document.querySelectorAll("#gallery-grid button[data-index]").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
    });
  }

  let lastFocusedEl = null;

  // Wrapper around document.startViewTransition: a transition that gets
  // interrupted (rapid clicks, navigating away) rejects .ready/.finished
  // with InvalidStateError — swallow that instead of leaving an unhandled
  // promise rejection in the console.
  function runViewTransition(fn) {
    if (!document.startViewTransition || prefersReducedMotion) {
      fn();
      return;
    }
    const transition = document.startViewTransition(fn);
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  }

  function openLightbox(index) {
    const dialog = document.getElementById("lightbox");
    if (!dialog) return;
    lastFocusedEl = document.activeElement;
    lightboxIndex = index;
    renderLightbox();

    const show = () => {
      dialog.setAttribute("open", "");
      document.body.style.overflow = "hidden";
      dialog.querySelector(".lightbox-close").focus();
    };

    runViewTransition(show);
  }

  function closeLightbox() {
    const dialog = document.getElementById("lightbox");
    if (!dialog) return;
    const hide = () => {
      dialog.removeAttribute("open");
      document.body.style.overflow = "";
      if (lastFocusedEl) lastFocusedEl.focus();
    };
    runViewTransition(hide);
  }

  function renderLightbox() {
    const item = GALLERY[lightboxIndex];
    const caption = currentLang === "es" ? item.captionEs : item.captionEn;
    const { base, srcsetWebp, srcsetJpg } = imgMarkup(item, [800, 1600]);
    const figure = document.querySelector(".lightbox-figure");
    figure.innerHTML = `
      <picture>
        <source type="image/webp" srcset="${srcsetWebp}" sizes="90vw">
        <img src="${base}-1600.jpg" srcset="${srcsetJpg}" sizes="90vw" alt="${caption}">
      </picture>`;
    document.querySelector(".lightbox-caption").textContent = caption;
  }

  function stepLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + GALLERY.length) % GALLERY.length;
    runViewTransition(renderLightbox);
  }

  function setupLightboxChrome() {
    const dialog = document.getElementById("lightbox");
    if (!dialog) return;

    dialog.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    dialog.querySelector(".lightbox-nav--prev").addEventListener("click", () => stepLightbox(-1));
    dialog.querySelector(".lightbox-nav--next").addEventListener("click", () => stepLightbox(1));

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!dialog.hasAttribute("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "Tab") trapFocus(e, dialog);
    });

    // Touch swipe
    let touchStartX = null;
    dialog.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    dialog.addEventListener(
      "touchend",
      (e) => {
        if (touchStartX == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) stepLightbox(dx > 0 ? -1 : 1);
        touchStartX = null;
      },
      { passive: true }
    );
  }

  function trapFocus(e, container) {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------------------------------------------------------------------
   * 8. Estimate form
   * ------------------------------------------------------------------- */
  const SERVICE_LABELS = {
    removal: { en: "Tree removal", es: "Remoción de árboles" },
    trimming: { en: "Tree trimming", es: "Poda de árboles" },
    pruning: { en: "Pruning", es: "Poda estructural" },
    stump: { en: "Stump grinding", es: "Trituración de tocones" },
    lot: { en: "Lot clearing", es: "Limpieza de terreno" },
    grading: { en: "Land grading", es: "Nivelación de terreno" },
    planting: { en: "Tree planting", es: "Plantación de árboles" },
    flowerbeds: { en: "Flower beds", es: "Arriates / jardineras" },
    fences: { en: "Fences", es: "Cercas" },
  };

  const URGENCY_LABELS = {
    emergency: { en: "Emergency", es: "Emergencia" },
    week: { en: "This week", es: "Esta semana" },
    pricing: { en: "Just pricing", es: "Solo quiero precios" },
  };

  function updateAsideConfig() {
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.dataset.config;
      if (key === "phone") el.textContent = CONFIG.phoneDisplay;
      if (key === "phone2") el.textContent = CONFIG.phoneSecondaryDisplay;
      if (key === "email") el.textContent = CONFIG.email;
      if (key === "area") el.textContent = currentLang === "es" ? CONFIG.serviceArea.es : CONFIG.serviceArea.en;
      // NOTE: "areas" is deliberately not handled here. The footer city list is
      // static HTML in index.html because six of those cities link to their own
      // service-area page, and that is the crawl path from the homepage to
      // them — it must not depend on JS running. Keep the footer list and
      // data/cities.js in sync; scripts/check-seo.js enforces it.
      if (key === "hours") el.textContent = currentLang === "es" ? CONFIG.hours.es : CONFIG.hours.en;
      if (key === "founded") el.textContent = String(CONFIG.companyFoundedYear);
    });
  }

  // Internal-only emergency flag: when the visitor picks "emergency" the
  // owner's email gets an URGENT subject prefix, a banner as the very first
  // body line, and a high-priority header. Nothing changes for the visitor.
  const EMERGENCY_BANNER = {
    en: "⚠ EMERGENCY REQUEST\n========================",
    es: "⚠ SOLICITUD DE EMERGENCIA\n========================",
  };

  function composeMessage(data, lang) {
    const services = data.services.map((s) => SERVICE_LABELS[s][lang]).join(", ");
    const urgency = URGENCY_LABELS[data.urgency][lang];
    const banner = data.urgency === "emergency" ? EMERGENCY_BANNER[lang] : null;
    if (lang === "es") {
      return [
        banner,
        `Solicitud de estimado — ${CONFIG.businessName}`,
        `Nombre: ${data.name}`,
        `Teléfono: ${data.phone}`,
        data.email ? `Correo: ${data.email}` : null,
        `Dirección / zona: ${data.address}`,
        `Servicio(s): ${services || "No especificado"}`,
        `Urgencia: ${urgency}`,
        data.details ? `Detalles: ${data.details}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    }
    return [
      banner,
      `Free estimate request — ${CONFIG.businessName}`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      `Property address / area: ${data.address}`,
      `Service(s): ${services || "Not specified"}`,
      `How soon: ${urgency}`,
      data.details ? `Details: ${data.details}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const VALIDATION_MESSAGES = {
    name: { en: "Please add your name so we know who to ask for.", es: "Escriba su nombre para saber a quién preguntar." },
    phone: { en: "Please add a phone number so we can call you back.", es: "Agregue un teléfono para poder llamarlo." },
    address: { en: "Tell us the address or the general area of the property.", es: "Indique la dirección o la zona de la propiedad." },
  };

  function setupEstimateForm() {
    const form = document.getElementById("estimate-form");
    if (!form) return;
    const confirmState = document.getElementById("confirm-state");

    function getData() {
      const formData = new FormData(form);
      return {
        name: (formData.get("name") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        address: (formData.get("address") || "").toString().trim(),
        services: formData.getAll("service"),
        urgency: (formData.get("urgency") || "pricing").toString(),
        details: (formData.get("details") || "").toString().trim(),
      };
    }

    function validate(data) {
      let ok = true;
      ["name", "phone", "address"].forEach((field) => {
        const errorEl = form.querySelector(`[data-error-for="${field}"]`);
        const inputEl = form.querySelector(`[name="${field}"]`);
        if (!data[field]) {
          ok = false;
          if (errorEl) errorEl.textContent = VALIDATION_MESSAGES[field][currentLang];
          if (inputEl) inputEl.setAttribute("aria-invalid", "true");
        } else {
          if (errorEl) errorEl.textContent = "";
          if (inputEl) inputEl.removeAttribute("aria-invalid");
        }
      });
      return ok;
    }

    const submitBtn = document.getElementById("estimate-submit");
    const statusEl = document.getElementById("form-status");

    function setStatus(en, es, kind) {
      if (!statusEl) return;
      statusEl.dataset.en = en;
      statusEl.dataset.es = es;
      statusEl.textContent = currentLang === "es" ? es : en;
      statusEl.className = "form-status" + (kind ? ` form-status--${kind}` : "");
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.classList.toggle("is-loading", isLoading);
      const span = submitBtn.querySelector("span");
      if (isLoading) {
        span.dataset.en = "Sending…";
        span.dataset.es = "Enviando…";
      } else {
        span.dataset.en = "Send request";
        span.dataset.es = "Enviar solicitud";
      }
      span.textContent = currentLang === "es" ? span.dataset.es : span.dataset.en;
    }

    async function handleSubmit() {
      const data = getData();
      if (!validate(data)) return;
      const message = composeMessage(data, currentLang);
      const isEmergency = data.urgency === "emergency";
      const subject = isEmergency
        ? currentLang === "es"
          ? "URGENTE — Nueva solicitud de estimado"
          : "URGENT — New estimate request"
        : currentLang === "es"
          ? "Solicitud de estimado gratis"
          : "Free estimate request";
      setStatus("", "", null);

      // No delivery key configured yet — graceful fallback: open the
      // visitor's own email app pre-filled and show the copyable message.
      // Never a silent dead end. See CONFIG.FORM to wire real delivery.
      if (!CONFIG.FORM.web3formsKey) {
        window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        showConfirmation(message, "fallback");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: CONFIG.FORM.web3formsKey,
            subject: `${subject} — ${data.name}`,
            from_name: data.name,
            email: data.email || undefined,
            // Web3Forms passes custom fields through to the email; this makes
            // the emergency flag filterable/flaggable in the owner's inbox.
            priority: isEmergency ? "high" : "normal",
            message,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error("send failed");

        // Fire-and-forget WhatsApp copy through the serverless webhook, if
        // deployed. A failure here must not fail the whole submission.
        if (CONFIG.FORM.whatsappWebhookUrl) {
          fetch(CONFIG.FORM.whatsappWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          }).catch(() => {});
        }

        form.reset();
        setStatus(
          "Request sent — we'll get back to you shortly.",
          "Solicitud enviada — le responderemos pronto.",
          "ok"
        );
        showConfirmation(message, "success");
      } catch {
        setStatus(
          "We couldn't send it right now — please call or text 601‑466‑9145 and we'll take care of you.",
          "No se pudo enviar en este momento — llámenos o mándenos un texto al 601‑466‑9145 y con gusto lo atendemos.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    function showConfirmation(message, mode) {
      if (!confirmState) return;
      const h3 = confirmState.querySelector("h3");
      const p = confirmState.querySelector("p");
      if (mode === "success") {
        h3.dataset.en = "Request sent";
        h3.dataset.es = "Solicitud enviada";
        p.dataset.en = "We got it. A copy of what you sent is below — if it's urgent, call or text 601‑466‑9145.";
        p.dataset.es = "La recibimos. Abajo queda una copia de lo que envió — si es urgente, llámenos o mándenos un texto al 601‑466‑9145.";
      } else {
        h3.dataset.en = "Message ready";
        h3.dataset.es = "Mensaje listo";
        p.dataset.en = "If your email app didn't open, copy the message below and email it to us — or call or text 601‑466‑9145.";
        p.dataset.es = "Si su app de correo no se abrió, copie el mensaje de abajo y envíenoslo por correo — o llámenos o mándenos un texto al 601‑466‑9145.";
      }
      h3.textContent = currentLang === "es" ? h3.dataset.es : h3.dataset.en;
      p.textContent = currentLang === "es" ? p.dataset.es : p.dataset.en;

      confirmState.classList.add("is-visible");
      confirmState.querySelector(".confirm-message").textContent = message;
      confirmState.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });

      const copyBtn = confirmState.querySelector(".confirm-copy-btn");
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(message);
          copyBtn.textContent = copyBtn.dataset[currentLang === "es" ? "copiedEs" : "copiedEn"];
        } catch {
          // Clipboard API unavailable — the message is already shown as text
          // in .confirm-message for manual copy.
        }
        setTimeout(() => {
          copyBtn.textContent = copyBtn.dataset[currentLang === "es" ? "labelEs" : "labelEn"];
        }, 2200);
      };
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  /* ---------------------------------------------------------------------
   * 9. Wiring
   * ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-lang-toggle] button").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });

    applyLang(currentLang);
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    setupReveal(".mask-lines", "is-visible");
    setupReveal(".cut-line", "is-visible");
    setupStaggeredReveal(".slab-grid", ".slab", "is-visible", 80);
    setupStaggeredReveal(".why-cards", ".why-card", "is-visible", 90);
    rescueLazyImages();

    setupHeroParallax();
    setupRope();
    setupLightboxChrome();
    setupEstimateForm();

    // The footer year is the FOUNDING year from CONFIG (rendered by
    // updateAsideConfig via [data-config="founded"]), not the current date.
  });
})();
