import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "@/styles/Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

const columns = [
  {
    label: "Capabilities",
    links: ["Brand Films", "Identity Design", "Marketing Strategy", "Content Creation"],
  },
  {
    label: "Studio",
    links: ["About Us", "Our Work", "Process", "Careers"],
  },
  {
    label: "Connect",
    links: ["Start a Project", "hello@kathart.studio", "Instagram", "LinkedIn"],
  },
];

function IconInsta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      // Stagger-reveal every .fr element
      const els = footerRef.current.querySelectorAll(".fr");
      gsap.fromTo(
        els,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          stagger: 0.06,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            pin: false,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>

      {/* ─── Aurora accent bar ─── */}
      <div className={styles.accentBar} aria-hidden="true" />

      {/* ─── Ghost "ELEVATED." watermark ─── */}
      <div className={styles.ghostWrap} aria-hidden="true">
        <span className={styles.ghostText}>ELEVATED.</span>
      </div>

      <div className={styles.footerInner}>

        {/* ── Brand column ── */}
        <div className={`${styles.brand} fr`}>
          <a href="/" className={styles.logoLink}>
            <img
              src="/images/Dark-Logo.svg"
              alt="Kathart Studios"
              className={styles.logoImg}
            />
          </a>

          <p className={styles.brandStatement}>
            We work with founders and<br />
            companies who know the<br />
            difference.
          </p>

          <div className={styles.socials}>
            <a href="#" className={styles.socialBtn} aria-label="Instagram">
              <IconInsta />
            </a>
            <span className={styles.socialSep} aria-hidden="true" />
            <a href="#" className={styles.socialBtn} aria-label="LinkedIn">
              <IconLinkedIn />
            </a>
            <span className={styles.socialSep} aria-hidden="true" />
            <a href="#" className={styles.socialBtn} aria-label="X / Twitter">
              <IconX />
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className={styles.cols}>
          {columns.map((col) => (
            <div key={col.label} className={`${styles.col} fr`}>
              <p className={styles.colLabel}>{col.label}</p>
              <nav className={styles.colLinks}>
                {col.links.map((link) => (
                  <a key={link} href="#" className={styles.colLink}>{link}</a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`${styles.bottomBar} fr`}>
        <span className={styles.copyright}>
          © 2026 Kathart Studios Pvt. Ltd.
        </span>
        <span className={styles.dividerDot} aria-hidden="true">·</span>
        <span className={styles.allRights}>All rights reserved.</span>
        <span className={styles.spacer} />
        <span className={styles.motto}>Your Brand. Elevated.</span>
      </div>

    </footer>
  );
}
