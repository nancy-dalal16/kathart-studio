"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="none">
      <path fill="white" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" fill="white" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
      <line x1="22" y1="12" x2="19" y2="12" />
      <line x1="19.78" y1="19.78" x2="17.66" y2="17.66" />
      <line x1="12" y1="22" x2="12" y2="19" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/work" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function RollingText({ text }) {
  const letters = text.split("");
  return (
    <span className="rolling-text">
      {letters.map((letter, i) => (
        <span key={i} className="rolling-letter">
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = navItems.findIndex((item) => item.href === pathname);
    if (index !== -1) setActiveIndex(index);
  }, [pathname]);

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const currentTheme =
      saved || document.documentElement.dataset.theme || "dark";
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mobileOverlayRef = useRef(null);
  const mobileSheetRef = useRef(null);
  const mobileTl = useRef(null);
  const transitionRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTheme = mounted ? theme : "dark";

  const toggleTheme = (e) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const next = theme === "dark" ? "light" : "dark";

    const overlay = transitionRef.current;
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + buttonRect.width / 2;
    const y = buttonRect.top + buttonRect.height / 2;
    const oldThemeColor = theme === "dark" ? "#0F0F1A" : "#F5F4FE";

    gsap.set(overlay, {
      display: "block",
      backgroundColor: oldThemeColor,
      clipPath: `circle(150% at ${x}px ${y}px)`,
    });

    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);

    gsap.to(overlay, {
      clipPath: `circle(0% at ${x}px ${y}px)`,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        setIsTransitioning(false);
        gsap.set(overlay, { display: "none" });
      },
    });
  };

  useEffect(() => {
    if (!mobileOverlayRef.current || !mobileSheetRef.current) return;

    gsap.set(mobileSheetRef.current, { yPercent: 100, opacity: 0 });

    mobileTl.current = gsap.timeline({ paused: true });
    mobileTl.current
      .to(mobileOverlayRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
        onStart: () => {
          mobileOverlayRef.current.style.pointerEvents = "auto";
        },
      })
      .fromTo(
        mobileSheetRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.48, ease: "expo.out" },
        "<0.05",
      );
  }, []);

  useEffect(() => {
    if (!mobileTl.current) return;
    if (isMobileOpen) mobileTl.current.play();
    else
      mobileTl.current.reverse().eventCallback("onReverseComplete", () => {
        mobileOverlayRef.current.style.pointerEvents = "none";
      });
  }, [isMobileOpen]);

  const handleNavClick = (index, href) => {
    setActiveIndex(index);
    router.push(href);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 w-full z-[1000]">
        <div className="flex items-center w-full px-4 md:px-10 lg:px-20 py-4 md:py-5">
          {/* LEFT — Logo */}
          <div className="flex-1 flex items-center">
            {mounted ? (
              <Image
                className="w-[60px] h-auto md:w-[75px] cursor-pointer"
                alt="Kathart logo"
                src={
                  currentTheme === "light"
                    ? "/images/Kathart-Logo-1.png"
                    : "/images/Kathart-Logo_2.png"
                }
                width={100}
                height={100}
                onClick={() => handleNavClick(0, "/")}
              />
            ) : (
              <Image
                className="w-[60px] h-auto md:w-[75px]"
                alt="Kathart logo"
                src="/images/Kathart-Logo_2.png"
                width={100}
                height={100}
              />
            )}
          </div>

          {/* CENTER — Nav with top + bottom border only */}
          <nav className="relative hidden md:flex items-center border-y border-[var(--border)] px-8 py-4">
            {navItems.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <button
                  onClick={() => handleNavClick(index, item.href)}
                  className={`nav-link px-4 py-1 text-sm lg:text-[15px] cursor-pointer${index === activeIndex ? " active" : ""}`}
                >
                  <RollingText text={item.label} />
                </button>
                {index < navItems.length - 1 && <span className="nav-dot" />}
              </div>
            ))}
          </nav>

          {/* RIGHT — Theme toggle + mobile hamburger */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button
              onClick={toggleTheme}
              className={`theme-toggle-pill${currentTheme === "light" ? " is-light" : ""}`}
              aria-label={
                currentTheme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <span className="toggle-bg-decoration" aria-hidden="true">
                <span className="toggle-star star-1" />
                <span className="toggle-star star-2" />
                <span className="toggle-star star-3" />
              </span>
              <span className="toggle-knob">
                {mounted ? (
                  currentTheme === "dark" ? (
                    <MoonIcon />
                  ) : (
                    <SunIcon />
                  )
                ) : (
                  <MoonIcon />
                )}
              </span>
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-[var(--foreground)]"
              aria-label="Open navigation"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      <div
        ref={mobileOverlayRef}
        className="fixed inset-0 z-[1001] md:hidden opacity-0 pointer-events-none"
      >
        <div
          ref={mobileSheetRef}
          className="mobile-sheet absolute inset-0 flex flex-col px-8 pb-14 overflow-y-auto"
        >
          {/* Close button row */}
          <div className="flex items-center justify-end h-20 flex-shrink-0">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="mobile-sheet-close"
              aria-label="Close navigation"
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* Logo */}
          <div className="mb-10 flex-shrink-0">
            {mounted ? (
              <Image
                className="w-[55px] h-auto"
                alt="Kathart logo"
                src={
                  currentTheme === "light"
                    ? "/images/Kathart-Logo-1.png"
                    : "/images/Kathart-Logo_2.png"
                }
                width={60}
                height={60}
              />
            ) : (
              <Image
                className="w-[55px] h-auto"
                alt="Kathart logo"
                src="/images/Kathart-Logo_2.png"
                width={60}
                height={60}
              />
            )}
          </div>

          {/* Nav items */}
          <nav className="flex flex-col flex-1 justify-center mb-10">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(index, item.href)}
                className={`mobile-sheet-item${index === activeIndex ? " mobile-sheet-active" : ""}`}
              >
                <span className="mobile-sheet-num">0{index + 1}</span>
                <span className="mobile-sheet-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
            <button
              onClick={() => handleNavClick(navItems.length - 1, "/contact")}
              className="mobile-sheet-cta"
            >
              Start a Project
              <span className="btn-icon">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </button>
            <p className="mobile-sheet-tagline">Your Brand. Elevated.</p>
          </div>
        </div>
      </div>

      {/* Transition overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 z-[999] pointer-events-none hidden"
      />
    </>
  );
}
