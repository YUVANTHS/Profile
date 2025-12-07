// ----------------------------
// Register GSAP plugins
// ----------------------------
gsap.registerPlugin(ScrollTrigger);

// ----------------------------
// FIXED MENU TOGGLE (robust / ARIA-friendly)
// ----------------------------
// prefer id but fall back to first .menu-toggle (some pages or builds might differ)
let menuBtn = document.getElementById("menuToggle") || document.querySelector(".menu-toggle");
const overlay = document.getElementById("navOverlay");
const body = document.body;

if (menuBtn && overlay) {
  menuBtn.addEventListener("click", () => {
    const isOpen = overlay.classList.toggle("nav-overlay--open");
    menuBtn.classList.toggle("active", isOpen);

    // ARIA + body lock
    overlay.setAttribute("aria-hidden", String(!isOpen));
    menuBtn.setAttribute("aria-pressed", String(isOpen));
    if (isOpen) {
      body.classList.add("nav-open");
      document.documentElement.style.overflow = "hidden"; // lock scroll
    } else {
      body.classList.remove("nav-open");
      document.documentElement.style.overflow = ""; // unlock scroll
    }
  });

  // Close on link click
  overlay.querySelectorAll(".nav-overlay__link").forEach(link => {
    link.addEventListener("click", () => {
      overlay.classList.remove("nav-overlay--open");
      menuBtn.classList.remove("active");
      body.classList.remove("nav-open");
      overlay.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-pressed", "false");
      document.documentElement.style.overflow = "";
    });
  });
}

// ESC closes menu (global)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (overlay) overlay.classList.remove("nav-overlay--open");
    if (menuBtn) menuBtn.classList.remove("active");
    if (body) body.classList.remove("nav-open");
    if (overlay) overlay.setAttribute("aria-hidden", "true");
    if (menuBtn) menuBtn.setAttribute("aria-pressed", "false");
    document.documentElement.style.overflow = "";
  }
});


// -----------------------------------------------------
// HERO TEXT ANIMATION – CHARLIE STYLE
// -----------------------------------------------------
gsap.from(".hero__title-line--1", {
  y: 120,
  opacity: 0,
  duration: 1.1,
  ease: "power4.out",
});

gsap.from(".hero__title-line--2", {
  y: 120,
  opacity: 0,
  duration: 1.2,
  delay: 0.15,
  ease: "power4.out",
});

gsap.from(".hero__subtext p", {
  y: 40,
  opacity: 0,
  duration: 1,
  delay: 0.5,
  ease: "power3.out",
});

gsap.from(".hero__see-work", {
  y: 35,
  opacity: 0,
  duration: 0.9,
  delay: 0.7,
  ease: "power3.out",
});

gsap.to(".hero__see-work-line-inner", {
  height: "100%",
  duration: 1.4,
  delay: 0.8,
  ease: "power2.out"
});

// Scroll to projects button
document.getElementById("scrollToProjects").addEventListener("click", () => {
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
});

// -----------------------------------------------------
// PROJECT PANELS – PIN + OVERLAP + PARALLAX SCROLL
// -----------------------------------------------------
gsap.utils.toArray(".project-panel").forEach((panel, i) => {
  const bg = panel.querySelector(".project-panel__bg");
  const content = panel.querySelector(".project-panel__content");

  // Parallax zoom + move
  gsap.fromTo(
    bg,
    { scale: 1.25, y: 0 },
    {
      scale: 1,
      y: "-20vh",
      ease: "none",
      scrollTrigger: {
        trigger: panel,
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      }
    }
  );

  // Content fade/slide in
  gsap.from(content, {
    opacity: 0,
    y: 80,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: panel,
      start: "top 75%",
      toggleActions: "play none none reverse",
    }
  });

  // Pin each panel for overlap effect
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    pin: true,
    pinSpacing: false
  });
});

// -----------------------------------------------------
// EXPERIENCE CARDS ANIMATION
// -----------------------------------------------------
gsap.from(".experience-card", {
  opacity: 0,
  y: 40,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".experience-section",
    start: "top 80%",
  }
});

// -----------------------------------------------------
// JOURNEY – HORIZONTAL SCROLL
// -----------------------------------------------------
const journeyTrack = document.getElementById("processTrack");

