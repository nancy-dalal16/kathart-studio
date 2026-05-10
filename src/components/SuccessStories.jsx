"use client";

import React, { useLayoutEffect, useRef } from "react";
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

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const dots = dotRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    // Stack offsets
    const offsets = [0, 28, 56, 84];

    // Initial positions
    cards.forEach((card, i) => {
      gsap.set(card, {
        y: offsets[i] ?? 84,
        scale: 1 - i * 0.04,
        opacity: 1 - i * 0.15,
        zIndex: N - i,
      });
    });

    const totalScroll = N * 500;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1,
          pin: true,
        },
      });

      for (let i = 0; i < N; i++) {
        const time = i / N;

        // Top card flies up
        tl.to(cards[i], {
          y: -250,
          opacity: 0,
          scale: 0.7,
          ease: "power2.in",
          duration: 0.25,
        }, time);

        // Second card comes to front
        if (cards[i + 1]) {
          tl.to(cards[i + 1], {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 0.25,
          }, time);
        }

        // Other cards slide up
        for (let j = i + 2; j < N; j++) {
          const newOffset = offsets[j - i - 1] ?? 84;
          tl.to(cards[j], {
            y: newOffset,
            scale: 1 - (j - i - 1) * 0.04,
            opacity: 1 - (j - i - 1) * 0.15,
            ease: "power2.out",
            duration: 0.25,
          }, time);
        }

        // Update dots
        tl.call(() => {
          const activeIdx = (i + 1) % N;
          dots.forEach((dot, di) => {
            gsap.to(dot, {
              height: di === activeIdx ? 40 : 14,
              opacity: di === activeIdx ? 1 : 0.35,
              duration: 0.2,
            });
          });
        }, [], time + 0.1);
      }

      // Reset all
      tl.call(() => {
        cards.forEach((card, i) => {
          gsap.set(card, {
            y: offsets[i] ?? 84,
            scale: 1 - i * 0.04,
            opacity: 1 - i * 0.15,
            zIndex: N - i,
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center pt-16 md:pt-24 pb-16 px-4 md:px-10 lg:px-20 overflow-hidden"
    >
      <div className="relative z-20 text-center mb-16 md:mb-20 flex-shrink-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">
          Success Stories
        </h2>
        <p className="text-textColor text-sm sm:text-base md:text-lg mt-3 max-w-3xl mx-auto">
          Stories we&apos;ve shaped, identities we&apos;ve built, and brands
          we&apos;ve helped grow.
        </p>
      </div>

      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center">
        <div
          className="relative w-full"
          style={{ height: "clamp(400px, 50vh, 520px)" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute inset-x-0"
              style={{ top: 0 }}
            >
              <div
                className="w-full rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8 md:p-10 overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(10,8,24,0.78) 0%, rgba(10,8,24,0.68) 100%), url(/images/success-stories-back.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                }}
              >
                <div className="flex flex-col gap-4 md:gap-6 flex-1 min-w-0">
                  <blockquote className="text-white/90 font-light text-lg sm:text-xl md:text-[1.35rem] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <h4 className="text-primary text-lg md:text-xl font-medium">
                      {t.author}
                    </h4>
                    <p className="text-white/50 text-xs sm:text-sm mt-1">
                      {t.position}
                    </p>
                  </div>
                </div>
                <div className="w-28 h-36 sm:w-36 sm:h-44 md:w-60 md:h-72 rounded-xl overflow-hidden flex-shrink-0">
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
              className="w-1.5 rounded-full bg-primary transition-all duration-300"
              style={{
                height: i === 0 ? 40 : 14,
                opacity: i === 0 ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-8 text-textColor">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-textColor/50 to-transparent" />
      </div>
    </section>
  );
}