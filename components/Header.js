import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import gsap from "gsap";
import styles from "@/styles/Header.module.css";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Work",    href: "/#work" },
  { label: "About",   href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

// Hero section is dark until ~scrollY 1500 where the white flash begins
// and the About scene (parchment bg) materialises.
// At this point we apply `.dark` class = frosted glass + dark text.
const DARK_THRESHOLD = 1500;

export default function Header() {
  const router = useRouter();
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [isDark,       setIsDark]       = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { theme } = useTheme();

  const navRef       = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs     = useRef([]);
  const overlayRef   = useRef(null);
  const sheetRef     = useRef(null);
  const mobileTl     = useRef(null);

  // ── Text-colour switch: white on hero/dark-theme, dark on light sections ──
  useEffect(() => {
    const onScroll = () => {
      // In dark mode every section is dark — header stays white always
      if (theme === "dark") { setIsDark(false); return; }
      setIsDark(window.scrollY > DARK_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [theme]);

  // ── Sliding underline indicator (GSAP) ──
  useEffect(() => {
    const move = () => {
      const el  = itemRefs.current[activeIndex];
      const nav = navRef.current;
      const ind = indicatorRef.current;
      if (!el || !nav || !ind) return;
      const navRect = nav.getBoundingClientRect();
      const rect    = el.getBoundingClientRect();
      gsap.to(ind, {
        x: rect.left - navRect.left,
        width: rect.width,
        duration: 0.45,
        ease: "power3.out",
      });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [activeIndex]);

  // ── Mobile sheet animation ──
  useEffect(() => {
    if (!overlayRef.current || !sheetRef.current) return;
    mobileTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, {
        opacity: 1, duration: 0.3, ease: "power2.out",
        onStart: () => { overlayRef.current.style.pointerEvents = "auto"; },
      })
      .fromTo(
        sheetRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0,   opacity: 1, duration: 0.48, ease: "expo.out" },
        "<0.05"
      );
  }, []);

  useEffect(() => {
    if (!mobileTl.current) return;
    if (isMobileOpen) {
      mobileTl.current.play();
    } else {
      mobileTl.current.reverse().eventCallback("onReverseComplete", () => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
      });
    }
  }, [isMobileOpen]);

  const handleNav = (i, href) => {
    setActiveIndex(i);
    router.push(href);
    setIsMobileOpen(false);
  };

  return (
    <>
      <header className={`${styles.header} ${isDark ? styles.dark : ""}`}>
        <div className={styles.inner}>

          {/* Logo — mark keeps original colours always */}
          <a href="/" className={styles.logo}>
            <img
              src="/images/Kathart_logo-light.svg"
              alt=""
              className={styles.logoMark}
              aria-hidden="true"
            />
            <span className={styles.logoWord}>KATHART</span>
          </a>

          {/* Desktop nav */}
          <nav ref={navRef} className={styles.nav}>
            {navItems.map((item, i) => (
              <button
                key={item.label}
                ref={el => (itemRefs.current[i] = el)}
                onClick={() => handleNav(i, item.href)}
                className={styles.navBtn}
              >
                {item.label}
              </button>
            ))}
            <span ref={indicatorRef} className={styles.indicator} style={{ width: 0 }} />
          </nav>

          {/* CTA + Theme toggle — grouped side by side */}
          <div className={styles.headerActions}>
            <a
              href="/#contact"
              className={styles.cta}
              onClick={() => setActiveIndex(2)}
            >
              <span>Start a Project</span>
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>
            <span className={styles.ctaSep} aria-hidden="true" />
            <ThemeToggle />
          </div>

          {/* Mobile burger */}
          <button
            className={styles.burger}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation"
          >
            <span className={styles.bLine} />
            <span className={styles.bLine} style={{ width: "60%" }} />
          </button>

        </div>
      </header>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <div className={styles.overlayBg} onClick={() => setIsMobileOpen(false)} />

        <div ref={sheetRef} className={styles.sheet}>
          <div className={styles.sheetHead}>
            <div className={styles.handle} />
            <button
              className={styles.sheetClose}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
            >✕</button>
          </div>

          <a href="/" className={styles.sheetLogo} onClick={() => setIsMobileOpen(false)}>
            <img src="/images/Kathart_logo-light.svg" alt="" className={styles.sheetMark} />
            <span className={styles.sheetWord}>KATHART</span>
          </a>

          <nav className={styles.sheetNav}>
            {navItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => handleNav(i, item.href)}
                className={`${styles.sheetItem} ${i === activeIndex ? styles.sheetActive : ""}`}
              >
                <span className={styles.sheetNum}>0{i + 1}</span>
                <span className={styles.sheetLabel}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.sheetFoot}>
            <a
              href="/#contact"
              className={styles.sheetCta}
              onClick={() => { setActiveIndex(2); setIsMobileOpen(false); }}
            >
              Start a Project →
            </a>
            <p className={styles.sheetTagline}>Your Brand. Elevated.</p>
          </div>
        </div>
      </div>
    </>
  );
}
