import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
}

/** Fade + rise on scroll-into-view, matching the original `.reveal`/`.stat` triggers. */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  { y = 36, duration = 0.65, delay = 0, start = "top 85%" }: ScrollRevealOptions = {}
) {
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        autoAlpha: 0,
        y,
        duration: reduceMotion ? 0.01 : duration,
        delay,
        clearProps: "all",
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none reverse"
        }
      });
    },
    { scope: ref, dependencies: [reduceMotion] }
  );
}
