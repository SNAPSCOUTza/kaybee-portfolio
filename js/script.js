// ---------- Always open at the top of the page ----------
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
const forceScrollTop = () => window.scrollTo(0, 0);
forceScrollTop();
window.addEventListener("pageshow", forceScrollTop);
window.addEventListener("load", forceScrollTop);
setTimeout(forceScrollTop, 0);

// ---------- Text reveal on scroll: characters light up as the section scrolls through ----------
(() => {
  const roots = document.querySelectorAll(".text-reveal-scroll");
  if (!roots.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const START_OFFSET = 90; // % of viewport height where the reveal begins
  const END_OFFSET = 30;   // % of viewport height where the reveal completes
  const DIM_OPACITY = 0.2; // resting opacity of not-yet-revealed characters

  roots.forEach((root) => {
    root.style.visibility = "hidden";
    const segments = [];

    const wrap = (el) => {
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          if (!text.length) return;
          const frag = document.createDocumentFragment();
          for (const char of text) {
            if (/\s/.test(char)) {
              frag.appendChild(document.createTextNode(char));
            } else {
              const span = document.createElement("span");
              span.textContent = char;
              span.style.display = "inline";
              span.style.opacity = String(DIM_OPACITY);
              span.style.willChange = "opacity";
              frag.appendChild(span);
              segments.push(span);
            }
          }
          node.parentNode.replaceChild(frag, node);
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.tagName === "BR") {
          node.style.display = "inline";
          node.style.opacity = String(DIM_OPACITY);
          node.style.willChange = "opacity";
          segments.push(node);
          return;
        }
        wrap(node);
      });
    };
    wrap(root);
    root.style.visibility = "visible";
    if (!segments.length) return;

    let isVisible = false;
    let rafId = 0;

    const computeReveal = () => {
      if (!isVisible) return;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const startPx = vh * (START_OFFSET / 100);
      const endPx = vh * (END_OFFSET / 100);
      const totalRange = rect.height + (startPx - endPx);
      const scrolled = startPx - rect.top;
      const progress = Math.min(Math.max(scrolled / totalRange, 0), 1);
      const total = segments.length;
      const litCount = Math.floor(progress * total);
      segments.forEach((seg, i) => {
        if (i < litCount) {
          seg.style.opacity = "1";
        } else if (i === litCount) {
          const frac = progress * total - litCount;
          seg.style.opacity = String(DIM_OPACITY + frac * (1 - DIM_OPACITY));
        } else {
          seg.style.opacity = String(DIM_OPACITY);
        }
      });
    };

    const scheduleReveal = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeReveal);
    };

    new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) scheduleReveal();
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    ).observe(root);

    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal, { passive: true });
    scheduleReveal();
  });
})();

// ---------- Preloader: counts up then reveals the site ----------
(() => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const wordEl = preloader.querySelector(".preloader-word");
  const wordSpans = preloader.querySelectorAll(".preloader-word span");
  const countEl = preloader.querySelector(".preloader-count");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finish = () => {
    preloader.style.animation = "none";
    if (window.gsap) {
      gsap.to(preloader, {
        autoAlpha: 0,
        duration: 0.6,
        onComplete: () => preloader.remove()
      });
    } else {
      preloader.remove();
    }
  };

  if (!window.gsap) {
    // No GSAP available — don't trap visitors behind a stuck loader.
    preloader.remove();
    return;
  }

  if (reduceMotion) {
    wordEl.style.display = "none";
    countEl.style.opacity = 1;
    countEl.textContent = "100%";
    gsap.to(preloader, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: () => preloader.remove() });
  } else {
    const counter = { val: 0 };
    const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.2, finish) });

    tl.from(wordSpans, {
      autoAlpha: 0,
      y: 14,
      filter: "blur(10px)",
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.out"
    })
      .to(wordEl, { autoAlpha: 0, y: -10, duration: 0.35, ease: "power2.in" }, "+=0.5")
      .to(countEl, { autoAlpha: 1, duration: 0.3 }, "<")
      .to(counter, {
        val: 100,
        duration: 1.8,
        ease: "power1.inOut",
        onUpdate: () => { countEl.textContent = Math.round(counter.val) + "%"; }
      }, "<");
  }
})();

// Rotate the featured highlight label on the floating card
const highlights = ["CORPORATE", "PLAYSTATION", "ABSA"];
const titleEl = document.getElementById("floatingCardTitle");
if (titleEl) {
  let hi = 0;
  setInterval(() => {
    hi = (hi + 1) % highlights.length;
    titleEl.textContent = highlights[hi];
  }, 3200);
}

// Services: dropdown detail on click, one open at a time
document.querySelectorAll(".service-item").forEach((item) => {
  const row = item.querySelector(".service-row");
  row.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    document.querySelectorAll(".service-item").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".service-row").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("is-open");
      row.setAttribute("aria-expanded", "true");
    }
  });
});

