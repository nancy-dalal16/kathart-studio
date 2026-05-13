"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "./ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const slides = [
  {
    title: "FinEase – UPI Payment App",
    badge: "Mobile App",
    image: "/images/fin-ease.png",
    description:
      "Designed an intuitive banking app for seamless UPI and fund transfers, improving transaction completion by 40%.",
    highlights: "Modern UI | Dark Mode | User-Centered Flows",
    impact: [
      "85% faster payments",
      "0 data errors",
      "2.5X customer satisfaction score",
    ],
  },
  {
    title: "NeoBank – Finance Dashboard",
    badge: "FinTech SaaS",
    image: "/images/fin-ease.png",
    description:
      "Built a modern dashboard for fintech startups to manage money flow, transactions, and analytics.",
    highlights: "Analytics | Reports | Secure Architecture",
    impact: ["60% workflow improvement", "100% uptime", "3X engagement"],
  },
  {
    title: "FoodKart – Delivery App",
    badge: "Mobile App",
    image: "/images/fin-ease.png",
    description:
      "A visually rich food delivery experience with smoother cart & checkout interaction.",
    highlights: "Dark Mode | UI Revamp | Faster Checkout",
    impact: ["50% faster ordering", "Zero cart drop-offs", "2X retention"],
  },
];

const N = slides.length;

export default function OurWork() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const dotRefs = useRef([]);
  const imageRefs = useRef([]);

  const handleMouseMove = (e, idx) => {
    const el = imageRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      rotateY: x / 25,
      rotateX: -y / 25,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const resetTilt = (idx) => {
    const el = imageRefs.current[idx];
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalScroll = window.innerHeight * 1.2 * (N - 1);
    const xDist = -((N - 1) * window.innerWidth);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Slide track moves right → left
      tl.to(track, { x: xDist, ease: "none", duration: 1 });

      // Dots: deactivate previous, activate current at each slide boundary
      for (let i = 1; i < N; i++) {
        const t = i / (N - 1);
        const d = 0.08;

        tl.to(
          dotRefs.current[i - 1],
          {
            width: 16,
            backgroundColor: "rgba(255,255,255,0.35)",
            duration: d,
            ease: "power2.inOut",
          },
          t - d,
        );
        tl.to(
          dotRefs.current[i],
          {
            width: 48,
            backgroundColor: "#B88BFF",
            duration: d,
            ease: "power2.inOut",
          },
          t - d,
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full flex flex-col overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Header — natural flow, height determines slide start */}
        <div className="flex-shrink-0 z-20 px-6 sm:px-10 lg:px-20 pt-14 md:pt-20 pb-6 flex justify-between items-start flex-col lg:flex-row gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-tight">
              Our Work
            </h2>
            <p className="text-textColor text-base sm:text-lg mt-2 max-w-xl">
              Stories we&apos;ve shaped, identities we&apos;ve built, and brands
              we&apos;ve helped grow.
            </p>
          </div>

          {/* Progress dots — top right */}
          <div className="flex gap-3 items-center lg:pt-4">
            {slides.map((_, i) => (
              <div
                key={i}
                ref={(el) => (dotRefs.current[i] = el)}
                className="h-2 rounded-full"
                style={{
                  width: i === 0 ? 48 : 16,
                  backgroundColor:
                    i === 0 ? "#B88BFF" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Slide area — takes all remaining height, clips horizontal overflow */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full"
            style={{ width: `${N * 100}vw`, willChange: "transform" }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-full flex items-center px-6 sm:px-10 lg:px-20 pb-8"
                style={{ width: "100vw" }}
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center w-full h-full">
                  {/* Image */}
                  <div
                    ref={(el) => (imageRefs.current[i] = el)}
                    className="w-full lg:w-[48%] rounded-2xl lg:rounded-3xl overflow-hidden flex-shrink-0 h-52 sm:h-72 lg:h-full max-h-[420px]"
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={() => resetTilt(i)}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={700}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-[52%] flex flex-col gap-4 lg:gap-5">
                    <span className="text-xs font-semibold text-primary tracking-[0.18em] uppercase">
                      {slide.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-textColor text-base sm:text-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-textColor mb-1">
                        Highlights
                      </p>
                      <p className="text-foreground text-base">
                        {slide.highlights}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {slide.impact.map((metric, j) => (
                        <div key={j} className="flex gap-2 items-center">
                          <Image
                            src="/images/check-mark-green.svg"
                            width={18}
                            height={18}
                            alt="check"
                          />
                          <span className="text-textColor text-sm sm:text-base">
                            {metric}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/work"
                      className="btn-border-gradient self-start"
                    >
                      View Case Study
                      <span className="btn-icon">
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — sits below the pinned section, visible after all slides */}
      <div className="px-6 sm:px-10 lg:px-20 py-10">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-6 bg-secondary rounded-2xl px-6 py-5">
          <p className="text-xl sm:text-2xl">
            We&apos;ve got more cool stuff waiting for you — go explore!
          </p>
          <Button className="primary-btn">
            View All Projects
            <span className="btn-icon">
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
