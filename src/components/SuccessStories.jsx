"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote:
      "They listened to our needs, focused on our audience, and gave our brand a competitive edge. Their approach was strategic and highly effective!",
    author: "Aron Finch",
    position: "CEO & Tech Director - Amplify Tech",
    image: "/images/aron-finch.png",
  },
  {
    quote:
      "Their eye for detail and understanding of our audience completely transformed our visual identity.",
    author: "Sana Kapoor",
    position: "Brand Director - Vistara Media",
    image: "/images/aron-finch.png",
  },
  {
    quote:
      "A thoughtful, strategic, and highly creative team. The results we saw were outstanding.",
    author: "Rahul Deshmukh",
    position: "Founder - PixelForge",
    image: "/images/aron-finch.png",
  },
  {
    quote: "They didn't just design for us — they designed with us.",
    author: "Mira Patel",
    position: "Co-founder - Brightnest",
    image: "/images/aron-finch.png",
  },
];

const N = testimonials.length;

export default function SuccessStories() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme ||
        localStorage.getItem("theme") ||
        "dark",
    );
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const dots = dotRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    // Original design preserved: front = y:84 (bottom), back = y:0 (top)
    const positions = [
      { y: 84, scale: 1, zIndex: N },
      { y: 56, scale: 0.96, zIndex: N - 1 },
      { y: 28, scale: 0.92, zIndex: N - 2 },
      { y: 0, scale: 0.88, zIndex: 1 },
    ];

    cards.forEach((card, i) =>
      gsap.set(card, { ...positions[i], opacity: 1, force3D: true }),
    );

    const stepSize = 1 / (N - 1);
    const halfStep = stepSize / 2;
    const totalScroll = (N - 1) * 400;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (N - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0.05,
            ease: "power2.inOut",
          },
        },
      });

      for (let step = 0; step < N - 1; step++) {
        const time = step * stepSize;
        const exitIdx = step % N; // card currently at front
        const activeIdx = (step + 1) % N;

        // Phase A — front card falls DOWN off screen (clipped by section overflow-hidden)
        tl.to(
          cards[exitIdx],
          {
            y: 400,
            scale: 0.88,
            ease: "power2.in",
            duration: halfStep,
            force3D: true,
          },
          time,
        );

        // While fully off screen, snap position to above the container + lowest z
        // This snap is invisible because the card is at y:600 (below clipping boundary)
        tl.set(cards[exitIdx], { y: 0, zIndex: 1 }, time + halfStep);

        // Phase B — card drops down from above into the back position (y:0)
        // tl.to(
        //   cards[exitIdx],
        //   {
        //     y: 0,
        //     scale: 0.88,
        //     ease: "power2.out",
        //     duration: halfStep,
        //     force3D: true,
        //   },
        //   time + halfStep,
        // );

        // All other cards advance one position forward — runs over the full step
        for (let cardIdx = 0; cardIdx < N; cardIdx++) {
          if (cardIdx === exitIdx) continue;
          const newPosIdx = (cardIdx - step - 1 + N * 2) % N;
          const pos = positions[newPosIdx];
          tl.to(
            cards[cardIdx],
            {
              y: pos.y,
              scale: pos.scale,
              zIndex: pos.zIndex,
              ease: "sine.inOut",
              duration: stepSize * 0.85,
              force3D: true,
            },
            time,
          );
        }

        // Dots — scrubbed timeline, no tl.call
        dots.forEach((dot, di) => {
          tl.to(
            dot,
            {
              height: di === activeIdx ? 40 : 14,
              backgroundColor:
                di === activeIdx ? "#B88BFF" : "rgba(255,255,255,0.35)",
              ease: "power2.inOut",
              duration: stepSize * 0.85,
            },
            time,
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center pt-12 sm:pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-16 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="relative z-20 text-center mb-12 md:mb-16 lg:mb-20 shrink-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
          Success Stories
        </h2>
        <p className="text-textColor text-xs sm:text-sm md:text-base lg:text-lg mt-2 md:mt-3 max-w-3xl mx-auto">
          Stories we&apos;ve shaped, identities we&apos;ve built, and brands
          we&apos;ve helped grow.
        </p>
      </div>

      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center">
        <div
          className="relative w-full"
          style={{ height: "clamp(500px, 62vh, 560px)" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute inset-x-0"
              style={{ top: 0, willChange: "transform" }}
            >
              <div
                className="w-full rounded-xl sm:rounded-2xl border-0 flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-10 p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden"
                style={{
                  backgroundImage:
                    theme === "light"
                      ? "linear-gradient(135deg, rgba(243, 230, 255,1) 0%, rgba(243, 230, 255,0.3) 100%), url(/images/success-stories-back.jpg)"
                      : "linear-gradient(135deg, rgba(10,8,24,0.78) 0%, rgba(10,8,24,0.68) 100%), url(/images/success-stories-back.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                }}
              >
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 flex-1 min-w-0">
                  <blockquote className="text-foreground font-light text-base sm:text-lg md:text-xl lg:text-[1.35rem] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <h4 className="text-primary text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                      {t.author}
                    </h4>
                    <p className="text-foreground text-xs sm:text-sm mt-0.5 md:mt-1">
                      {t.position}
                    </p>
                  </div>
                </div>
                <div className="w-24 h-32 sm:w-32 sm:h-40 md:w-48 md:h-60 lg:w-60 lg:h-72 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={t.image}
                    className="w-full h-full object-cover"
                    alt={t.author}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(108,84,255,0.3),rgba(227,130,255,0.2));font-size:3rem;font-weight:700;color:#B88BFF">${t.author.charAt(0)}</div>`;
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
          {testimonials.map((_, i) => (
            <div
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="w-1.5 rounded-full"
              style={{
                height: i === 0 ? 40 : 14,
                backgroundColor: i === 0 ? "#B88BFF" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>

      {/* <div className="flex flex-col items-center gap-2 mt-8 text-textColor">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-textColor/50 to-transparent" />
      </div> */}
    </section>
  );
}
