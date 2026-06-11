"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Strategy",
    tagline: "Where everything begins.",
    description:
      "Most brand problems are not creative problems. They are clarity problems. Before we design anything or shoot a single frame, we establish what your brand truly stands for, what it stands against, and what it delivers. This is the work that makes everything else cohesive.",
    tags: [
      "Brand Strategy",
      "Positioning",
      "Communications Planning",
      "Marketing Strategy",
    ],
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&q=80",
  },
  {
    number: "02",
    title: "Brand Identity",
    tagline: "The system that speaks before you do.",
    description:
      "A brand identity is not just a logo. It is a complete set of signals — visual, verbal, sensorial. They communicate who you are before you say a word. We build those systems to be distinct, consistent, and flexible enough to get stronger as your business grows.",
    tags: [
      "Naming",
      "Logo Design",
      "Visual Language & Brand Guidelines",
      "Brand Architecture",
    ],
    img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1800&q=80",
  },
  {
    number: "03",
    title: "Film & Content",
    tagline: "The work that gets you noticed.",
    description:
      "People don't remember what they read, what they saw, what they heard. They remember what they felt. Film is the most powerful brand tool available. Every film we make is a deliberate brand statement, built to move people and built to last.",
    tags: [
      "Ad Film & Brand Video",
      "Corporate & Institutional Video",
      "2D Animated Explainer Video",
      "Social Media Reels & Content",
      "Script & Direction",
    ],
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800&q=80",
  },
  {
    number: "04",
    title: "Digital Presence",
    tagline: "Where your brand lives 24 hours a day.",
    description:
      "For most prospects, your website is their first real encounter with your brand. It needs to do what a great salesperson does — build trust, communicate value, and make the next step obvious. We design and build digital experiences that are as considered as the brand behind them.",
    tags: ["Website Design & Development", "UI/UX Design", "Landing Pages"],
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1800&q=80",
  },
  {
    number: "05",
    title: "Brand Marketing",
    tagline: "The right message. The right people. The right time.",
    description:
      "Visibility means nothing if the wrong people are seeing the wrong message. We build and execute marketing strategies that give your brand's reach meaning — without compromising what makes it worth noticing in the first place.",
    tags: [
      "Social Media Strategy & Management",
      "Content Marketing",
      "Campaign Planning & Execution",
      "Performance Marketing",
      "Personal Branding",
    ],
    img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1800&q=80",
  },
];

// Each service gets TRACK_VH of scroll space.
// +100 ensures the sticky panel fully unsticks only after the last exit completes.
const TRACK_VH = 250;
const ROW_H = 50; // vh — two rows visible: one full + one peeking
const SCRUB = 1.5;

// Normalised positions within each service's 0→1 timeline progress
const T_ENTER_END = 0.36; // image fully in position
const T_HOLD_END = 0.65; // hold ends, exit begins

