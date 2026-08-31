import { useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Stat } from "./Stat";
import { aboutStats } from "../data/stats";

export function About() {
  const revealRef = useRef<HTMLDivElement>(null);
  useScrollReveal(revealRef, { y: 36, start: "top 85%" });

  return (
    <section id="about" className="section about">
      <div className="reveal" ref={revealRef}>
        <h2 className="section-heading">
          I MAKE CONTENT
          <br />
          PEOPLE REMEMBER
        </h2>
        <p className="about-copy">
          I create photography, video, and brand content that help businesses look sharper, feel trusted
          <br className="br-desktop" /> and grow with purpose.
        </p>
        <a href="#contact" className="btn-outline">
          Start a project
        </a>
      </div>

      <div className="stats">
        {aboutStats.map((stat, i) => (
          <Stat stat={stat} index={i} key={stat.id} />
        ))}
      </div>
    </section>
  );
}
