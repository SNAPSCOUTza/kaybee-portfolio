import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { dockIcons } from "../data/dockIcons";

const REST_SCALE = 1;
const PEAK_SCALE = 1.28;
const SIGMA = 46;
const LIFT = 16;

export function Dock() {
  const dockRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const dock = dockRef.current;
      if (!dock) return;
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!canHover || reduceMotion) return;

      const dockIconEls = gsap.utils.toArray<HTMLElement>(".dock-icon", dock);
      const setters = dockIconEls.map((icon) => ({
        icon,
        scaleXTo: gsap.quickTo(icon, "scaleX", { duration: 0.28, ease: "power3.out" }),
        scaleYTo: gsap.quickTo(icon, "scaleY", { duration: 0.28, ease: "power3.out" }),
        yTo: gsap.quickTo(icon, "y", { duration: 0.28, ease: "power3.out" })
      }));

      const onMouseMove = (e: MouseEvent) => {
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
      };

      const onMouseLeave = () => {
        setters.forEach(({ scaleXTo, scaleYTo, yTo }) => {
          scaleXTo(REST_SCALE);
          scaleYTo(REST_SCALE);
          yTo(0);
        });
      };

      dock.addEventListener("mousemove", onMouseMove);
      dock.addEventListener("mouseleave", onMouseLeave);
      return () => {
        dock.removeEventListener("mousemove", onMouseMove);
        dock.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: dockRef, dependencies: [reduceMotion] }
  );

  return (
    <nav className="dock" aria-label="Section navigation" ref={dockRef}>
      {dockIcons.map((item) => (
        <a href={item.href} className="dock-icon" aria-label={item.label} key={item.id}>
          <span className="dock-tooltip">{item.label}</span>
          <span className="dock-icon-frame">
            <img src={item.icon} alt="" />
          </span>
        </a>
      ))}
    </nav>
  );
}
