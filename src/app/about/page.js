"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { CTA } from "@/components/CTA";

gsap.registerPlugin(ScrollTrigger);

const approachSteps = [
  {
    image: "/images/about/approach-1.jpg",
    oneliner: "We find the story you can't ignore.",
    description:
      "We don't invent stories. We hunt the one already living in your system… the part you keep repeating to yourself at 3 a.m., the reason you started this in the first place - the \"why\". That's the story worth telling.",
  },
  {
    image: "/images/about/approach-2.jpg",
    oneliner: "We strip everything that isn't it.",
    description:
      "We gently move aside the noise until only the one thing that truly matters is left standing. What's left is the single, undeniable truth your brand owns. Nothing added. Nothing forced. Just the essence.",
  },
  {
    image: "/images/about/approach-3.jpg",
    oneliner: "We craft like it's ours.",
    description:
      "Identity that feels like it's always belonged to you. Films that stop thumbs mid-scroll. Words that turn strangers into believers. We don't stop until the work sells itself.",
  },
  {
    image: "/images/about/approach-4.jpg",
    oneliner: "We release what lasts.",
    description:
      "The katha leaves our hands quietly. Just a story set free to find its people. Ten years from now it still feels true, still pulls the right founders in, still quietly prospers. That's the catharsis we chase.",
  },
];

const beliefCards = [
  {
    icon: "/images/about/story.svg",
    title: "Story over schedule",
    description: "We craft narratives that outlive trends",
  },
  {
    icon: "/images/about/strategy.svg",
    title: "Strategy over operations",
    description: "Depth drives every decision",
  },
  {
    icon: "/images/about/vision.svg",
    title: "Vision over volume",
    description: "Your brand grows from its core",
  },
  {
    icon: "/images/about/legacy.svg",
    title: "Legacy over flash",
    description: "We build what endures, quietly & permanently.",
  },
];

const saptarshiStars = [
  { cx: 360, cy: 210, name: "Kratu",     meaning: "The First Spark",       size: 6, handle: false },
  { cx: 660, cy: 150, name: "Pulaha",    meaning: "The Purifier",           size: 6, handle: false },
  { cx: 780, cy: 300, name: "Pulastya",  meaning: "The Transcendent",       size: 6, handle: false },
  { cx: 420, cy: 330, name: "Atri",      meaning: "The Devourer of Truth",  size: 6, handle: false },
  { cx: 600, cy: 360, name: "Angiras",   meaning: "The Radiant Fire",       size: 4, handle: true  },
  { cx: 780, cy: 420, name: "Vasishtha", meaning: "The Most Excellent",     size: 4, handle: true  },
  { cx: 960, cy: 390, name: "Marichi",   meaning: "Ray of Light",           size: 4, handle: true  },
];

const SAPTARSHI_MICRO_STARS = Array.from({ length: 60 }, (_, i) => {
  const phi = 0.618033988749895;
  return {
    cx:  Math.floor(((i * phi) % 1) * 1180) + 10,
    cy:  Math.floor(((i * phi * 2.3) % 1) * 580) + 10,
    r:   0.5 + (i % 3) * 0.4,
    d:   parseFloat(((i * 0.37) % 4).toFixed(1)),
    dur: parseFloat((2.5 + (i % 6) * 0.5).toFixed(1)),
  };
});

// ── "Find Your North" — Chaos → Order → Dhruva ──
// Deterministic scatter offset (dx,dy in SVG units) applied to each sage-star's start.
const DHRUVA_SCATTER = saptarshiStars.map((_, i) => {
  const phi = 0.618033988749895;
  const ax = (i * phi) % 1;
  const ay = (i * phi * 1.7) % 1;
  return { dx: (ax - 0.5) * 520, dy: (ay - 0.5) * 320 };
});

// Extra "noise" stars that dissolve as order forms (deterministic → no hydration drift).
const DHRUVA_NOISE = Array.from({ length: 22 }, (_, i) => {
  const phi = 0.618033988749895;
  return {
    cx: Math.floor(((i * phi) % 1) * 1100) + 50,
    cy: Math.floor(((i * phi * 2.7) % 1) * 500) + 50,
    r:  1 + (i % 3) * 0.6,
  };
});

