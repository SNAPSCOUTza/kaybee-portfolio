import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, STANDARD } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { TextRevealHeading } from "./TextRevealHeading";

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const duration = reduceMotion ? 0.01 : STANDARD;
      const batch = ScrollTrigger.batch(".review-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, { autoAlpha: 0, y: 40, duration, stagger: 0.1, clearProps: "all", overwrite: true })
      });
      return () => batch.forEach((st) => st.kill());
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  return (
    <section id="reviews" className="section reviews" ref={sectionRef}>
      <TextRevealHeading lineOne="CLIENTS LIKED" lineTwo="THE SHOTS" />

      <div className="reviews-grid single">
        <div className="review-card consult-card">
          <span className="review-name">So they stayed</span>
          <p className="consult-text">
            I'm currently still consulting for all of these brands as a visual growth partner, working with each on
            a project-to-project basis — shaping their visual direction, shooting new campaigns, and helping their
            content stay sharp as their needs evolve. If you'd like to work together, we can set up a consultation.
            Feel free to get in touch.
          </p>
        </div>
      </div>
    </section>
  );
}
