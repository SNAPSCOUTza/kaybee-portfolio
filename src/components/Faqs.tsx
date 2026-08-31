import { useRef, useState, type SyntheticEvent } from "react";
import { gsap, useGSAP, ScrollTrigger, STANDARD, DRAMATIC, QUICK } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { faqItems } from "../data/faqItems";

export function Faqs() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(faqItems.find((f) => f.defaultOpen)?.id ?? null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const quick = reduceMotion ? 0.01 : QUICK;
      const standard = reduceMotion ? 0.01 : STANDARD;
      const dramatic = reduceMotion ? 0.01 : DRAMATIC;

      if (visualRef.current && imgRef.current && headingRef.current) {
        gsap
          .timeline({
            scrollTrigger: { trigger: visualRef.current, start: "top 82%", toggleActions: "play none none reverse" }
          })
          .from(imgRef.current, { autoAlpha: 0, scale: 1.12, duration: standard + 0.35, ease: "power3.out", clearProps: "all" })
          .from(headingRef.current, { autoAlpha: 0, y: 24, duration: dramatic + 0.4, ease: "power2.out", clearProps: "all" }, "-=0.15");
      }

      gsap.utils.toArray<HTMLElement>(".faq-item", sectionRef.current).forEach((item, i) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 18,
          duration: quick,
          delay: i * 0.03,
          clearProps: "all",
          scrollTrigger: { trigger: item, start: "top 92%", toggleActions: "play none none reverse" }
        });
      });
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  const handleToggle = (id: string, e: SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = e.currentTarget.open;
    setOpenId(isOpen ? id : (current) => (current === id ? null : current));
    ScrollTrigger.refresh();
  };

  return (
    <section id="faqs" className="section faqs" ref={sectionRef}>
      <div className="faqs-grid">
        <div className="faqs-visual" ref={visualRef}>
          <img className="faqs-visual-img" src="/assets/img/ui/faq-spiral.jpg" alt="" loading="lazy" ref={imgRef} />
          <h2 className="section-heading faqs-heading" ref={headingRef}>
            ANSWERS
            <br />
            BEFORE WE START
          </h2>
        </div>

        <div className="faq-list">
          {faqItems.map((item) => (
            <details
              className="faq-item"
              key={item.id}
              open={openId === item.id}
              onToggle={(e) => handleToggle(item.id, e)}
            >
              <summary>
                {item.question}
                <span className="faq-toggle">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
