// ----------------------------
// Register GSAP plugins
// ----------------------------
gsap.registerPlugin(ScrollTrigger);

// ----------------------------
// FIXED MENU TOGGLE
// ----------------------------
const menuBtn = document.getElementById("menuToggle");
const overlay = document.getElementById("navOverlay");
const body = document.body;

menuBtn.addEventListener("click", () => {
  const isOpen = overlay.classList.toggle("nav-overlay--open");
  menuBtn.classList.toggle("active", isOpen);

  if (isOpen) {
    body.classList.add("nav-open");
    document.documentElement.style.overflow = "hidden"; // lock scroll
  } else {
    body.classList.remove("nav-open");
    document.documentElement.style.overflow = ""; // unlock scroll
  }
});

// Close on link click
document.querySelectorAll(".nav-overlay__link").forEach(link => {
  link.addEventListener("click", () => {
    overlay.classList.remove("nav-overlay--open");
    menuBtn.classList.remove("active");
    body.classList.remove("nav-open");
    document.documentElement.style.overflow = "";
  });
});

// ESC closes menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlay.classList.remove("nav-overlay--open");
    menuBtn.classList.remove("active");
    body.classList.remove("nav-open");
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
