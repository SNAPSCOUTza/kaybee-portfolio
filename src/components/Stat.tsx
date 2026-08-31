import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { Stat as StatData } from "../data/stats";

interface StatProps {
  stat: StatData;
  index: number;
}

export function Stat({ stat, index }: StatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const isCountUp = stat.countTo !== undefined;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      gsap.from(root, {
        autoAlpha: 0,
        y: 26,
        duration: reduceMotion ? 0.01 : 0.65,
        delay: (index % 2) * 0.08,
        clearProps: "all",
        scrollTrigger: { trigger: root, start: "top 90%", toggleActions: "play none none reverse" }
      });

      if (isCountUp && numRef.current) {
        const suffix = stat.suffix ?? "";
        const target = stat.countTo!;
        if (reduceMotion) {
          numRef.current.textContent = `${target}${suffix}`;
          return;
        }
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            if (numRef.current) numRef.current.textContent = `${Math.round(counter.val)}${suffix}`;
          },
          scrollTrigger: { trigger: numRef.current, start: "top 85%", once: true }
        });
      }
    },
    { scope: rootRef, dependencies: [reduceMotion, index, isCountUp] }
  );

  return (
    <div className="stat" ref={rootRef}>
      <span className="stat-num" ref={numRef}>
        {isCountUp ? `0${stat.suffix ?? ""}` : stat.value}
      </span>
      <span className="stat-title">{stat.label}</span>
      <p>{stat.description}</p>
    </div>
  );
}
