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
// Traced from the reference illustration (star pixel coords, P1 as origin):
//   P1 (0,0)      — top-left, highest star
//   P2 (112,185)  — steep drop down-right (~59°)
//   P3 (270,176)  — nearly flat across to the right
//   P4 (355,367)  — steepest drop to the LOWEST, brightest star (~66°)
//   P5 (533,245)  — rises up-right (~34°)
// Canvas y units are vh and x units are vw, so x is divided by the ~16:9
// viewport ratio to keep the on-screen angles faithful to the image.
const SLIDE_POSITIONS = [
  { x: 0, y: 0 }, // P1 — top-left (highest), viewport centre at start
  { x: 0.27, y: 0.81 }, // P2 — steep drop
  { x: 0.66, y: 0.77 }, // P3 — flat across
  { x: 0.87, y: 1.6 }, // P4 — deepest point (brightest star)
  { x: 1.3, y: 1.07 }, // P5 — rising tail
];

// Star metadata
const STARS = [
  { name: "Segin", sanskrit: "शिकार", meaning: "The Hunt" },
  { name: "Ruchbah", sanskrit: "सार", meaning: "The Strip" },
  { name: "Gamma", sanskrit: "शिल्प", meaning: "The Craft" },
  { name: "Schedar", sanskrit: "मुक्ति", meaning: "The Release" },
  { name: "Caph", sanskrit: "विकास", meaning: "The Katharsis" },
];

// Content for each full-screen slide — mirrors the Our Approach steps
const SLIDE_CONTENT = [
  {
    number: "01",
    subtitle: "Segin — The Hunt",
    // title: "We find the story you can't ignore.",
    title: "Hunt",
    body: "We don't invent stories. We hunt the one already living inside your brand - the part you keep repeating to yourself at 3 a.m., the reason you started this in the first place. That's the story worth telling.",
  },
  {
    number: "02",
    subtitle: "Ruchbah — The Strip",
    // title: "We strip everything that isn't it.",
    title: "Strip",
    body: "We move aside the noise until only the one thing that truly matters is left standing. Nothing added. Nothing forced. Just the single, undeniable truth your brand owns.",
  },
  {
    number: "03",
    subtitle: "Gamma — The Craft",
    // title: "We craft like it's ours.",
    title: "Craft",
    body: " Strategy becomes form. Ideas become experiences. We bring a point of view to everything we make and push back when something isn't right. We don't stop until the work is strong enough to sell itself.",
  },
  {
    number: "04",
    subtitle: "Schedar — The Release",
    // title: "We release what lasts.",
    title: "Release",
    body: "The katha leaves our hands quietly. Just a story set free to find its people. Ten years from now it still feels true, still pulls the right founders in, still quietly prospers.",
  },
  {
    number: "05",
    subtitle: "Caph — The Katharsis",
    // title: "We stay as the story takes root.",
    title: "Katharsis",
    body: "Something lifts. The noise clears. What your brand was always meant to be is suddenly, undeniably visible - to you, to your market, to the people you've been trying to reach. That feeling is Katharsis.",
  },
];