// North-star pivot (Dhruva sits here; the constellation orbits this point).
const DHRUVA_NORTH = { x: 600, y: 90 };

// Three narrative beats driven by scroll progress.
const DHRUVA_BEATS = [
  {
    sa: "अराजकता — Chaos",
    title: "In every brand, there is noise.",
    body: "The clutter you carry at 3 a.m. — the ten things you think you should say, none of them the one that truly matters.",
  },
  {
    sa: "सप्तर्षि — The Pattern",
    title: "Beneath it, a pattern waits.",
    body: "Seven seers, one shape that was always there. We move the noise aside until only the truth you own is left standing.",
  },
  {
    sa: "ध्रुव — The Unwavering",
    title: "We find your North.",
    body: "Dhruva, the still point the heavens turn around. Your one fixed truth — and everything we build orbits it, quietly and permanently.",
  },
];

export default function AboutPage() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const essenceSectionRef = useRef(null);
  const approachSectionRef = useRef(null);
  const approachStepRefs = useRef([]);
  const approachHeadingRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Saptarshi constellation
  const saptarshiScrollRef     = useRef(null);  // outer tall wrapper (scroll distance)
  const saptarshiPinRef        = useRef(null);  // inner viewport to pin via GSAP
  const saptarshiStarRefs      = useRef([]);
  const saptarshiBowlPathRef   = useRef(null);
  const saptarshiHandlePathRef = useRef(null);
  const saptarshiContentRefs   = useRef([]);
  const [activeStep, setActiveStep] = useState(0);

  // "Find Your North" — Chaos → Order → Dhruva
  const dhruvaScrollRef        = useRef(null);  // outer tall wrapper (scroll distance)
  const dhruvaPinRef           = useRef(null);  // pinned viewport
  const dhruvaConstellationRef = useRef(null);  // <g> wrapping lines + sage-stars (orbits Dhruva)
  const dhruvaStarRefs         = useRef([]);    // 7 sage-star <g>
  const dhruvaNoiseRef         = useRef(null);  // <g> of noise stars (dissolves)
  const dhruvaBowlPathRef      = useRef(null);
  const dhruvaHandlePathRef    = useRef(null);
  const dhruvaNorthRef         = useRef(null);  // Dhruva north-star <g>
  const dhruvaContentRefs      = useRef([]);    // 3 beat panels
  const [activeBeat, setActiveBeat] = useState(0);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  // Entrance animations for existing sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (essenceSectionRef.current) {
        gsap.fromTo(
          essenceSectionRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2,
            scrollTrigger: {
              trigger: essenceSectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const items = [...cardRefs.current].filter(Boolean);
      if (items.length > 0) {
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (approachHeadingRef.current) {
        gsap.fromTo(
          approachHeadingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: {
              trigger: approachHeadingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      approachStepRefs.current.filter(Boolean).forEach((el) => {
        const image = el.querySelector(".approach-image");
        const text  = el.querySelector(".approach-text");
        gsap.fromTo(
          [image, text],
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.15,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Saptarshi: constellation scroll-driven timeline
  useEffect(() => {
    const outer      = saptarshiScrollRef.current;
    const bowlPath   = saptarshiBowlPathRef.current;
    const handlePath = saptarshiHandlePathRef.current;
    if (!outer || !bowlPath || !handlePath) return;

    const bowlLen   = bowlPath.getTotalLength();
    const handleLen = handlePath.getTotalLength();
    gsap.set(bowlPath,   { strokeDasharray: bowlLen,   strokeDashoffset: bowlLen });
    gsap.set(handlePath, { strokeDasharray: handleLen, strokeDashoffset: handleLen });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end:   "bottom bottom",
        pin:   saptarshiPinRef.current,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => setActiveStep(Math.min(3, Math.floor(self.progress * 4))),
      },
    });

    tl.to(bowlPath,   { strokeDashoffset: 0, duration: 3,   ease: "none" }, 0);
    tl.to(handlePath, { strokeDashoffset: 0, duration: 1.5, ease: "none" }, 2.5);

    [0, 0.75, 1.5, 2.25].forEach((pos, i) => {
      const star = saptarshiStarRefs.current[i];
      if (!star) return;
      const glow = star.querySelector(".star-glow");
      const ring = star.querySelector(".star-ring");
      if (glow) tl.fromTo(glow, { opacity: 0, r: 8  }, { opacity: 0.6, r: 18, duration: 0.5, ease: "power2.out"  }, pos);
      if (ring) tl.fromTo(ring, { opacity: 0, scale: 0.5, transformOrigin: "center" },
                                 { opacity: 1, scale: 1,   duration: 0.4, ease: "power3.out" }, pos + 0.1);
    });

    [4, 5, 6].forEach((starIdx, j) => {
      const glow = saptarshiStarRefs.current[starIdx]?.querySelector(".star-glow");
      if (glow) tl.fromTo(glow, { opacity: 0 }, { opacity: 0.3, duration: 0.3, ease: "power2.out" }, 2.5 + j * 0.5);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Saptarshi: initial content panel visibility
  useEffect(() => {
    saptarshiContentRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
    });
  }, []);

  // Saptarshi: switch content panel on step change
  useEffect(() => {
    saptarshiContentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeStep) {
        gsap.to(el, { opacity: 1, y: 0,                   duration: 0.5, ease: "power3.out" });
      } else {
        gsap.to(el, { opacity: 0, y: i < activeStep ? -20 : 20, duration: 0.3, ease: "power2.out" });
      }
    });
  }, [activeStep]);

  // Dhruva: chaos → order → north-star scroll timeline
  useEffect(() => {
    const outer  = dhruvaScrollRef.current;
    const bowl   = dhruvaBowlPathRef.current;
    const handle = dhruvaHandlePathRef.current;
    if (!outer || !bowl || !handle) return;

    // Scatter the sage-stars to their chaotic start
    dhruvaStarRefs.current.forEach((g, i) => {
      if (g) gsap.set(g, { x: DHRUVA_SCATTER[i].dx, y: DHRUVA_SCATTER[i].dy, opacity: 0.5 });
    });
    const bL = bowl.getTotalLength();
    const hL = handle.getTotalLength();
    gsap.set(bowl,   { strokeDasharray: bL, strokeDashoffset: bL });
    gsap.set(handle, { strokeDasharray: hL, strokeDashoffset: hL });
    gsap.set(dhruvaNorthRef.current, { opacity: 0, scale: 0.4, transformOrigin: "center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: dhruvaPinRef.current,
        start: "top top",
        end:   () => "+=" + window.innerHeight * 3.5,
        pin:   dhruvaPinRef.current,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActiveBeat(Math.min(2, Math.floor(self.progress * 3))),
      },
    });

    // Phase 1 — stars converge into formation (staggered)
    tl.to(dhruvaStarRefs.current, {
      x: 0, y: 0, opacity: 1, duration: 2, ease: "power2.inOut", stagger: 0.12,
    }, 0);
    // noise stars dissolve as order emerges
    tl.to(dhruvaNoiseRef.current, { opacity: 0, duration: 1.4, ease: "power1.in" }, 0.6);

    // Phase 2 — lines draw once stars have mostly landed
    tl.to(bowl,   { strokeDashoffset: 0, duration: 1.4, ease: "none" }, 1.7);
    tl.to(handle, { strokeDashoffset: 0, duration: 1.0, ease: "none" }, 2.5);
    // sage-star glows fade in with the lines
    dhruvaStarRefs.current.forEach((g, i) => {
      const glow = g?.querySelector(".dh-star-glow");
      if (glow) tl.fromTo(glow, { opacity: 0 }, { opacity: 0.55, duration: 0.5 }, 1.7 + i * 0.12);
    });

    // Phase 3 — Dhruva ignites
    tl.to(dhruvaNorthRef.current, {
      opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)",
    }, 3.0);

    // Perpetual gentle orbit around Dhruva (subtle sway; pivot at the north star)
    const orbit = gsap.to(dhruvaConstellationRef.current, {
      rotation: 2.5,
      svgOrigin: `${DHRUVA_NORTH.x} ${DHRUVA_NORTH.y}`,
      duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      orbit.kill();
    };
  }, []);

  // Dhruva: initial beat-panel visibility
  useEffect(() => {
    dhruvaContentRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
    });
  }, []);

  // Dhruva: switch beat panel on scroll
  useEffect(() => {
    dhruvaContentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeBeat) {
        gsap.to(el, { opacity: 1, y: 0,                   duration: 0.5, ease: "power3.out" });
      } else {
        gsap.to(el, { opacity: 0, y: i < activeBeat ? -24 : 24, duration: 0.3, ease: "power2.out" });
      }
    });
  }, [activeBeat]);

  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        {/* Hero Video */}
        <section className="relative w-full overflow-hidden h-auto md:h-[85vh] lg:h-[90vh] mt-[70px] md:mt-[80px]">
          <video
            ref={videoRef}
            src="/images/about/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto md:absolute md:inset-0 md:w-full md:h-full md:object-cover"
          />
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13 3.586L7.414 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3.414L13 20.414V3.586zM16.293 9.293a1 1 0 011.414 1.414L16.414 12l1.293 1.293a1 1 0 01-1.414 1.414L15 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 12l-1.293-1.293a1 1 0 011.414-1.414L15 10.586l1.293-1.293z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path
                  d="M13 3.586L7.414 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3.414L13 20.414V3.586zM16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </section>

        {/* The Essence of Kathart */}
        <section className="py-20 px-4 sm:px-8 text-center">
          <div ref={essenceSectionRef} className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
              The Essence of Kathart
            </h1>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              We are not here just to make things look good. We are here to make
              your brand mean something.
              <br /> We are a creative marketing agency working at the
              intersection of strategy, design, and film. We find the one true
              thing about your brand, and build everything around it. Every
              identity we craft, every film we make, every campaign we run is a
              &lsquo;Katharsis&rsquo; - a quiet but permanent shift in how your brand is
              seen, felt, and remembered. We are not here just to make things
              look good. We are here to make your brand mean something. We are a
              creative marketing agency working at the intersection of strategy,
              design, and film. We find the one true thing about your brand, and
              build everything around it. Every identity we craft, every film we
              make, every campaign we run is a &lsquo;Katharsis&rsquo; - a quiet but
              permanent shift in how your brand is seen, felt, and remembered.
            </p>
          </div>
        </section>

        {/* Our Belief */}
        <section className="py-20 px-4 sm:px-8" ref={sectionRef}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
              Our Belief
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {beliefCards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="bg-seccolor-cta-cards-bg gradient-border rounded-3xl p-8 sm:p-10"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={48}
                        height={48}
                        className="object-contain belief-card-icon"
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-base sm:text-lg text-textColor">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section ref={approachSectionRef} className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2
              ref={approachHeadingRef}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-20 text-center"
            >
              Our Approach
            </h2>
            <div className="flex flex-col gap-24">
              {approachSteps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    ref={(el) => (approachStepRefs.current[index] = el)}
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                      !isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="approach-image w-full lg:w-1/2 relative h-72 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={step.image}
                        alt={step.oneliner}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="approach-text w-full lg:w-1/2 space-y-5">
                      <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                        0{index + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
                        {step.oneliner}
                      </h3>
                      <p className="text-base sm:text-lg text-textColor leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ The Saptarshi Way — Constellation Section ══ */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--background)" }}
        >
          {/* Top edge fade */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-24 z-10"
            style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
          />

          {/* Heading — scrolls away normally above the sticky zone */}
          <div className="text-center pt-24 pb-10 px-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              The Saptarshi Way
            </h2>
            <p
              className="text-sm sm:text-base font-medium tracking-widest mb-5"
              style={{ color: "#B88BFF" }}
            >
              सप्तर्षि — Seven Seers of Creation
            </p>
            <p className="text-textColor text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Seven ancient sages who hold the cosmos in their gaze. Four of
              them carry the story of every brand that finds itself through us.
            </p>
          </div>

          {/* Outer tall wrapper — drives scroll distance */}
          <div
            ref={saptarshiScrollRef}
            className="relative min-h-[400vh] sm:min-h-[500vh]"
          >
            {/* Pinned inner — GSAP pins this via position:fixed (CSS sticky broken by overflow-hidden ancestors) */}
            <div ref={saptarshiPinRef} className="h-screen flex flex-col items-center justify-center overflow-hidden gap-4 sm:gap-6">

              <style>{`
                @keyframes saptarshi-twinkle {
                  0%, 100% { opacity: var(--st-op, 0.3); transform: scale(1); }
                  50%       { opacity: 1; transform: scale(1.6); }
                }
              `}</style>

              {/* Constellation SVG */}
              <svg
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMidYMid meet"
                className="w-full max-w-5xl px-4"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="saptar-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#B88BFF" />
                    <stop offset="100%" stopColor="#E382FF" />
                  </linearGradient>

                  <filter id="saptar-star-glow" x="-150%" y="-150%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                  </filter>

                  <filter id="saptar-nebula-blur" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="45" />
                  </filter>

                  <radialGradient id="saptar-core-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   style={{ stopColor: "var(--foreground)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "var(--foreground)", stopOpacity: 0 }} />
                  </radialGradient>
                </defs>

                {/* Nebula blobs */}
                <circle cx="500" cy="250" r="220" fill="#B88BFF" opacity="0.045" filter="url(#saptar-nebula-blur)" />
                <circle cx="760" cy="340" r="190" fill="#E382FF" opacity="0.04"  filter="url(#saptar-nebula-blur)" />
                <circle cx="290" cy="390" r="170" fill="#513CD5" opacity="0.055" filter="url(#saptar-nebula-blur)" />

                {/* Background micro-stars */}
                {SAPTARSHI_MICRO_STARS.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    style={{
                      fill: "var(--foreground)",
                      "--st-op": 0.25 + (i % 4) * 0.08,
                      animation: `saptarshi-twinkle ${s.dur}s ${s.d}s ease-in-out infinite`,
                    }}
                  />
                ))}

                {/* Bowl path: Kratu → Pulaha → Pulastya → Atri, closed */}
                <path
                  ref={saptarshiBowlPathRef}
                  d="M 360,210 L 660,150 L 780,300 L 420,330 Z"
                  stroke="url(#saptar-line-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Handle path: Atri → Angiras → Vasishtha → Marichi */}
                <path
                  ref={saptarshiHandlePathRef}
                  d="M 420,330 L 600,360 L 780,420 L 960,390"
                  stroke="url(#saptar-line-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Star nodes */}
                {saptarshiStars.map((star, i) => (
                  <g key={star.name} ref={(el) => (saptarshiStarRefs.current[i] = el)}>
                    {/* Glow halo — GSAP animates opacity and r */}
                    <circle
                      className="star-glow"
                      cx={star.cx}
                      cy={star.cy}
                      r={8}
                      fill={star.handle ? "#B88BFF" : "#E382FF"}
                      opacity={0}
                      filter="url(#saptar-star-glow)"
                    />
                    {/* Activation ring — bowl stars only */}
                    {!star.handle && (
                      <circle
                        className="star-ring"
                        cx={star.cx}
                        cy={star.cy}
                        r={14}
                        stroke="#B88BFF"
                        strokeWidth="1"
                        fill="none"
                        opacity={0}
                      />
                    )}
                    {/* Core gradient disk */}
                    <circle
                      cx={star.cx}
                      cy={star.cy}
                      r={star.size}
                      fill="url(#saptar-core-grad)"
                    />
                    {/* Bright inner dot */}
                    <circle
                      cx={star.cx}
                      cy={star.cy}
                      r={star.size * 0.45}
                      style={{ fill: "var(--foreground)" }}
                    />
                    {/* Vedic name label — bowl stars only */}
                    {!star.handle && (
                      <text
                        x={star.cx}
                        y={star.cy - 20}
                        textAnchor="middle"
                        fontSize="12"
                        fontFamily="Questrial, sans-serif"
                        letterSpacing="1"
                        fill="#B88BFF"
                        opacity="0.8"
                      >
                        {star.name}
                      </text>
                    )}
                  </g>
                ))}
              </svg>

              {/* Step indicator pills */}
              <div className="flex gap-2" aria-hidden="true">
                {approachSteps.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      i === activeStep ? "24px" : "6px",
                      height:     "6px",
                      background: i === activeStep
                        ? "#B88BFF"
                        : "rgba(184,139,255,0.3)",
                    }}
                  />
                ))}
              </div>

              {/* Content panels — GSAP-switched */}
              <div
                className="relative w-full max-w-2xl px-6 text-center"
                style={{ minHeight: "170px" }}
              >
                {approachSteps.map((step, i) => {
                  const star = saptarshiStars[i];
                  return (
                    <div
                      key={i}
                      ref={(el) => (saptarshiContentRefs.current[i] = el)}
                      className="absolute inset-0 flex flex-col items-center gap-3"
                      style={{ opacity: 0 }}
                    >
                      <span
                        className="text-xs font-semibold tracking-[0.3em] uppercase"
                        style={{ color: "#B88BFF" }}
                      >
                        {star.name} — {star.meaning}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug">
                        {step.oneliner}
                      </h3>
                      <p className="text-sm sm:text-base text-textColor leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>{/* /sticky */}
          </div>{/* /scroll wrapper */}

          {/* Bottom edge fade */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-10"
            style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
          />
        </section>

        {/* ══ Find Your North — Chaos → Order → Dhruva ══ */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--background)" }}
        >
          {/* Top edge fade */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-24 z-10"
            style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
          />

          {/* Heading — scrolls away above the pin */}
          <div className="text-center pt-24 pb-10 px-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              Find Your North
            </h2>
            <p
              className="text-sm sm:text-base font-medium tracking-widest mb-5"
              style={{ color: "#B88BFF" }}
            >
              ध्रुव — The Still Point of Every Story
            </p>
            <p className="text-textColor text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              From the noise, a constellation. From the constellation, a North —
              the one fixed truth your brand turns around.
            </p>
          </div>

          {/* Wrapper — GSAP adds the scroll spacer via pinSpacing */}
          <div ref={dhruvaScrollRef} className="relative">
            {/* Pinned inner — GSAP pins via position:fixed, scroll distance set by `end` */}
            <div
              ref={dhruvaPinRef}
              className="h-screen flex flex-col items-center justify-center overflow-hidden gap-4 sm:gap-6"
            >
              <style>{`
                @keyframes dhruva-twinkle {
                  0%, 100% { opacity: var(--dh-op, 0.3); transform: scale(1); }
                  50%       { opacity: 1; transform: scale(1.6); }
                }
              `}</style>

              {/* Constellation SVG */}
              <svg
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMidYMid meet"
                className="w-full max-w-5xl px-4"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="dhruva-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#B88BFF" />
                    <stop offset="100%" stopColor="#E382FF" />
                  </linearGradient>

                  <radialGradient id="dhruva-core-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   style={{ stopColor: "var(--foreground)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "var(--foreground)", stopOpacity: 0 }} />
                  </radialGradient>

                  <radialGradient id="dhruva-north-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#FFD27A" stopOpacity="0.9" />
                    <stop offset="60%"  stopColor="#FFD27A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FFD27A" stopOpacity="0" />
                  </radialGradient>

                  <filter id="dhruva-star-glow" x="-150%" y="-150%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>

                {/* Ambient background micro-stars */}
                {SAPTARSHI_MICRO_STARS.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    style={{
                      fill: "var(--foreground)",
                      "--dh-op": 0.2 + (i % 4) * 0.07,
                      animation: `dhruva-twinkle ${s.dur}s ${s.d}s ease-in-out infinite`,
                    }}
                  />
                ))}

                {/* Noise stars — dissolve as order forms */}
                <g ref={dhruvaNoiseRef}>
                  {DHRUVA_NOISE.map((s, i) => (
                    <circle
                      key={i}
                      cx={s.cx}
                      cy={s.cy}
                      r={s.r}
                      style={{ fill: "var(--foreground)" }}
                      opacity="0.5"
                    />
                  ))}
                </g>

                {/* Constellation group — orbits Dhruva */}
                <g ref={dhruvaConstellationRef}>
                  {/* Bowl: Kratu → Pulaha → Pulastya → Atri, closed */}
                  <path
                    ref={dhruvaBowlPathRef}
                    d="M 360,210 L 660,150 L 780,300 L 420,330 Z"
                    stroke="url(#dhruva-line-grad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Handle: Atri → Angiras → Vasishtha → Marichi */}
                  <path
                    ref={dhruvaHandlePathRef}
                    d="M 420,330 L 600,360 L 780,420 L 960,390"
                    stroke="url(#dhruva-line-grad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Sage-stars */}
                  {saptarshiStars.map((star, i) => (
                    <g key={star.name} ref={(el) => (dhruvaStarRefs.current[i] = el)}>
                      <circle
                        className="dh-star-glow"
                        cx={star.cx}
                        cy={star.cy}
                        r={14}
                        fill={star.handle ? "#B88BFF" : "#E382FF"}
                        opacity={0}
                        filter="url(#dhruva-star-glow)"
                      />
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={star.size}
                        fill="url(#dhruva-core-grad)"
                      />
                      <circle
                        cx={star.cx}
                        cy={star.cy}
                        r={star.size * 0.45}
                        style={{ fill: "var(--foreground)" }}
                      />
                      {!star.handle && (
                        <text
                          x={star.cx}
                          y={star.cy - 20}
                          textAnchor="middle"
                          fontSize="12"
                          fontFamily="Questrial, sans-serif"
                          letterSpacing="1"
                          fill="#B88BFF"
                          opacity="0.8"
                        >
                          {star.name}
                        </text>
                      )}
                    </g>
                  ))}
                </g>

                {/* Dhruva — the north star (drawn last, on top) */}
                <g ref={dhruvaNorthRef}>
                  <circle cx={DHRUVA_NORTH.x} cy={DHRUVA_NORTH.y} r={42} fill="url(#dhruva-north-glow)" />
                  {/* 4-point sparkle rays */}
                  <line
                    x1={DHRUVA_NORTH.x} y1={DHRUVA_NORTH.y - 26}
                    x2={DHRUVA_NORTH.x} y2={DHRUVA_NORTH.y + 26}
                    stroke="#FFD27A" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"
                  />
                  <line
                    x1={DHRUVA_NORTH.x - 26} y1={DHRUVA_NORTH.y}
                    x2={DHRUVA_NORTH.x + 26} y2={DHRUVA_NORTH.y}
                    stroke="#FFD27A" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"
                  />
                  <circle cx={DHRUVA_NORTH.x} cy={DHRUVA_NORTH.y} r={7} fill="url(#dhruva-core-grad)" />
                  <circle cx={DHRUVA_NORTH.x} cy={DHRUVA_NORTH.y} r={3.5} fill="#FFE6B0" />
                  <text
                    x={DHRUVA_NORTH.x}
                    y={DHRUVA_NORTH.y - 32}
                    textAnchor="middle"
                    fontSize="13"
                    fontFamily="Questrial, sans-serif"
                    fill="#FFD27A"
                  >
                    ध्रुव
                  </text>
                </g>
              </svg>

              {/* Beat indicator pills */}
              <div className="flex gap-2" aria-hidden="true">
                {DHRUVA_BEATS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      i === activeBeat ? "24px" : "6px",
                      height:     "6px",
                      background: i === activeBeat
                        ? "#B88BFF"
                        : "rgba(184,139,255,0.3)",
                    }}
                  />
                ))}
              </div>

              {/* Beat panels — GSAP-switched */}
              <div
                className="relative w-full max-w-2xl px-6 text-center"
                style={{ minHeight: "190px" }}
              >
                {DHRUVA_BEATS.map((beat, i) => (
                  <div
                    key={i}
                    ref={(el) => (dhruvaContentRefs.current[i] = el)}
                    className="absolute inset-0 flex flex-col items-center gap-3"
                    style={{ opacity: 0 }}
                  >
                    <span
                      className="text-xs font-semibold tracking-[0.3em] uppercase"
                      style={{ color: "#B88BFF" }}
                    >
                      {beat.sa}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug">
                      {beat.title}
                    </h3>
                    <p className="text-sm sm:text-base text-textColor leading-relaxed">
                      {beat.body}
                    </p>
                  </div>
                ))}
              </div>

            </div>{/* /pin */}
          </div>{/* /scroll wrapper */}

          {/* Bottom edge fade */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-10"
            style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
          />
        </section>

        <CTA />
      </main>
    </>
  );
}