// Keep only one FAQ item open at a time
document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      document.querySelectorAll(".faq-item").forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// ============ Motion (GSAP) ============
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  (() => {
      // Signature easing + duration palette for this site
      gsap.defaults({ ease: "power3.out" });
      const QUICK = reduceMotion ? 0.01 : 0.4;
      const STANDARD = reduceMotion ? 0.01 : 0.65;
      const DRAMATIC = reduceMotion ? 0.01 : 0.9;

      // ---------- Headline: build rolling-text columns ----------
      // Each character becomes a small clipped column holding several stacked
      // copies of itself; animating the column reveals the same letter again
      // but with a rolling blur-slide flourish. Sticky-note badges and <br>
      // are left untouched so their own pop-in animation still works.
      const headlineEl = document.querySelector(".headline");
      const headlineRollColumns = [];
      let headlineLineHeightPx = 0;
      if (headlineEl) {
        const cs = getComputedStyle(headlineEl);
        const fontSizePx = parseFloat(cs.fontSize);
        const lhRaw = cs.lineHeight;
        headlineLineHeightPx =
          lhRaw === "normal" ? fontSizePx * 1.2 : lhRaw.endsWith("px") ? parseFloat(lhRaw) : parseFloat(lhRaw) * fontSizePx;
        const DUPLICATES = 4;

        const wrapForRoll = (el) => {
          Array.from(el.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent || "";
              if (!text.length) return;
              const frag = document.createDocumentFragment();
              for (const char of text) {
                if (/\s/.test(char)) {
                  frag.appendChild(document.createTextNode(char));
                  continue;
                }
                const col = document.createElement("span");
                col.className = "roll-col";
                col.style.height = headlineLineHeightPx + "px";
                const track = document.createElement("span");
                track.className = "roll-track";
                for (let i = 0; i < DUPLICATES; i++) {
                  const c = document.createElement("span");
                  c.className = "roll-char";
                  c.style.height = headlineLineHeightPx + "px";
                  c.textContent = char;
                  track.appendChild(c);
                }
                col.appendChild(track);
                frag.appendChild(col);
                headlineRollColumns.push(track);
              }
              node.parentNode.replaceChild(frag, node);
              return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (node.tagName === "BR" || node.classList.contains("note")) return;
            wrapForRoll(node);
          });
        };
        wrapForRoll(headlineEl);
        gsap.set(headlineRollColumns, { y: 0 });
      }
      const headlineRollDistance = headlineLineHeightPx * 3; // (DUPLICATES - 1)

      // ---------- Hero entrance choreography ----------
      const heroTl = gsap.timeline({ delay: 0.15 });

      heroTl
        .from(".wordmark", { autoAlpha: 0, y: -14, duration: QUICK })
        .from(".badge", { autoAlpha: 0, x: -28, duration: STANDARD, clearProps: "all" }, "-=0.2")
        .to(headlineRollColumns, {
          keyframes: [
            { y: -headlineRollDistance * 0.55, filter: "blur(6px)", duration: reduceMotion ? 0.005 : 0.32, ease: "power1.in" },
            { y: -headlineRollDistance, filter: "blur(0px)", duration: reduceMotion ? 0.005 : 0.4, ease: "power2.out" }
          ],
          stagger: reduceMotion ? 0 : 0.026
        }, "-=0.25")
        .from(
          [".note-illustration", ".note-3d"],
          {
            autoAlpha: 0,
            scale: 0.4,
            y: 24,
            rotation: "+=22",
            duration: STANDARD,
            stagger: 0.14,
            ease: "back.out(1.6)",
            clearProps: "all"
          },
          "-=0.45"
        )
        .from(
          ".note-uiux",
          {
            autoAlpha: 0,
            scale: 0.4,
            y: 24,
            rotation: "+=18",
            duration: STANDARD,
            ease: "back.out(1.6)",
            clearProps: "all"
          },
          "-=0.3"
        )
        .from(".tagline", { autoAlpha: 0, x: -18, duration: STANDARD, clearProps: "all" }, "-=0.4")
        .from(
          ".dock",
          { autoAlpha: 0, y: 36, duration: STANDARD, ease: "back.out(1.5)", clearProps: "all" },
          "-=0.45"
        )
        .from(
          ".dock-icon",
          { scale: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.2)" },
          "-=0.4"
        )
        .from(
          ".floating-card",
          { autoAlpha: 0, x: 26, duration: STANDARD, clearProps: "all" },
          "-=0.5"
        );

      // ---------- Dock: real macOS-style hover magnification ----------
      const dock = document.querySelector(".dock");
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (dock && canHover && !reduceMotion) {
        const dockIcons = gsap.utils.toArray(".dock-icon");
        const REST_SCALE = 1;
        const PEAK_SCALE = 1.28; // magnify amount reduced 60% from original 1.7 peak
        const SIGMA = 46; // falloff spread in px; smaller = tighter magnification
        const LIFT = 16; // px the closest icon rises

        const setters = dockIcons.map((icon) => ({
          icon,
          scaleXTo: gsap.quickTo(icon, "scaleX", { duration: 0.28, ease: "power3.out" }),
          scaleYTo: gsap.quickTo(icon, "scaleY", { duration: 0.28, ease: "power3.out" }),
          yTo: gsap.quickTo(icon, "y", { duration: 0.28, ease: "power3.out" })
        }));

        dock.addEventListener("mousemove", (e) => {
          setters.forEach(({ icon, scaleXTo, scaleYTo, yTo }) => {
            const rect = icon.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const dx = e.clientX - center;
            const falloff = Math.exp(-(dx * dx) / (2 * SIGMA * SIGMA));
            const scale = REST_SCALE + (PEAK_SCALE - REST_SCALE) * falloff;
            scaleXTo(scale);
            scaleYTo(scale);
            yTo(-LIFT * falloff);
          });
        });

        dock.addEventListener("mouseleave", () => {
          setters.forEach(({ scaleXTo, scaleYTo, yTo }) => {
            scaleXTo(REST_SCALE);
            scaleYTo(REST_SCALE);
            yTo(0);
          });
        });
      }

      // ---------- Ambient float on the pinned sticky notes ----------
      if (!reduceMotion) {
        gsap.utils.toArray(".note").forEach((note, i) => {
          gsap.to(note, {
            y: "+=6",
            duration: 2.4 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2 + i * 0.25
          });
        });
      }

      // ---------- Ambient float on the footer Mac illustration ----------
      const footerMac = document.querySelector(".footer-mac");
      if (footerMac && !reduceMotion) {
        gsap.to(footerMac, {
          y: "+=14",
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // ---------- Generic block reveals (single-unit sections) ----------
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 36,
          duration: STANDARD,
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // ---------- Stats: staggered rise ----------
      gsap.utils.toArray(".stat").forEach((stat, i) => {
        gsap.from(stat, {
          autoAlpha: 0,
          y: 26,
          duration: STANDARD,
          delay: (i % 2) * 0.08,
          clearProps: "all",
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // ---------- Impact stats: count up on scroll ----------
      gsap.utils.toArray(".stat-num[data-count-to]").forEach((el) => {
        const target = parseFloat(el.dataset.countTo);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const format = (v) => prefix + v.toFixed(decimals) + suffix;

        if (reduceMotion) {
          el.textContent = format(target);
          return;
        }

        el.textContent = format(0);
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => { el.textContent = format(counter.val); },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true
          }
        });
      });

      // ---------- Work cards: pinned-paper settle, batched ----------
      ScrollTrigger.batch(".work-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 70,
            scale: 0.88,
            duration: STANDARD,
            stagger: 0.12,
            ease: "back.out(1.3)",
            clearProps: "all",
            overwrite: true
          }),
        onLeaveBack: (els) => gsap.set(els, { autoAlpha: 0, y: 70 })
      });

      // ---------- Services: rows slide in from left ----------
      gsap.utils.toArray(".service-row").forEach((row) => {
        gsap.from(row, {
          autoAlpha: 0,
          x: -26,
          duration: STANDARD,
          clearProps: "all",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // ---------- Clients: batched rise ----------
      ScrollTrigger.batch(".logo-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 40,
            duration: STANDARD,
            stagger: 0.1,
            clearProps: "all",
            overwrite: true
          })
      });

      // ---------- Reviews: batched rise ----------
      ScrollTrigger.batch(".review-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 40,
            duration: STANDARD,
            stagger: 0.1,
            clearProps: "all",
            overwrite: true
          })
      });

      // ---------- FAQs visual: image frames in, then heading reveals ----------
      const faqsVisual = document.querySelector(".faqs-visual");
      if (faqsVisual) {
        const faqsImg = faqsVisual.querySelector(".faqs-visual-img");
        const faqsHeading = faqsVisual.querySelector(".faqs-heading");
        gsap.timeline({
          scrollTrigger: {
            trigger: faqsVisual,
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        })
          .from(faqsImg, { autoAlpha: 0, scale: 1.12, duration: STANDARD + 0.35, ease: "power3.out", clearProps: "all" })
          .from(faqsHeading, { autoAlpha: 0, y: 24, duration: DRAMATIC + 0.4, ease: "power2.out", clearProps: "all" }, "-=0.15");
      }

      // ---------- FAQs: quick cascade ----------
      gsap.utils.toArray(".faq-item").forEach((item, i) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 18,
          duration: QUICK,
          delay: i * 0.03,
          clearProps: "all",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // ---------- Bottom blur: fades out as the page scrolls toward the footer ----------
      const bottomBlur = document.querySelector(".bottom-blur");
      if (bottomBlur) {
        gsap.to(bottomBlur, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });
      }
  })();
}
