"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────────────────────
   Cassiopeia — VERTICAL "W" constellation path

   The W shape descends vertically, zigzagging left ↔ right:
   Segin (left) → Ruchbah (right) → Gamma (left) → Schedar (right) → Caph (left)

   Each slide is a full-screen panel. The camera pans diagonally
   between them following the vertical W. At the end, the camera
   pulls back to reveal the complete constellation shape.
─────────────────────────────────────────────────────────── */

// Slide positions on the mega-canvas (multiplied by vw/vh)
// Slanted W: zigzags left↔right while drifting diagonally top-left → bottom-right
const SLIDE_POSITIONS = [
  { x: 0, y: 0 },   // Segin    — top-left
  { x: 2, y: 1 },   // Ruchbah  — far right, one screen down
  { x: 1, y: 2 },   // Gamma    — center-left, two screens down
  { x: 3, y: 3 },   // Schedar  — far right, three screens down
  { x: 2, y: 4 },   // Caph     — center, four screens down
];

// Star metadata
const STARS = [
  { name: "Segin",   sanskrit: "प्रारंभ",  meaning: "The Beginning" },
  { name: "Ruchbah", sanskrit: "आधार",     meaning: "The Foundation" },
  { name: "Gamma",   sanskrit: "शिखर",     meaning: "The Pinnacle" },
  { name: "Schedar", sanskrit: "परिष्कार", meaning: "The Refinement" },
  { name: "Caph",    sanskrit: "मुकुट",    meaning: "The Crown" },
];

// Content for each full-screen slide
const SLIDE_CONTENT = [
  {
    number: "01",
    subtitle: "Segin — The Beginning",
    title: "Every brand starts as a scattered idea.",
    body: "Lost signals in a noisy sky. We find the first authentic spark — the conviction that refuses to fade — and anchor it as the starting point of your constellation.",
  },
  {
    number: "02",
    subtitle: "Ruchbah — The Foundation",
    title: "We descend to build roots.",
    body: "Going deep into the soil of your identity. Unearthing the truth that your market already senses but hasn't heard articulated. This is where clarity is forged.",
  },
  {
    number: "03",
    subtitle: "Gamma — The Pinnacle",
    title: "Rising to the summit of meaning.",
    body: "The brightest point. Your brand's core message — distilled, elevated, unmistakable. This is the truth that everything else orbits around.",
  },
  {
    number: "04",
    subtitle: "Schedar — The Refinement",
    title: "Sharpening every edge.",
    body: "Descent into craft. Every visual, every word, every frame is honed until the work doesn't just communicate — it resonates in the bones.",
  },
  {
    number: "05",
    subtitle: "Caph — The Crown",
    title: "Taking your throne.",
    body: "The final ascent. Your brand rises into permanent position — commanding, distinctive, and quietly sovereign. Not just seen, but remembered forever.",
  },
];

// Enhanced deterministic starfield for deeper magical feel
const BG_STARS = Array.from({ length: 280 }, (_, i) => {
  // Multi-layer scatter using different prime patterns for organic distribution
  const hx = ((i * 7919 + 1301) % 10000) / 100;
  const hy = ((i * 6271 + 3457) % 10000) / 100;
  const layer = i % 3; // 3 depth layers for parallax

  return {
    x: hx * 4,
    y: hy * 5,
    r: 0.5 + ((i * 31) % 8) * 0.35,
    delay: parseFloat((((i * 43) % 60) / 10).toFixed(1)),
    dur: parseFloat((2.0 + ((i * 17) % 8) * 0.6).toFixed(1)),
    opacity: 0.15 + ((i * 13) % 7) * 0.11,
    layer,
    depth: 0.6 + layer * 0.2, // for parallax effect
  };
});

// Dense, scattered starfield for intro — creating a magical sky
const INTRO_STARS = Array.from({ length: 220 }, (_, i) => {
  const hx = ((i * 4973 + 811) % 10000) / 100;
  const hy = ((i * 3571 + 2143) % 10000) / 100;
  const sizeVariant = ((i * 157) % 5);

  // Size tiers for depth perception
  let sizeBase = 1.2;
  let opacity = 0.35;
  if (sizeVariant < 2) {
    sizeBase = 0.6;
    opacity = 0.15;
  } else if (sizeVariant < 3) {
    sizeBase = 2.0;
    opacity = 0.5;
  }

  return {
    top: hy,
    left: hx,
    s: sizeBase + ((i * 29) % 4) * 0.4,
    d: parseFloat((((i * 37) % 50) / 10).toFixed(1)),
    dur: parseFloat((1.8 + ((i * 19) % 7) * 0.7).toFixed(1)),
    o: opacity,
    glowSize: sizeBase * 3.5,
  };
});