if (journeyTrack) {
  const updateJourneyScroll = () => {
    const totalWidth = journeyTrack.scrollWidth;

    gsap.to(journeyTrack, {
      x: () => -(totalWidth - window.innerWidth + 150),
      ease: "none",
      scrollTrigger: {
        trigger: "#journey",
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  };

  updateJourneyScroll();
  window.addEventListener("resize", () => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    updateJourneyScroll();
  });
}

// -----------------------------------------------------
// FOOTER TEXT ANIMATION
// -----------------------------------------------------
gsap.from(".footer-cta__headline-main", {
  y: 120,
  opacity: 0,
  duration: 1.2,
  ease: "power4.out",
  scrollTrigger: {
    trigger: ".footer-cta",
    start: "top 85%",
  }
});

// -----------------------------------------------------
// PROCESS — continuous horizontal "train" (moved from index.html)
// -----------------------------------------------------
(function initProcessAutoScroll() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrapper = document.querySelector('.process-scroll-wrapper');
  const track = document.getElementById('processTrack');
  if (!wrapper || !track) return;

  // Ensure flex children
  track.style.display = 'flex';
  Array.from(track.children).forEach(c => c.style.flex = '0 0 auto');

  // Duplicate once for seamless loop (avoid multiple duplicates)
  if (!track.dataset.duplicated) {
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.duplicated = "true";
  }

  let resetAt = track.scrollWidth / 2;
  let pos = 0;
  const speed = 60; // px / sec
  let last = performance.now();

  function step(now) {
    const dt = (now - last) / 1000;
    last = now;
    pos += speed * dt;
    if (pos >= resetAt) pos -= resetAt;
    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(step);
  }

  // Start after paint so scrollWidth is accurate
  requestAnimationFrame(() => {
    resetAt = track.scrollWidth / 2;
    last = performance.now();
    requestAnimationFrame(step);
  });

  // Recompute on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resetAt = track.scrollWidth / 2;
    }, 150);
  }, { passive: true });
})();

// -----------------------------------------------------
// PAGE HERO reveal for subpages (was duplicated inline in subpages)
// -----------------------------------------------------
(function pageHeroReveal() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.page-hero') || document.querySelector('.hero');
  if (!hero) return;

  // helper: run GSAP text animations for page-hero sections (works for about/contact/journey)
  function animatePageHero(el) {
    // eyebrow, title, body
    const eyebrow = el.querySelector('.page-hero__eyebrow, .hero__intro, .page-hero__eyebrow');
    const title = el.querySelector('.page-hero__title, .hero__title');
    const text = el.querySelector('.page-hero__text, .hero__subtext p');

    // guard
    const tl = gsap.timeline();
    if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, 0);
    if (title) tl.from(title, { y: 60, opacity: 0, duration: 0.9, ease: "power4.out" }, 0.08);
    if (text) tl.from(text, { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.28);
  }

  if (prefersReduced) {
    hero.classList.add('is-visible');
    animatePageHero(hero);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        hero.classList.add('is-visible');
        // run GSAP animations when hero becomes visible
        try { animatePageHero(hero); } catch (err) { /* fail gracefully */ }
        obs.disconnect();
      }
    });
  }, { threshold: 0.02 });
  io.observe(hero);
})(); // end pageHeroReveal

/* -------------------------------
   HOW I WORK — header + cards reveal
   ------------------------------- */
(function howSectionReveal() {
  const how = document.querySelector('.how-section');
  if (!how) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // make visible immediately
    document.querySelectorAll('.how-card').forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
    return;
  }

  // reveal left column (label + title)
  gsap.from(how.querySelector('.how-left .how-label'), {
    y: 24,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: how, start: "top 80%" }
  });

  gsap.from(how.querySelector('.how-left .how-title'), {
    y: 14,
    opacity: 0,
    duration: 0.7,
    delay: 0.08,
    ease: "power3.out",
    scrollTrigger: { trigger: how, start: "top 80%" }
  });

  // stagger reveal cards
  gsap.from('.how-card', {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: how, start: "top 78%" }
  });
})();

/* -------------------------------
   GENERIC SECTION REVEAL
   - animate top-level sections (one-by-one) that don't have special pin/parallax logic
   ------------------------------- */
(function genericSectionReveal() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('main > section').forEach(s => s.style.opacity = 1);
    return;
  }

  const sections = Array.from(document.querySelectorAll('main > section'))
    .filter(s => !s.classList.contains('projects') && !s.classList.contains('projects-panels') && !s.classList.contains('project-panel'));

  sections.forEach(section => {
    // small guard: page-hero already animated via pageHeroReveal; skip if it contains .page-hero class
    if (section.classList.contains('page-hero')) return;

    gsap.from(section, {
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        toggleActions: "play none none reverse"
      }
    });
  });
})();
