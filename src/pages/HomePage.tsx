import { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { Preloader } from "../components/Preloader";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Work } from "../components/Work";
import { Impact } from "../components/Impact";
import { Clients } from "../components/Clients";
import { Services } from "../components/Services";
import { Reviews } from "../components/Reviews";
import { Faqs } from "../components/Faqs";
import { Footer } from "../components/Footer";

export function HomePage() {
  const bottomBlurRef = useRef<HTMLDivElement>(null);
  const [showPreloader, setShowPreloader] = useState(true);

  useGSAP(() => {
    if (!bottomBlurRef.current) return;
    gsap.to(bottomBlurRef.current, {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
    });
  }, []);

  return (
    <>
      {showPreloader && <Preloader onDone={() => setShowPreloader(false)} />}
      <div className="grain" />
      <div className="bottom-blur" aria-hidden="true" ref={bottomBlurRef}>
        <i />
      </div>

      <Hero />
      <About />
      <Work />
      <Impact />
      <Clients />
      <Services />
      <Reviews />
      <Faqs />
      <Footer variant="home" />
    </>
  );
}