export default function ServicesShowcase() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const outerTrack = rootRef.current.querySelector(".svc-outer-track");
      const listInner = rootRef.current.querySelector(".svc-list-inner");
      const imgPanels = [...rootRef.current.querySelectorAll(".svc-img-panel")];
      const rows = [...rootRef.current.querySelectorAll(".svc-row")];

      // Anchor initial states so ctx.revert() restores them cleanly
      gsap.set(listInner, { y: 0 });
      imgPanels.forEach((panel) => {
        // Each image waits below the viewport until its service's scroll range begins
        gsap.set(panel, { yPercent: 100 });
        gsap.set(panel.querySelectorAll(".svc-ov-item"), { opacity: 0, y: 20 });
      });

      const svh = () => window.innerHeight / 100;
      const exitDur = 1.0 - T_HOLD_END; // 0.35

      // ── Single master timeline for list advances ──────────────────────
      // All advances target the same element (listInner). Putting them in
      // ONE timeline means GSAP sequences them in order — no creation-time
      // conflict, no element state being stamped by the "last tween wins" rule.
      // Each service owns 1 unit of timeline time; totalDuration = N.
      const listTl = gsap.timeline({
        scrollTrigger: {
          trigger: outerTrack,
          start: "top top",
          end: () => `top+=${services.length * TRACK_VH * svh()}px top`,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      services.forEach((_, i) => {
        if (i < services.length - 1) {
          // Absolute position in the master timeline: service i starts at time i
          listTl.to(
            listInner,
            {
              y: `-${(i + 1) * ROW_H}vh`,
              ease: "power2.inOut",
              duration: exitDur * 0.42,
            },
            i + T_HOLD_END + exitDur * 0.55,
          );
        }
      });

      // ── Per-service timelines for images and row headings ────────────
      // Each targets its own unique elements so separate timelines are safe.
      services.forEach((_, i) => {
        const panel = imgPanels[i];
        const ovItems = panel.querySelectorAll(".svc-ov-item");
        const rowHead = rows[i].querySelector(".svc-row-head");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: outerTrack,
            start: () => `top+=${i * TRACK_VH * svh()}px top`,
            end: () => `top+=${(i + 1) * TRACK_VH * svh()}px top`,
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        });

        // ENTER — heading out, image slides up, overlay in
        tl.to(
          rowHead,
          {
            opacity: 0,
            y: -12,
            duration: T_ENTER_END * 0.55,
            ease: "power2.in",
          },
          0,
        );
        tl.fromTo(
          panel,
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.inOut", duration: T_ENTER_END },
          0,
        );
        tl.to(
          ovItems,
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.1,
            ease: "power2.out",
          },
          T_ENTER_END - 0.04,
        );

        // HOLD — nothing animates

        // EXIT — last service stays full-screen, no exit tweens
        if (i < services.length - 1) {
          tl.to(
            ovItems,
            {
              opacity: 0,
              y: -12,
              stagger: 0.02,
              duration: exitDur * 0.28,
              ease: "power2.in",
            },
            T_HOLD_END,
          );
          tl.to(
            panel,
            { yPercent: -100, ease: "power2.inOut", duration: exitDur * 0.6 },
            T_HOLD_END + exitDur * 0.15,
          );
          tl.to(
            rowHead,
            { opacity: 1, y: 0, duration: exitDur * 0.2, ease: "power2.out" },
            T_HOLD_END + exitDur * 0.48,
          );
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative">
      {/*
       * Outer track: tall enough for all services + 100 vh so the sticky panel
       * fully unsticks only after the last service's exit animation completes.
       */}
      <div
        className="svc-outer-track relative"
        style={{ height: `${services.length * TRACK_VH + 100}vh` }}
      >
        <div
          className="svc-sticky sticky top-0 h-screen overflow-hidden"
          style={{ background: "var(--background)" }}
        >
          {/* ── Image panels — z:20, full-size, revealed via clip-path ── */}
          <div className="absolute inset-0" style={{ zIndex: 20 }}>
            {services.map((service) => (
              <div
                key={service.number}
                className="svc-img-panel absolute inset-0"
                style={{ willChange: "transform" }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                {/* Details overlay — bottom-aligned */}
                <div className="absolute inset-0 flex flex-col justify-end px-8 sm:px-12 md:px-20 pb-12 md:pb-20 pointer-events-none">
                  <span className="svc-ov-item block text-primary/60 text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">
                    {service.number}
                  </span>
                  <h3
                    className="svc-ov-item font-bold text-white leading-[0.9] mb-3"
                    style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="svc-ov-item text-white/65 italic text-base md:text-lg mb-5">
                    {service.tagline}
                  </p>
                  <p
                    className="svc-ov-item text-white/80 text-sm md:text-base leading-relaxed mb-7"
                    style={{ maxWidth: "42rem" }}
                  >
                    {service.description}
                  </p>
                  <div className="svc-ov-item flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-[11px] md:text-xs font-medium text-white/85 border border-white/20 rounded-full backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.07)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Title list — z:10, slides upward per service ── */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: 10 }}
          >
            <div className="svc-list-inner" style={{ willChange: "transform" }}>
              {services.map((service) => (
                <div
                  key={service.number}
                  className="svc-row flex flex-col justify-center px-8 sm:px-12 md:px-20 border-b border-border"
                  style={{ height: `${ROW_H}vh` }}
                >
                  <div className="svc-row-head">
                    <span className="block text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3 md:mb-4">
                      {service.number}
                    </span>
                    <h2
                      className="font-bold leading-[0.88] text-foreground"
                      style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
                    >
                      {service.title}
                    </h2>
                    <p className="mt-3 text-textColor italic text-base md:text-lg">
                      {service.tagline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
