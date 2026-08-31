import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, STANDARD } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { clientLogos } from "../data/clientLogos";

export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useScrollReveal(headRef, { y: 36, start: "top 85%" });

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const duration = reduceMotion ? 0.01 : STANDARD;
      const batch = ScrollTrigger.batch(".logo-card", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.from(els, { autoAlpha: 0, y: 40, duration, stagger: 0.1, clearProps: "all", overwrite: true })
      });
      return () => batch.forEach((st) => st.kill());
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  return (
    <section id="clients" className="section clients" ref={sectionRef}>
      <div className="clients-head reveal" ref={headRef}>
        <h2 className="section-heading">
          BRANDS I'VE
          <br />
          WORKED WITH
        </h2>
        <span className="section-kicker">Clients</span>
      </div>

      <div className="clients-grid">
        {clientLogos.map((logo) => (
          <div className="logo-card" key={logo.id}>
            <img className={logo.large ? "logo-img--lg" : undefined} src={logo.image} alt={logo.name} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
