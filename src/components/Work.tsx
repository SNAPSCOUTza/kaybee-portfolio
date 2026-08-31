import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, STANDARD } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { WorkCardFrame } from "./WorkCardFrame";
import { workCards } from "../data/workCards";

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useScrollReveal(headRef, { y: 36, start: "top 85%" });

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const duration = reduceMotion ? 0.01 : STANDARD;
      const batch = ScrollTrigger.batch(".work-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 70,
            scale: 0.88,
            duration,
            stagger: 0.12,
            ease: "back.out(1.3)",
            clearProps: "all",
            overwrite: true
          }),
        onLeaveBack: (els) => gsap.set(els, { autoAlpha: 0, y: 70 })
      });
      return () => batch.forEach((st) => st.kill());
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  return (
    <section id="work" className="section work" ref={sectionRef}>
      <div className="work-head reveal" ref={headRef}>
        <h2 className="section-heading">
          PROJECTS THAT
          <br />
          TELL STORIES
        </h2>
        <span className="section-kicker">Recent Work</span>
      </div>

      <div className="work-grid">
        {workCards.map((card) => (
          <WorkCardFrame card={card} key={card.id} />
        ))}
      </div>
    </section>
  );
}
