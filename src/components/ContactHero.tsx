import { useRef } from "react";
import { gsap, useGSAP, QUICK, STANDARD, DRAMATIC } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function ContactHero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const quick = reduceMotion ? 0.01 : QUICK;
      const standard = reduceMotion ? 0.01 : STANDARD;
      const dramatic = reduceMotion ? 0.01 : DRAMATIC;

      gsap
        .timeline({ delay: 0.1 })
        .from(".contact-hero-bg", { autoAlpha: 0, scale: 1.08, duration: dramatic + 0.4, ease: "power2.out", clearProps: "all" })
        .from(".contact-back", { autoAlpha: 0, y: -10, duration: quick, clearProps: "all" }, "-=0.7")
        .from(".contact-hero-inner .section-kicker", { autoAlpha: 0, y: 16, duration: quick, clearProps: "all" }, "-=0.5")
        .from(".contact-email", { autoAlpha: 0, y: 26, duration: dramatic, ease: "power3.out", clearProps: "all" }, "-=0.35")
        .from(".contact-instagram", { autoAlpha: 0, y: 16, duration: standard, clearProps: "all" }, "-=0.45");
    },
    { scope: rootRef, dependencies: [reduceMotion] }
  );

  return (
    <section className="contact-hero" ref={rootRef}>
      <div className="contact-hero-bg" aria-hidden="true" />
      <div className="contact-hero-scrim" aria-hidden="true" />
      <a className="contact-back" href="/">
        ← Kaybee
      </a>
      <div className="contact-hero-inner">
        <span className="section-kicker">Get in touch</span>
        <a className="contact-email" href="mailto:Kabelo.Mofokeng2@gmail.com">
          Kabelo.Mofokeng2@gmail.com
        </a>
        <a className="contact-instagram" href="https://www.instagram.com/k_illest.m/" target="_blank" rel="noopener">
          @k_illest.m
        </a>
      </div>
    </section>
  );
}
