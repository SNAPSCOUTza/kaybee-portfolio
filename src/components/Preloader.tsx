import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function signalPreloaderDone() {
  window.dispatchEvent(new CustomEvent("preloader:done"));
}

interface PreloaderProps {
  onDone: () => void;
}

export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const preloader = rootRef.current;
      const wordEl = wordRef.current;
      const countEl = countRef.current;
      if (!preloader || !wordEl || !countEl) return;

      // Let React own removing this node from the tree - never call
      // preloader.remove() directly, that fights React's reconciler if this
      // component unmounts (e.g. client-side navigation) around the same time.
      const finish = () => {
        preloader.style.animation = "none";
        signalPreloaderDone();
        gsap.to(preloader, { autoAlpha: 0, duration: 0.6, onComplete: onDone });
      };

      if (reduceMotion) {
        wordEl.style.display = "none";
        countEl.style.opacity = "1";
        countEl.textContent = "100%";
        signalPreloaderDone();
        gsap.to(preloader, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: onDone });
        return;
      }

      const wordSpans = wordEl.querySelectorAll("span");
      const counter = { val: 0 };
      gsap
        .timeline({ onComplete: () => gsap.delayedCall(0.2, finish) })
        .from(wordSpans, {
          autoAlpha: 0,
          y: 14,
          filter: "blur(10px)",
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(wordEl, { autoAlpha: 0, y: -10, duration: 0.35, ease: "power2.in" }, "+=0.5")
        .to(countEl, { autoAlpha: 1, duration: 0.3 }, "<")
        .to(
          counter,
          {
            val: 100,
            duration: 1.8,
            ease: "power1.inOut",
            onUpdate: () => {
              countEl.textContent = Math.round(counter.val) + "%";
            }
          },
          "<"
        );
    },
    { scope: rootRef, dependencies: [reduceMotion] }
  );

  return (
    <div id="preloader" className="preloader" aria-hidden="true" ref={rootRef}>
      <div className="preloader-bg" />
      <div className="preloader-stage">
        <div className="preloader-word" ref={wordRef}>
          {["K", "A", "Y", "B", "E", "E"].map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </div>
        <div className="preloader-count" ref={countRef}>
          0%
        </div>
      </div>
    </div>
  );
}
