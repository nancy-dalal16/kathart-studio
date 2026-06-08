"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
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
  const ctaRef = useRef(null);
  const headerRef = useRef(null);
  const slideRefs = useRef([]);
  const imageRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const pinRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const goToSlideRef = useRef(null);

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
    if (!section) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP (lg+): pinned, horizontal slideshow ──
    mm.add("(min-width: 1024px)", () => {
      // The track only needs its multi-viewport width on desktop.
      gsap.set(trackRef.current, { width: `${N * 100}vw`, x: 0 });

      pinRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * N}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1, // smooth the pin engage (no flicker)
        invalidateOnRefresh: true, // recompute on resize
        ignoreMobileResize: true, // ignore mobile URL-bar show/hide jitter
        onRefresh: () => {
          // Keep the horizontal track aligned to the active slide after a resize
          gsap.set(trackRef.current, {
            x: -activeIndexRef.current * window.innerWidth,
          });
        },
        onLeaveBack: () => {
          activeIndexRef.current = 0;
          setActiveIndex(0);
          gsap.set(trackRef.current, { x: 0 });
        },
        onUpdate: (self) => {
          if (!self.isActive || !goToSlideRef.current) return;
          const newIndex = Math.min(N - 1, Math.floor(self.progress * N));
          if (newIndex !== activeIndexRef.current) {
            goToSlideRef.current(newIndex);
          }
        },
      });
    });

    // ── MOBILE/TABLET (<lg): per-card entry animation as each scrolls in ──
    mm.add("(max-width: 1023px)", () => {
      slideRefs.current.filter(Boolean).forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    // ── Section header + CTA banner fade-in (all breakpoints) ──
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const goToSlide = (index) => {
      if (isAnimatingRef.current || index < 0 || index >= N) return;
      isAnimatingRef.current = true;
      activeIndexRef.current = index;
      setActiveIndex(index);
      gsap.to(track, {
        x: -index * window.innerWidth,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    };

    goToSlideRef.current = goToSlide;

    // Touch support for mobile
    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (!pinRef.current?.isActive) return;
      if (isAnimatingRef.current) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      const dir = dy > 0 ? 1 : -1;
      const newIndex = Math.max(
        0,
        Math.min(N - 1, activeIndexRef.current + dir),
      );
      goToSlide(newIndex);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full flex flex-col lg:overflow-hidden lg:h-[100svh]"
      >
        {/* Header — extra top padding on mobile clears the fixed nav pill */}
        <div className="flex-shrink-0 z-20 px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-24 lg:pt-14 pb-4 sm:pb-6 md:pb-8 lg:pb-10 flex justify-between items-start flex-col lg:flex-row gap-4 md:gap-6">
          <div ref={headerRef}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold leading-tight">
              Our Work
            </h2>
            <p className="text-textColor text-xs sm:text-sm md:text-base lg:text-lg mt-1.5 md:mt-2 max-w-xl">
              Stories we&apos;ve shaped, identities we&apos;ve built, and brands
              we&apos;ve helped grow.
            </p>
          </div>

          {/* Progress dots — only meaningful for the horizontal desktop slideshow */}
          <div className="hidden lg:flex gap-2 md:gap-3 items-center lg:pt-4">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 48 : 16,
                  backgroundColor:
                    i === activeIndex
                      ? "var(--color-dark-purple)"
                      : "var(--color-textColor)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Slide track — horizontal row on desktop, vertical stack on mobile */}
        <div className="lg:flex-1 lg:overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row lg:h-full"
            style={{ willChange: "transform" }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => (slideRefs.current[i] = el)}
                className="flex-shrink-0 w-full lg:w-screen lg:h-full flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8 md:py-10 lg:py-8"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-14 items-center justify-center lg:justify-start w-full lg:h-full">
                  {/* Image — full image shown on mobile (contain), fills frame on desktop (cover) */}
                  <div
                    ref={(el) => (imageRefs.current[i] = el)}
                    className="w-full lg:w-[48%] rounded-2xl lg:rounded-3xl overflow-hidden flex-shrink-0 lg:h-full lg:max-h-[440px]"
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={() => resetTilt(i)}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={700}
                      height={500}
                      className="w-full h-auto lg:h-full object-contain lg:object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-[52%] flex flex-col gap-3 md:gap-4 lg:gap-5">
                    <span className="text-xs font-semibold wwd-phil-gradient tracking-[0.18em] uppercase">
                      {slide.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-textColor text-sm sm:text-base md:text-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-textColor mb-1">
                        Highlights
                      </p>
                      <p className="text-foreground text-sm sm:text-base">
                        {slide.highlights}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 md:gap-2">
                      {slide.impact.map((metric, j) => (
                        <div key={j} className="flex gap-2 items-center">
                          <Image
                            src="/images/check-mark-green.svg"
                            width={16}
                            height={16}
                            alt="check"
                            className="w-4 sm:w-[18px]"
                          />
                          <span className="text-textColor text-xs sm:text-sm md:text-base">
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

      {/* CTA Banner */}
      <div
        ref={ctaRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-20 sm:pb-24 md:pb-24 lg:pb-28"
      >
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4 md:gap-6 our-work-banner-strip rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <p className="text-white sm:text-lg md:text-xl lg:text-2xl text-center sm:text-left">
            We&apos;ve got more cool stuff waiting for you — go explore!
          </p>
          <Link href="#" className="primary-btn">
            View All Projects
            <span className="btn-icon">
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
