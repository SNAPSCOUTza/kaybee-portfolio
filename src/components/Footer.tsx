import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";

const BRANDS = [
  "PlayStation",
  "ABSA",
  "Les Créatifs",
  "Corporate",
  "Publications",
  "MINI South Africa",
  "Izimoto Auto Boutique",
  "Stella Artois",
  "Johnnie Walker",
  "Michelin",
  "BMW",
  "Pharoah Auto"
];
const MARQUEE_CHIPS = [...BRANDS, ...BRANDS];

interface FooterProps {
  variant: "home" | "contact";
}

export function Footer({ variant }: FooterProps) {
  const isHome = variant === "home";
  const topRef = useRef<HTMLDivElement>(null);
  const macRef = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();
  useScrollReveal(topRef, { y: 36, start: "top 85%" });

  useGSAP(
    () => {
      if (!macRef.current || reduceMotion) return;
      gsap.to(macRef.current, { y: "+=14", duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: topRef, dependencies: [reduceMotion] }
  );

  const homeAnchor = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <footer id={isHome ? "contact" : undefined} className="footer">
      <div className="footer-bg" aria-hidden="true" />
      <div className="footer-top reveal" ref={topRef}>
        <div className="footer-lead">
          <div className="footer-lead-text">
            <div className="footer-tags">
              <span>Photography</span>
              <span>Videography</span>
              <span>Storytelling</span>
              <span>Design</span>
            </div>
            <h2 className="footer-heading">
              LET'S BUILD
              <br />
              SOMETHING
              <br />
              <em>MEMORABLE</em>
            </h2>
          </div>
          <img
            className="footer-mac"
            src="/assets/img/ui/mac-classic.png"
            alt="Classic Macintosh illustration"
            width={538}
            height={542}
            ref={macRef}
          />
        </div>

        <div className="footer-cta">
          <div>
            <span className="footer-cta-label">Have an idea?</span>
            <p>Got a shoot in mind? Let's make it look unforgettable.</p>
          </div>
          <div className="footer-cta-buttons">
            <a className="btn-outline btn-instagram" href="https://www.instagram.com/k_illest.m/" target="_blank" rel="noopener">
              <span className="btn-text">View more projects</span>
              <span className="btn-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
                </svg>
              </span>
            </a>
            {isHome ? (
              <Link className="btn-solid" to="/contact">
                Let's chat
              </Link>
            ) : (
              <a className="btn-solid" href="mailto:Kabelo.Mofokeng2@gmail.com">
                Let's chat
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="wordmark">
          KAYBEE<sup>®</sup>
        </span>

        <nav className="footer-nav" aria-label="Footer navigation">
          {isHome ? (
            <>
              <a href="#about">ABOUT</a>
              <a href="#services">SERVICES</a>
              <a href="#work">PROJECTS</a>
              <a href="#reviews">REVIEWS</a>
              <a href="#faqs">FAQS</a>
              <a href="#contact">CONTACT</a>
            </>
          ) : (
            <>
              <Link to={homeAnchor("#about")}>ABOUT</Link>
              <Link to={homeAnchor("#services")}>SERVICES</Link>
              <Link to={homeAnchor("#work")}>PROJECTS</Link>
              <Link to={homeAnchor("#reviews")}>REVIEWS</Link>
              <Link to={homeAnchor("#faqs")}>FAQS</Link>
              <Link to="/contact">CONTACT</Link>
            </>
          )}
        </nav>

        <div className="footer-social">
          <a href="https://www.instagram.com/k_illest.m/" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="/assets/img/ui/instagram-footer-icon.png" alt="" width={20} height={20} />
          </a>
          <a href="https://linktr.ee/SnapScout_int" target="_blank" rel="noopener" aria-label="Linktree">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2 4 9h5v5H4l8 8 8-8h-5V9h5z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="logo-marquee" aria-label="Brands I've worked with">
        <div className="logo-track">
          {MARQUEE_CHIPS.map((brand, i) => (
            <span className="logo-chip" key={`${brand}-${i}`}>
              {brand}
            </span>
          ))}
        </div>
        <div className="logo-fade logo-fade-left" />
        <div className="logo-fade logo-fade-right" />
      </div>
    </footer>
  );
}
