import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const START_OFFSET = 90; // % of viewport height where the reveal begins
const END_OFFSET = 30; // % of viewport height where the reveal completes
const DIM_OPACITY = 0.2; // resting opacity of not-yet-revealed characters

function SplitChars({ text, dim }: { text: string; dim: boolean }) {
  return (
    <>
      {[...text].map((ch, i) =>
        /\s/.test(ch) ? (
          ch
        ) : (
          <span className="reveal-char" style={{ opacity: dim ? DIM_OPACITY : 1 }} key={i}>
            {ch}
          </span>
        )
      )}
    </>
  );
}

/** Character-by-character scroll-scrub reveal, matching the original hand-rolled effect. */
export function TextRevealHeading({ lineOne, lineTwo }: { lineOne: string; lineTwo: string }) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const segments = Array.from(root.querySelectorAll<HTMLElement>(".reveal-char"));
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

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) scheduleReveal();
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    observer.observe(root);
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal, { passive: true });
    scheduleReveal();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  return (
    <h2 className="section-heading" ref={rootRef}>
      <SplitChars text={lineOne} dim={!reduceMotion} />
      <br />
      <SplitChars text={lineTwo} dim={!reduceMotion} />
    </h2>
  );
}
