import { useEffect, useRef } from "react";
import { gsap, useGSAP, QUICK, STANDARD } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Dock } from "./Dock";

const ROLL_DUPLICATES = 4;

/** Splits plain text into GSAP-animatable "roll columns" — whitespace passes through untouched. */
function RollChars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) =>
        /\s/.test(ch) ? (
          ch
        ) : (
          <span className="roll-col" key={i}>
            <span className="roll-track">
              {Array.from({ length: ROLL_DUPLICATES }).map((_, d) => (
                <span className="roll-char" key={d}>
                  {ch}
                </span>
              ))}
            </span>
          </span>
        )
      )}
    </>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const floatingTitleRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const headlineEl = headlineRef.current;
      if (!headlineEl) return;

      const cs = getComputedStyle(headlineEl);
      const fontSizePx = parseFloat(cs.fontSize);
      const lhRaw = cs.lineHeight;
      const headlineLineHeightPx =
        lhRaw === "normal" ? fontSizePx * 1.2 : lhRaw.endsWith("px") ? parseFloat(lhRaw) : parseFloat(lhRaw) * fontSizePx;
      const headlineRollDistance = headlineLineHeightPx * (ROLL_DUPLICATES - 1);
      const rollTracks = gsap.utils.toArray<HTMLElement>(".roll-track", headlineEl);
      gsap.set(rollTracks, { y: 0 });

      // .roll-col clips to one line via overflow:hidden, but only actually
      // clips if it has an explicit height - without one it just grows to
      // fit all ROLL_DUPLICATES stacked copies, showing them all at once.
      const heightPx = headlineLineHeightPx + "px";
      headlineEl.querySelectorAll<HTMLElement>(".roll-col, .roll-char").forEach((el) => {
        el.style.height = heightPx;
      });

      const QUICK_D = reduceMotion ? 0.01 : QUICK;
      const STANDARD_D = reduceMotion ? 0.01 : STANDARD;

      const heroTl = gsap.timeline({ paused: true });
      const playHeroTl = () => gsap.delayedCall(0.15, () => heroTl.play());
      const hasPreloader = !!document.getElementById("preloader");
      if (hasPreloader) {
        window.addEventListener("preloader:done", playHeroTl, { once: true });
      } else {
        playHeroTl();
      }

      heroTl
        .from(".menubar .wordmark", { autoAlpha: 0, y: -14, duration: QUICK_D })
        .from(".badge", { autoAlpha: 0, x: -28, duration: STANDARD_D, clearProps: "all" }, "-=0.2")
        .to(
          rollTracks,
          {
            keyframes: [
              { y: -headlineRollDistance * 0.55, filter: "blur(6px)", duration: reduceMotion ? 0.005 : 0.32, ease: "power1.in" },
              { y: -headlineRollDistance, filter: "blur(0px)", duration: reduceMotion ? 0.005 : 0.4, ease: "power2.out" }
            ],
            stagger: reduceMotion ? 0 : 0.026
          },
          "-=0.25"
        )
        .from(
          [".note-illustration", ".note-3d"],
          { autoAlpha: 0, scale: 0.4, y: 24, rotation: "+=22", duration: STANDARD_D, stagger: 0.14, ease: "back.out(1.6)", clearProps: "all" },
          "-=0.45"
        )
        .from(
          ".note-uiux",
          { autoAlpha: 0, scale: 0.4, y: 24, rotation: "+=18", duration: STANDARD_D, ease: "back.out(1.6)", clearProps: "all" },
          "-=0.3"
        )
        .from(".tagline", { autoAlpha: 0, x: -18, duration: STANDARD_D, clearProps: "all" }, "-=0.4")
        .from(".dock", { autoAlpha: 0, y: 36, duration: STANDARD_D, ease: "back.out(1.5)", clearProps: "all" }, "-=0.45")
        .from(".dock-icon", { scale: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.2)" }, "-=0.4")
        .from(".floating-card", { autoAlpha: 0, x: 26, duration: STANDARD_D, clearProps: "all" }, "-=0.5");

      if (!reduceMotion && heroRef.current) {
        gsap.utils.toArray<HTMLElement>(".note", heroRef.current).forEach((note, i) => {
          gsap.to(note, { y: "+=6", duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 + i * 0.25 });
        });
      }

      return () => {
        window.removeEventListener("preloader:done", playHeroTl);
      };
    },
    { scope: heroRef, dependencies: [reduceMotion] }
  );

  useEffect(() => {
    const highlights = ["CORPORATE", "PLAYSTATION", "ABSA"];
    let hi = 0;
    const id = setInterval(() => {
      hi = (hi + 1) % highlights.length;
      if (floatingTitleRef.current) floatingTitleRef.current.textContent = highlights[hi];
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-bg" />
      <div className="hero-scrim" />

      <div className="menubar">
        <span className="wordmark">
          KAYBEE<sup>®</sup>
        </span>
      </div>

      <div className="hero-inner">
        <div className="badge">
          <img className="badge-avatar" src="/assets/img/profile.jpg" alt="Kaybee" />
          <div className="badge-text">
            <span className="badge-status">
              <i className="dot" />
              Available for work
            </span>
            <span className="badge-name">KAYBEE — VISUAL GROWTH PARTNER</span>
          </div>
        </div>

        <h1 className="headline" ref={headlineRef}>
          <RollChars text="VISUALS THAT" />
          <br />
          <RollChars text="MAKE " />
          <span className="note note-illustration" data-rotate="-6">
            <span className="note-badge nb-pink">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2 L14.5 8.5 L21 9 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9 L9.5 8.5 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Videography
          </span>
          <br />
          <RollChars text="PEOPLE " />
          <span className="note note-3d" data-rotate="5">
            <span className="note-badge nb-purple">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 21 7 21 17 12 22 3 17 3 7 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 7 12 12 21 7 M12 12 12 22" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            Storytelling
          </span>
          <br />
          <RollChars text="LOOK TWICE" />
        </h1>

        <span className="note note-uiux" data-rotate="-5">
          <span className="note-badge nb-green">
            <svg viewBox="0 0 24 24">
              <path d="M4 20 L4 15 L16 3 L21 8 L9 20 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          Photography
        </span>

        <div className="tagline">
          <span className="tagline-dash">—</span>
          <p>
            Not just visuals.
            <br />
            i make brands and their stories
            <br />
            stand out and connect with people
          </p>
        </div>

        <Dock />

        <a
          className="floating-card"
          href="https://www.instagram.com/stories/highlights/18040129850313371/"
          target="_blank"
          rel="noopener"
        >
          <img src="/assets/img/ui/instagram-icon.png" alt="Instagram" />
          <div className="floating-card-text">
            <div className="floating-card-top">
              <span>KAYBEE</span>
              <span>2026</span>
            </div>
            <strong ref={floatingTitleRef}>CORPORATE</strong>
            <span className="floating-card-cta">View highlight →</span>
          </div>
        </a>
      </div>
    </section>
  );
}