export default function CassiopeiaConstellation() {
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const introStarRefs = useRef([]);
  const journeyStarRefs = useRef([]); // Stars that form the traveling point
  const slideRefs = useRef([]);
  const starDotRefs = useRef([]);
  const lineRefs = useRef([]);
  const finalRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(-1);

  useEffect(() => {
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!pin || !canvas) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1px)", () => {
      // ── Initial state ──
      // Intro stars start at their scattered positions
      introStarRefs.current.forEach((el, i) => {
        if (el) {
          const star = INTRO_STARS[i];
          gsap.set(el, {
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.o,
            scale: 1,
          });
        }
      });

      slideRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0.85, y: 40 });
      });
      starDotRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0 });
      });
      lineRefs.current.forEach((el) => {
        if (el) {
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        }
      });
      if (finalRef.current) gsap.set(finalRef.current, { opacity: 0, scale: 0.95 });
      if (introRef.current) gsap.set(introRef.current, { opacity: 1, y: 0 });

      // ── Master timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + window.innerHeight * 12, // Extended for star convergence
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.12) setActiveSlide(-1);
            else if (p < 0.26) setActiveSlide(0);
            else if (p < 0.41) setActiveSlide(1);
            else if (p < 0.56) setActiveSlide(2);
            else if (p < 0.71) setActiveSlide(3);
            else if (p < 0.85) setActiveSlide(4);
            else setActiveSlide(5);
          },
        },
      });

      const MOVE = 1.5;
      const HOLD = 0.8;
      const CONVERGE_DURATION = 2.2; // Stars converge to points
      let t = 0;

      // ── Phase 0: Journey stars converge and travel the constellation path ──
      t += 0.6; // initial gaze at scattered sky

      // Select first 50 stars to form the traveling journey point
      const journeyStarCount = 50;
      const journeyIndices = Array.from({ length: journeyStarCount }, (_, i) => i);

      // First convergence: stars gather at first constellation point (viewport center area)
      journeyIndices.forEach((i) => {
        const el = introStarRefs.current[i];
        if (el) {
          tl.to(el, {
            left: "50%",
            top: "50%",
            opacity: 0.9,
            scale: 0.5,
            duration: CONVERGE_DURATION * 0.8,
            ease: "power2.inOut",
          }, t);
        }
      });

      // Fade out intro title/text
      tl.to(introRef.current, {
        opacity: 0, y: -20, duration: CONVERGE_DURATION * 0.6, ease: "power2.inOut",
      }, t + 0.2);

      t += CONVERGE_DURATION;

      // ── Phase 1: First slide appears, journey point established ──
      // First slide enters
      tl.to(slideRefs.current[0], {
        opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out",
      }, t);

      // Journey point solidifies at first constellation point
      tl.to(starDotRefs.current[0], {
        opacity: 1, scale: 1.2, duration: 0.6, ease: "back.out(2)",
      }, t + 0.3);

      gsap.to(starDotRefs.current[0], {
        scale: 1, duration: 0.4, ease: "power2.inOut", delay: t + 0.8,
      });

      t += 1.6 + HOLD;

      // ── Slide transitions 0→1→2→3→4 with journey point following the path ──
      for (let i = 0; i < 4; i++) {
        const next = SLIDE_POSITIONS[i + 1];
        const currentSlide = slideRefs.current[i];
        const nextSlide = slideRefs.current[i + 1];

        // Journey stars remain at center as canvas pans to next constellation point
        // They glow brighter during transition to show the journey
        journeyIndices.forEach((starIdx) => {
          const el = introStarRefs.current[starIdx];
          if (el) {
            // Keep journey stars centered at viewport center during pan
            tl.to(el, {
              left: "50%",
              top: "50%",
              opacity: 0.95,
              scale: 0.6,
              duration: MOVE * 1.1,
              ease: "power2.inOut",
            }, t);
          }
        });

        // Current slide fades
        tl.to(currentSlide, {
          opacity: 0, scale: 0.8, y: -30, duration: MOVE * 0.32, ease: "power2.in",
        }, t);

        // Smooth pan across the starfield
        tl.to(canvas, {
          x: () => -next.x * window.innerWidth,
          y: () => -next.y * window.innerHeight,
          duration: MOVE * 1.15,
          ease: "power2.inOut",
        }, t);

        // Line animation with dramatic reveal
        if (lineRefs.current[i]) {
          tl.to(lineRefs.current[i], { opacity: 0.8, duration: 0.15 }, t + MOVE * 0.1);
          tl.to(lineRefs.current[i], {
            strokeDashoffset: 0, duration: MOVE * 0.9, ease: "power2.inOut",
          }, t + MOVE * 0.15);
          tl.to(lineRefs.current[i], { opacity: 0.4, duration: 0.3 }, t + MOVE * 1.0);
        }

        // Next slide enters
        tl.to(nextSlide, {
          opacity: 1, scale: 1, y: 0, duration: MOVE * 0.55, ease: "power3.out",
        }, t + MOVE * 0.5);

        // Next constellation point ignites
        tl.to(starDotRefs.current[i + 1], {
          opacity: 1, scale: 1.3, duration: 0.65, ease: "back.out(2.2)",
        }, t + MOVE * 0.75);

        gsap.to(starDotRefs.current[i + 1], {
          scale: 1, duration: 0.45, ease: "power2.inOut", delay: t + MOVE * 1.4,
        });

        t += MOVE * 1.3 + HOLD;
      }

      // ── Hide journey stars immediately after reaching 5th point ──
      journeyIndices.forEach((starIdx) => {
        const el = introStarRefs.current[starIdx];
        if (el) {
          tl.to(el, { opacity: 0, scale: 0, duration: 0.3, ease: "power2.in" }, t);
          gsap.set(el, { display: "none", delay: t + 0.4 });
        }
      });

      t += 0.5;

      // ── Final act — zoom out from center ──
      // Last slide dims and pulls back
      tl.to(slideRefs.current[4], {
        opacity: 0, scale: 0.7, y: 40, duration: 1.2, ease: "power2.in",
      }, t);

      // Hide ALL animated star dots completely to avoid duplication with final constellation
      starDotRefs.current.forEach((el) => {
        if (el) {
          tl.to(el, { opacity: 0, scale: 0, duration: 0.4, ease: "power2.in" }, t);
          gsap.set(el, { display: "none", delay: t + 0.5 });
        }
      });

      // Calculate proper zoom-out scaling to fit constellation in viewport
      const NAV_H = 90;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const availH = vh - NAV_H - 60;
      const availW = vw - 80;
      const canvasW = vw * 4;  // 400vw
      const canvasH = vh * 5;  // 500vh

      // Scale to fit constellation within available space
      const finalScale = Math.min(availH / canvasH, availW / canvasW);
      const scaledW = canvasW * finalScale;
      const scaledH = canvasH * finalScale;

      // Center the constellation in the viewport
      const finalX = (vw - scaledW) / 2;
      const finalY = NAV_H + (availH - scaledH) / 2;

      // Zoom out effect: scale from current position to fit-all view
      // Keep transform origin at center for proper zoom behavior
      tl.to(canvas, {
        scale: finalScale,
        x: finalX,
        y: finalY,
        transformOrigin: "center center",
        duration: 3.0,
        ease: "power3.inOut",
      }, t + 0.2);

      // Final constellation text emerges with elegance
      if (finalRef.current) {
        tl.to(finalRef.current, {
          opacity: 1, scale: 1, duration: 1.6, ease: "power2.out",
        }, t + 2.2);
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section style={{ background: "var(--background)", position: "relative", overflow: "hidden" }}>
      <style>{`
        .cas-pin {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        .cas-canvas {
          position: absolute;
          top: 0; left: 0;
          width: 400vw;   /* 4 screens wide (slanted W) */
          height: 500vh;  /* 5 screens tall */
          will-change: transform;
          transform-origin: center center;
        }
        .cas-slide {
          position: absolute;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform, opacity;
        }
        .cas-slide-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 2.5rem;
          max-width: 54rem;
          width: 100%;
          gap: 1.4rem;
        }
        .cas-bg-number {
          font-size: clamp(5rem, 15vw, 13rem);
          font-weight: 950;
          line-height: 1;
          background: linear-gradient(135deg, rgba(184,139,255,0.12) 0%, rgba(227,130,255,0.08) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.05em;
        }
        .cas-subtitle {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #E382FF;
          z-index: 1;
        }
        .cas-title {
          font-size: clamp(1.8rem, 4.8vw, 3.4rem);
          font-weight: 800;
          color: var(--foreground);
          line-height: 1.2;
          z-index: 1;
          max-width: 40rem;
          letter-spacing: -0.01em;
          font-family: "Geologica", sans-serif;
        }
        .cas-body {
          font-size: clamp(0.9rem, 1.5vw, 1.15rem);
          color: var(--textColor, rgba(255,255,255,0.6));
          line-height: 1.8;
          max-width: 36rem;
          z-index: 1;
          font-weight: 300;
        }
        .cas-pips {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          z-index: 1;
          margin-top: 2rem;
        }
        .cas-pip {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(184,139,255,0.2);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 8px rgba(184,139,255,0.1);
        }
        .cas-pip.is-active {
          width: 32px;
          border-radius: 2px;
          background: linear-gradient(90deg, #B88BFF, #E382FF);
          box-shadow: 0 0 16px rgba(184,139,255,0.5);
        }
        .cas-pip.is-done {
          background: rgba(184,139,255,0.5);
          box-shadow: 0 0 10px rgba(184,139,255,0.25);
        }

        /* Stars */
        .cas-star-dot {
          position: absolute;
          width: 14px; height: 14px;
          border-radius: 50%;
          z-index: 10;
          will-change: transform, opacity;
        }
        .cas-star-dot::before {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,139,255,0.35) 0%, transparent 70%);
          animation: cas-pulse 3.5s ease-in-out infinite;
        }
        .cas-star-dot::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: var(--foreground);
        }
        @keyframes cas-pulse {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2); opacity: 0.15; }
        }

        /* Background twinkle — enhanced with depth glow */
        .cas-bg-star {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.8) 40%, rgba(184,139,255,0.3) 100%);
          box-shadow:
            0 0 2px 0.5px rgba(255, 255, 255, 0.8),
            0 0 6px 1px rgba(184, 139, 255, 0.5),
            0 0 12px 2px rgba(184, 139, 255, 0.25),
            0 0 20px 3px rgba(227, 130, 255, 0.15);
          opacity: var(--so, 0.4);
          animation: cas-twinkle ease-in-out infinite;
          animation-duration: var(--dur);
          animation-delay: var(--delay);
          filter: brightness(1.2);
        }
        @keyframes cas-twinkle {
          0%,100% {
            opacity: var(--so, 0.4);
            transform: scale(1) translateY(0px);
            filter: brightness(1.2);
          }
          50% {
            opacity: calc(var(--so, 0.4) * 0.15);
            transform: scale(0.5) translateY(-1px);
            filter: brightness(0.8);
          }
        }
        [data-theme="light"] .cas-bg-star,
        .light .cas-bg-star {
          display: none;
        }

        /* SVG lines */
        .cas-lines-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        /* Nebula */
        .cas-nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          z-index: 0;
        }

        /* Final overlay */
        .cas-final {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          pointer-events: none;
        }
        .cas-final-svg {
          width: min(50vh, 320px);
          height: auto;
          filter: drop-shadow(0 0 24px rgba(184, 139, 255, 0.25));
        }
        .cas-final-title {
          font-size: clamp(1.8rem, 4.2vw, 3.2rem);
          font-weight: 800;
          color: var(--foreground);
          text-align: center;
          margin-top: 2.2rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          font-family: "Geologica", sans-serif;
        }
        .cas-final-sub {
          font-size: 0.75rem;
          color: #E382FF;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          margin-top: 0.8rem;
          font-weight: 600;
        }
        .cas-final-body {
          font-size: clamp(0.9rem, 1.3vw, 1.1rem);
          color: var(--textColor, rgba(255,255,255,0.65));
          text-align: center;
          max-width: 32rem;
          margin-top: 1.2rem;
          line-height: 1.8;
          padding: 0 1.2rem;
          font-weight: 300;
        }

        /* Intro star transformation — moves to constellation during scroll */
        .cas-intro-star-animated {
          position: fixed;
          border-radius: 50%;
          z-index: 8;
          will-change: transform, opacity;
        }

        /* Enhanced star glow effect on intro */
        .cas-intro-star-enhanced::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,139,255,0.4) 0%, rgba(227,130,255,0.1) 70%, transparent 100%);
          animation: cas-stellar-glow 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes cas-stellar-glow {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0.2; }
        }
      `}</style>

      {/* Spacer to clear the fixed navbar */}
      <div style={{ height: '80px' }} />

      {/* Pinned viewport — one screen */}
      <div ref={pinRef} className="cas-pin">

        {/* Intro: scattered starfield with title */}
        <div ref={introRef} style={{
          position: 'absolute', inset: 0, zIndex: 15,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '2rem',
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(81,60,213,0.02) 100%)',
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 800,
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
              fontFamily: '"Geologica", sans-serif',
            }}>The Cassiopeia Path</h2>
          </div>
          <p style={{
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: '#E382FF', marginBottom: '1.2rem',
          }}>कैसिओपिया — The Sovereign Shape</p>
          <p style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            color: 'var(--textColor, rgba(255,255,255,0.6))',
            maxWidth: '32rem', lineHeight: 1.8, fontWeight: 300,
          }}>Five points trace the queen&apos;s throne across the sky. Scroll to follow the path from scattered noise to sovereign constellation.</p>
        </div>

        {/* Intro scattered stars — animates to constellation points */}
        {INTRO_STARS.map((star, i) => (
          <span
            key={`intro-${i}`}
            ref={(el) => (introStarRefs.current[i] = el)}
            className="cas-bg-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              '--so': star.o,
              '--delay': `${star.d}s`,
              '--dur': `${star.dur}s`,
              zIndex: 1,
              position: 'absolute',
            }}
          />
        ))}

        {/* Mega-canvas that gets panned */}
        <div ref={canvasRef} className="cas-canvas">

          {/* Nebula ambience */}
          <div className="cas-nebula" style={{
            width: '45vw', height: '45vw',
            background: 'radial-gradient(circle, rgba(184,139,255,0.05) 0%, transparent 70%)',
            left: '15vw', top: '15vh',
          }} />
          <div className="cas-nebula" style={{
            width: '40vw', height: '40vw',
            background: 'radial-gradient(circle, rgba(227,130,255,0.04) 0%, transparent 70%)',
            left: '110vw', top: '160vh',
          }} />
          <div className="cas-nebula" style={{
            width: '55vw', height: '55vw',
            background: 'radial-gradient(circle, rgba(81,60,213,0.06) 0%, transparent 70%)',
            left: '20vw', top: '320vh',
          }} />

          {/* Background stars */}
          {BG_STARS.map((star, i) => (
            <span
              key={`bg-${i}`}
              className="cas-bg-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.r * 2}px`,
                height: `${star.r * 2}px`,
                '--so': star.opacity,
                '--delay': `${star.delay}s`,
                '--dur': `${star.dur}s`,
              }}
            />
          ))}

          {/* Constellation lines SVG (viewBox matches canvas proportion: 200 × 500) */}
          <svg
            className="cas-lines-svg"
            viewBox="0 0 400 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cas-lg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B88BFF" />
                <stop offset="100%" stopColor="#E382FF" />
              </linearGradient>
            </defs>
            {SLIDE_POSITIONS.slice(0, -1).map((pos, i) => {
              const next = SLIDE_POSITIONS[i + 1];
              return (
                <line
                  key={i}
                  ref={(el) => (lineRefs.current[i] = el)}
                  x1={pos.x * 100 + 50}
                  y1={pos.y * 100 + 50}
                  x2={next.x * 100 + 50}
                  y2={next.y * 100 + 50}
                  stroke="url(#cas-lg)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Star dots at the center of each slide position */}
          {SLIDE_POSITIONS.map((pos, i) => (
            <div
              key={`sd-${i}`}
              ref={(el) => (starDotRefs.current[i] = el)}
              className="cas-star-dot"
              style={{
                left:  `calc(${pos.x * 100}vw + 50vw - 7px)`,
                top:   `calc(${pos.y * 100}vh + 50vh - 7px)`,
              }}
            />
          ))}

          {/* Full-screen slides */}
          {SLIDE_CONTENT.map((slide, i) => {
            const pos = SLIDE_POSITIONS[i];
            return (
              <div
                key={`sl-${i}`}
                ref={(el) => (slideRefs.current[i] = el)}
                className="cas-slide"
                style={{
                  left: `${pos.x * 100}vw`,
                  top:  `${pos.y * 100}vh`,
                }}
              >
                <div className="cas-slide-inner">
                  <div className="cas-bg-number">{slide.number}</div>
                  <span className="cas-subtitle">{slide.subtitle}</span>
                  <h3 className="cas-title">{slide.title}</h3>
                  <p className="cas-body">{slide.body}</p>
                  <div className="cas-pips">
                    {STARS.map((_, j) => (
                      <div
                        key={j}
                        className={`cas-pip${j === i ? " is-active" : ""}${j < i ? " is-done" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Final constellation overlay ── */}
        <div ref={finalRef} className="cas-final">
          <svg className="cas-final-svg" viewBox="0 0 400 500" fill="none">
            <defs>
              <linearGradient id="cas-fg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B88BFF" />
                <stop offset="40%" stopColor="#E382FF" />
                <stop offset="100%" stopColor="#FF9F7F" />
              </linearGradient>
              <filter id="cas-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <filter id="cas-core-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <radialGradient id="cas-sg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cas-star-core" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#B88BFF" />
                <stop offset="100%" stopColor="#8855FF" />
              </radialGradient>
            </defs>

            {/* Constellation backdrop nebula glow */}
            <circle cx={200} cy={250} r={180} fill="url(#cas-fg)" opacity={0.04} />

            {/* Slanted W polyline with rich gradient */}
            <polyline
              points="50,50 250,150 150,250 350,350 250,450"
              stroke="url(#cas-fg)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.9}
              style={{ filter: 'drop-shadow(0 0 8px rgba(184, 139, 255, 0.4))' }}
            />

            {/* Star nodes with enhanced glow */}
            {[
              { cx: 50, cy: 50 },
              { cx: 250, cy: 150 },
              { cx: 150, cy: 250 },
              { cx: 350, cy: 350 },
              { cx: 250, cy: 450 },
            ].map((s, i) => (
              <g key={i}>
                {/* Outer nebula halo */}
                <circle cx={s.cx} cy={s.cy} r={20} fill="#B88BFF" opacity={0.08} filter="url(#cas-glow)" />
                {/* Mid glow */}
                <circle cx={s.cx} cy={s.cy} r={12} fill="#E382FF" opacity={0.15} filter="url(#cas-core-glow)" />
                {/* Star surface */}
                <circle cx={s.cx} cy={s.cy} r={7} fill="url(#cas-star-core)" opacity={0.95} />
                {/* Bright core */}
                <circle cx={s.cx} cy={s.cy} r={3.5} fill="#ffffff" opacity={0.8} />
                {/* Sparkle point */}
                <circle cx={s.cx} cy={s.cy} r={1.2} fill="#ffffff" opacity={1} />
                {/* Star name with Sanskrit */}
                <text
                  x={s.cx + (i % 2 === 0 ? -18 : 18)}
                  y={s.cy - 8}
                  textAnchor={i % 2 === 0 ? "end" : "start"}
                  fontSize="6.5"
                  fontFamily="Questrial, sans-serif"
                  letterSpacing="0.8"
                  fill="#B88BFF"
                  opacity="0.9"
                  fontWeight="600"
                >
                  {STARS[i].name}
                </text>
                {/* Sanskrit below */}
                <text
                  x={s.cx + (i % 2 === 0 ? -18 : 18)}
                  y={s.cy + 6}
                  textAnchor={i % 2 === 0 ? "end" : "start"}
                  fontSize="4.5"
                  fontFamily="Arial, sans-serif"
                  fill="#E382FF"
                  opacity="0.65"
                  fontStyle="italic"
                >
                  {STARS[i].sanskrit}
                </text>
              </g>
            ))}
          </svg>

          <h3 className="cas-final-title">The Queen&apos;s Throne</h3>
          <span className="cas-final-sub">कैसिओपिया — The Sovereign Shape</span>
          <p className="cas-final-body">
            What was once scattered is now sovereign. Five truths, one throne.
            Your brand&apos;s constellation — permanent, undeniable, and forever visible in the sky.
          </p>
        </div>

      </div>
    </section>
  );
}