// Enhanced deterministic starfield for deeper magical feel
const BG_STARS = Array.from({ length: 280 }, (_, i) => {
  // Multi-layer scatter using different prime patterns for organic distribution
  const hx = ((i * 7919 + 1301) % 10000) / 100;
  const hy = ((i * 6271 + 3457) % 10000) / 100;
  const layer = i % 3; // 3 depth layers for parallax

  return {
    x: hx * 2.3,
    y: hy * 2.6,
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
  const sizeVariant = (i * 157) % 5;

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

// Final constellation node positions (matches the reference illustration)
const REVEAL_NODES = [
  { cx: 30, cy: 30, r: 1 }, // P1 — top-left, highest
  { cx: 142, cy: 215, r: 0.9 }, // P2 — first dip
  { cx: 300, cy: 206, r: 1 }, // P3 — flat across
  { cx: 385, cy: 397, r: 1.45 }, // P4 — lowest, brightest star
  { cx: 563, cy: 275, r: 1.1 }, // P5 — rising tail
];

// The full constellation "screen" — rendered identically at the opening and
// the finale. `idp` namespaces the SVG def ids so two copies can coexist.
function ConstellationReveal({ idp }) {
  return (
    <>
      <svg className="cas-final-svg" viewBox="0 0 593 427" fill="none">
        <defs>
          <linearGradient id={`${idp}-fg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B88BFF" />
            <stop offset="40%" stopColor="#E382FF" />
            <stop offset="100%" stopColor="#FF9F7F" />
          </linearGradient>
          <filter
            id={`${idp}-glow`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter
            id={`${idp}-core-glow`}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <radialGradient id={`${idp}-star-core`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#B88BFF" />
            <stop offset="100%" stopColor="#8855FF" />
          </radialGradient>
          <radialGradient id={`${idp}-bg-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B88BFF" stopOpacity="0.09" />
            <stop offset="55%" stopColor="#E382FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B88BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Constellation backdrop nebula glow — radial fade, fits inside viewBox */}
        <ellipse
          cx={296}
          cy={213}
          rx={293}
          ry={210}
          fill={`url(#${idp}-bg-glow)`}
        />

        {/* Cassiopeia W traced from the reference illustration */}
        <polyline
          points="30,30 142,215 300,206 385,397 563,275"
          stroke={`url(#${idp}-fg)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.9}
          style={{ filter: "drop-shadow(0 0 8px rgba(184, 139, 255, 0.4))" }}
        />

        {/* Star nodes with enhanced glow — P4 is the brightest, as in the reference */}
        {REVEAL_NODES.map((s, i) => (
          <g key={i}>
            {/* Outer nebula halo */}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={24 * s.r}
              fill="#B88BFF"
              opacity={0.08}
              filter={`url(#${idp}-glow)`}
            />
            {/* Mid glow */}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={14 * s.r}
              fill="#E382FF"
              opacity={0.15}
              filter={`url(#${idp}-core-glow)`}
            />
            {/* Star surface */}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={8 * s.r}
              fill={`url(#${idp}-star-core)`}
              opacity={0.95}
            />
            {/* Bright core */}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={4 * s.r}
              fill="#ffffff"
              opacity={0.8}
            />
            {/* Sparkle point */}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={1.4 * s.r}
              fill="#ffffff"
              opacity={1}
            />
            {/* Star name */}
            <text
              x={s.cx + (i % 2 === 0 ? -22 : 22)}
              y={s.cy - 10}
              textAnchor={i % 2 === 0 ? "end" : "start"}
              fontSize="9.5"
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
              x={s.cx + (i % 2 === 0 ? -22 : 22)}
              y={s.cy + 8}
              textAnchor={i % 2 === 0 ? "end" : "start"}
              fontSize="7"
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

      <h3 className="cas-final-title">Our Approach</h3>
      <span className="cas-final-sub">The Kathart Path</span>
      <div
        className="cas-final-body"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          textAlign: "left",
          maxWidth: "28rem",
        }}
      >
        {SLIDE_CONTENT.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                color: "#E382FF",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                minWidth: "1.6rem",
                paddingTop: "0.18rem",
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                color: "var(--foreground)",
                fontWeight: 500,
                fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
              }}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

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
  const introConstRef = useRef(null); // Opening overlay — same screen as finale
  const [activeSlide, setActiveSlide] = useState(-1);

  useEffect(() => {
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!pin || !canvas) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1px)", () => {
      // ── Fit-all (zoomed-out) transform — shared by the opening overview
      //    and the closing constellation reveal so both bookend the journey ──
      const NAV_H = 90;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const availH = vh - NAV_H - 60;
      const availW = vw - 80;
      const canvasW = vw * 2.3; // 230vw
      const canvasH = vh * 2.6; // 260vh
      const finalScale = Math.min(availH / canvasH, availW / canvasW);
      const scaledW = canvasW * finalScale;
      const scaledH = canvasH * finalScale;
      const finalX = (vw - scaledW) / 2;
      const finalY = NAV_H + (availH - scaledH) / 2;

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

      // Canvas starts at the journey's first point; the opening overlay sits on
      // top of it and the scattered sky converges in front of it from the start.
      gsap.set(canvas, {
        scale: 1,
        x: 0,
        y: 0,
        transformOrigin: "center center",
      });

      slideRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0.85, y: 40 });
      });
      // Points and path stay hidden behind the opening overlay; the journey
      // reveals them one by one once we've zoomed in.
      starDotRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0 });
      });
      lineRefs.current.forEach((el) => {
        if (el) {
          const len = el.getTotalLength();
          gsap.set(el, {
            strokeDasharray: len,
            strokeDashoffset: len,
            opacity: 0,
          });
        }
      });
      if (finalRef.current)
        gsap.set(finalRef.current, { opacity: 0, scale: 0.95 });
      // Opening overlay = the exact same constellation screen as the finale
      if (introConstRef.current)
        gsap.set(introConstRef.current, { opacity: 1, scale: 1 });
      // Old scattered-star title is retired in favour of the overlay
      if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 0 });

      // ── Master timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + window.innerHeight * 10,
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

      // ── Phase 0: Straight from the first section, the scattered sky streams
      //    inward and gathers at the first constellation point while the opening
      //    overlay dissolves into the journey. No separate intro screen. ──
      const journeyStarCount = 50;
      const journeyIndices = Array.from(
        { length: journeyStarCount },
        (_, i) => i,
      );

      // Opening overlay dissolves as the convergence begins
      tl.to(
        introConstRef.current,
        {
          opacity: 0,
          scale: 1.08,
          duration: CONVERGE_DURATION * 0.7,
          ease: "power2.in",
        },
        t,
      );

      // Scattered stars gather at the first constellation point (viewport center)
      journeyIndices.forEach((i) => {
        const el = introStarRefs.current[i];
        if (el) {
          tl.to(
            el,
            {
              left: "50%",
              top: "50%",
              opacity: 0.9,
              scale: 0.5,
              duration: CONVERGE_DURATION * 0.8,
              ease: "power2.inOut",
            },
            t,
          );
        }
      });

      t += CONVERGE_DURATION;

      // ── Phase 1: First slide appears, journey point established ──
      // First slide enters
      tl.to(
        slideRefs.current[0],
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
        },
        t,
      );

      // Journey point solidifies at first constellation point
      tl.to(
        starDotRefs.current[0],
        {
          opacity: 1,
          scale: 1.2,
          duration: 0.6,
          ease: "back.out(2)",
        },
        t + 0.3,
      );

      tl.to(
        starDotRefs.current[0],
        {
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
        },
        t + 0.8,
      );

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
            tl.to(
              el,
              {
                left: "50%",
                top: "50%",
                opacity: 0.95,
                scale: 0.6,
                duration: MOVE * 1.1,
                ease: "power2.inOut",
              },
              t,
            );
          }
        });

        // Current slide fades
        tl.to(
          currentSlide,
          {
            opacity: 0,
            scale: 0.8,
            y: -30,
            duration: MOVE * 0.32,
            ease: "power2.in",
          },
          t,
        );

        // Smooth pan across the starfield
        tl.to(
          canvas,
          {
            x: () => -next.x * window.innerWidth,
            y: () => -next.y * window.innerHeight,
            duration: MOVE * 1.15,
            ease: "power2.inOut",
          },
          t,
        );

        // Line animation with dramatic reveal
        if (lineRefs.current[i]) {
          tl.to(
            lineRefs.current[i],
            { opacity: 0.8, duration: 0.15 },
            t + MOVE * 0.1,
          );
          tl.to(
            lineRefs.current[i],
            {
              strokeDashoffset: 0,
              duration: MOVE * 0.9,
              ease: "power2.inOut",
            },
            t + MOVE * 0.15,
          );
          tl.to(
            lineRefs.current[i],
            { opacity: 0.4, duration: 0.3 },
            t + MOVE * 1.0,
          );
        }

        // Next slide enters
        tl.to(
          nextSlide,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: MOVE * 0.55,
            ease: "power3.out",
          },
          t + MOVE * 0.5,
        );

        // Next constellation point ignites
        tl.to(
          starDotRefs.current[i + 1],
          {
            opacity: 1,
            scale: 1.3,
            duration: 0.65,
            ease: "back.out(2.2)",
          },
          t + MOVE * 0.75,
        );

        tl.to(
          starDotRefs.current[i + 1],
          {
            scale: 1,
            duration: 0.45,
            ease: "power2.inOut",
          },
          t + MOVE * 1.4,
        );

        t += MOVE * 1.3 + HOLD;
      }

      // ── Hide journey stars immediately after reaching 5th point ──
      // The cas-twinkle CSS animation perpetually drives opacity/transform,
      // overriding GSAP's inline values. visibility is NOT in the keyframes,
      // so an inline visibility:hidden cannot be overridden — guaranteed hide.
      journeyIndices.forEach((starIdx) => {
        const el = introStarRefs.current[starIdx];
        if (el) {
          tl.to(
            el,
            {
              opacity: 0,
              scale: 0,
              "--so": 0,
              duration: 0.3,
              ease: "power2.in",
            },
            t,
          );
          tl.set(el, { visibility: "hidden" }, t + 0.35);
        }
      });

      t += 0.5;

      // ── Final act — zoom out from center ──
      // Last slide dims and pulls back
      tl.to(
        slideRefs.current[4],
        {
          opacity: 0,
          scale: 0.7,
          y: 40,
          duration: 1.2,
          ease: "power2.in",
        },
        t,
      );

      // Hide ALL animated star dots completely to avoid duplication with final constellation
      starDotRefs.current.forEach((el) => {
        if (el) {
          tl.to(
            el,
            { opacity: 0, scale: 0, duration: 0.4, ease: "power2.in" },
            t,
          );
        }
      });

      // Zoom out effect: scale from current position back to the same
      // fit-all view used for the opening overview (finalScale/finalX/finalY
      // are computed once at the top of this callback)
      // Keep transform origin at center for proper zoom behavior
      tl.to(
        canvas,
        {
          scale: finalScale,
          x: finalX,
          y: finalY,
          transformOrigin: "center center",
          duration: 3.0,
          ease: "power3.inOut",
        },
        t + 0.2,
      );

      // Final constellation text emerges with elegance
      if (finalRef.current) {
        tl.to(
          finalRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          t + 2.2,
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      style={{
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          width: 230vw;   /* max slide x=1.3 + 1 slide width */
          height: 260vh;  /* max slide y=1.6 + 1 slide height */
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

        /* Final overlay — top padding clears the floating navbar */
        .cas-final {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          pointer-events: none;
          padding: 110px 1rem 1.5rem;
          box-sizing: border-box;
          overflow: hidden;
        }
        .cas-final-svg {
          width: min(56vw, 440px);
          max-height: 32vh;
          height: auto;
          flex-shrink: 1;
          min-height: 0;
          filter: drop-shadow(0 0 24px rgba(184, 139, 255, 0.25));
        }
        .cas-final-title {
          font-size: clamp(1.5rem, 3.2vw, 2.4rem);
          font-weight: 800;
          color: var(--foreground);
          text-align: center;
          margin-top: 1.2rem;
          letter-spacing: -0.02em;
          line-height: 1.1;
          font-family: "Geologica", sans-serif;
        }
        .cas-final-sub {
          font-size: 0.72rem;
          color: #E382FF;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          margin-top: 0.5rem;
          font-weight: 600;
          text-align: center;
        }
        .cas-final-body {
          font-size: clamp(0.9rem, 1.3vw, 1.1rem);
          color: var(--textColor, rgba(255,255,255,0.65));
          text-align: center;
          max-width: 32rem;
          margin-top: 0.9rem;
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
      <div style={{ height: "80px" }} />

      {/* Pinned viewport — one screen */}
      <div ref={pinRef} className="cas-pin">
        {/* Intro: scattered starfield with title */}
        <div
          ref={introRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(81,60,213,0.02) 100%)",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontWeight: 800,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
                fontFamily: '"Geologica", sans-serif',
              }}
            >
              Our Approach
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#E382FF",
              marginBottom: "1.2rem",
            }}
          >
            Cassiopeia — The Kathart Path
          </p>
          <p
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
              color: "var(--textColor, rgba(255,255,255,0.6))",
              maxWidth: "32rem",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Five steps trace how we work. Scroll to follow our path from hunting
            your story to watching it take root forever.
          </p>
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
              "--so": star.o,
              "--delay": `${star.d}s`,
              "--dur": `${star.dur}s`,
              zIndex: 1,
              position: "absolute",
            }}
          />
        ))}

        {/* Mega-canvas that gets panned */}
        <div ref={canvasRef} className="cas-canvas">
          {/* Nebula ambience — centred near each group of the W path */}
          <div
            className="cas-nebula"
            style={{
              width: "36vw",
              height: "36vw",
              background:
                "radial-gradient(circle, rgba(184,139,255,0.05) 0%, transparent 70%)",
              left: "30vw",
              top: "30vh" /* near P1 */,
            }}
          />
          <div
            className="cas-nebula"
            style={{
              width: "34vw",
              height: "34vw",
              background:
                "radial-gradient(circle, rgba(227,130,255,0.04) 0%, transparent 70%)",
              left: "80vw",
              top: "110vh" /* near P2–P3 */,
            }}
          />
          <div
            className="cas-nebula"
            style={{
              width: "44vw",
              height: "44vw",
              background:
                "radial-gradient(circle, rgba(81,60,213,0.06) 0%, transparent 70%)",
              left: "135vw",
              top: "165vh" /* near P4–P5 */,
            }}
          />

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
                "--so": star.opacity,
                "--delay": `${star.delay}s`,
                "--dur": `${star.dur}s`,
              }}
            />
          ))}

          {/* Constellation lines SVG — viewBox must match canvas: 230vw × 260vh */}
          <svg
            className="cas-lines-svg"
            viewBox="0 0 230 260"
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
                left: `calc(${pos.x * 100}vw + 50vw - 7px)`,
                top: `calc(${pos.y * 100}vh + 50vh - 7px)`,
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
                  top: `${pos.y * 100}vh`,
                }}
              >
                <div className="cas-slide-inner">
                  <div className="cas-bg-number">{slide.number}</div>
                  {/* <span className="cas-subtitle">{slide.subtitle}</span> */}
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

        {/* ── Opening constellation overlay — identical screen to the finale ── */}
        <div ref={introConstRef} className="cas-final">
          <ConstellationReveal idp="cas-intro" />
        </div>

        {/* ── Final constellation overlay ── */}
        <div ref={finalRef} className="cas-final">
          <ConstellationReveal idp="cas-final" />
        </div>
      </div>
    </section>
  );
}
