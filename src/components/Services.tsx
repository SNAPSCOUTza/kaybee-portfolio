import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { serviceItems } from "../data/serviceItems";

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  useScrollReveal(headingRef, { y: 36, start: "top 85%" });

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const duration = reduceMotion ? 0.01 : 0.65;
      gsap.utils.toArray<HTMLElement>(".service-row", sectionRef.current).forEach((row) => {
        gsap.from(row, {
          autoAlpha: 0,
          x: -26,
          duration,
          clearProps: "all",
          scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none reverse" }
        });
      });
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
    // .service-detail's height animates via a 0.45s grid-template-rows CSS
    // transition; wait for it to settle so ScrollTrigger measures the final
    // height instead of a mid-transition one.
    setTimeout(() => ScrollTrigger.refresh(), 500);
  };

  return (
    <section id="services" className="section services" ref={sectionRef}>
      <h2 className="section-heading reveal" ref={headingRef}>
        WHERE I
        <br />
        CAN HELP YOU
      </h2>

      <div className="services-list">
        {serviceItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div className={`service-item${isOpen ? " is-open" : ""}`} key={item.id}>
              <button
                className="service-row"
                type="button"
                aria-expanded={isOpen}
                onClick={() => handleToggle(item.id)}
              >
                <span className="service-name">{item.name}</span>
                <span className="service-arrow">→</span>
              </button>
              <div className="service-detail">
                <div className="service-detail-inner">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
