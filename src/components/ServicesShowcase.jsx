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

const TRACK_VH = 200; // more scroll distance = more reading time per service
const ROW_H = "65vh"; // taller rows = more breathing room between the two visible titles

export default function ServicesShowcase() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const headerRefs = useRef([]);
  const imageRefs = useRef([]);
  const overlayRefs = useRef([]);

  useEffect(() => {
    const N = services.length;
    const wrapper = wrapperRef.current;
    const headers = headerRefs.current.filter(Boolean);
    const images = imageRefs.current.filter(Boolean);
    const overlays = overlayRefs.current.filter(Boolean);

    // ── Initial state: images stacked below viewport, text offset ──────────
    gsap.set(wrapper, { y: 0 });
    gsap.set(headers, { y: 0 });
    // Images start fully collapsed to a point so they are invisible until activated.
    // The clipPath expansion creates the "expanding from the title card" effect.
    gsap.set(images, { y: 0, clipPath: "inset(25% 50% 75% 50% round 0px)" });
    gsap.set(overlays, { y: 80 }); // text sits 80 px below its resting spot

    // ── Timeline — one unit per service ────────────────────────────────────
    const tl = gsap.timeline();

    services.forEach((_, i) => {
      const header = headers[i];
      const image = images[i];
      const overlay = overlays[i];

      /*
       * Timeline is divided into three clear zones per service (1 unit each):
       *   ENTER  i+0.00 → i+0.36   (~130 vh of scroll)
       *   HOLD   i+0.36 → i+0.65   (~105 vh — image fully open, nothing moving)
       *   EXIT   i+0.65 → i+1.00   (~125 vh of scroll)
       */

      // ── ENTER ─────────────────────────────────────────────────────────────
      tl.to(
        header,
        { y: -70, opacity: 0, ease: "power3.in", duration: 0.12 },
        i + 0.0,
      );
      tl.to(
        image,
        {
          clipPath: "inset(2% 2% 50% 2% round 18px)",
          ease: "power2.out",
          duration: 0.12,
        },
        i + 0.02,
      );
      tl.to(
        image,
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "power3.inOut",
          duration: 0.22,
        },
        i + 0.12,
      );
      tl.to(overlay, { y: 0, ease: "power2.out", duration: 0.12 }, i + 0.24);

      // ── EXIT (skip for last service) ──────────────────────────────────────
      if (i < N - 1) {
        tl.to(overlay, { y: -80, ease: "power2.in", duration: 0.1 }, i + 0.65);
        tl.to(
          image,
          {
            clipPath: "inset(2% 2% 50% 2% round 18px)",
            ease: "power3.inOut",
            duration: 0.14,
          },
          i + 0.68,
        );
        tl.to(
          image,
          {
            clipPath: "inset(25% 50% 75% 50% round 0px)",
            ease: "power2.in",
            duration: 0.12,
          },
          i + 0.8,
        );
        tl.to(
          header,
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.14 },
          i + 0.74,
        );
        tl.to(
          wrapper,
          { y: `${-(i + 1) * 65}vh`, ease: "power2.inOut", duration: 0.14 },
          i + 0.86,
        );
      }
    });

    // scrub: 2.5 — animation trails scroll by 2.5 s for a silky, unhurried feel
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 2.5,
      animation: tl,
      invalidateOnRefresh: true,
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${services.length * TRACK_VH}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/*
         * IMAGE LAYER — z-[20], slides up from below the viewport.
         * Because it's above the list layer in z-order, it physically covers
         * the title rows as it rises, creating a pure-slide transition.
         */}
        {services.map((service, i) => (
          <div
            key={`img-${service.number}`}
            ref={(el) => (imageRefs.current[i] = el)}
            className="absolute inset-0 z-[20]"
          >
            <img
              src={service.img}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            <div
              ref={(el) => (overlayRefs.current[i] = el)}
              className="absolute inset-0 flex flex-col justify-end pointer-events-none px-6 sm:px-12 md:px-20 pb-10 sm:pb-14 md:pb-20"
            >
              <span className="block text-primary/60 text-[11px] font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5">
                {service.number}
              </span>
              <h3
                className="font-bold text-white leading-[0.9] mb-3"
                style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)" }}
              >
                {service.title}
              </h3>
              <p className="text-white/65 italic text-base md:text-lg mb-5">
                {service.tagline}
              </p>
              <p
                className="text-white/80 text-sm md:text-base leading-relaxed mb-7"
                style={{ maxWidth: "42rem" }}
              >
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
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

        {/*
         * LIST LAYER — z-[10], sits behind the image layer.
         * Each row is 50 vh so exactly two titles fill the viewport at once.
         * The wrapper translates upward in 50 vh steps to advance the list.
         */}
        <div ref={wrapperRef} className="relative z-[10]">
          {services.map((service, i) => (
            <div
              key={service.number}
              ref={(el) => (headerRefs.current[i] = el)}
              className="flex flex-col justify-center border-b border-white/10 px-6 sm:px-12 md:px-20"
              style={{ height: ROW_H, background: "var(--background)" }}
            >
              <span className="text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-3 md:mb-5">
                {service.number}
              </span>
              <h2
                className="font-bold text-foreground uppercase tracking-tight leading-[0.88]"
                style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
              >
                {service.title}
              </h2>
              <p className="text-textColor italic mt-3 md:mt-4 text-sm md:text-base opacity-50">
                {service.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
