"use client";
import { useLayoutEffect, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// isTitle=true → large display text (title frames)
// isTitle=false → medium text for one-liner sentences
const frames = [
  { isTitle: true, top: "What we", bottom: "do." },
  {
    isTitle: false,
    top: "Turn good businesses into",
    bottom: "brands people can believe in.",
  },
  { isTitle: false, top: "Earn attention", bottom: "instead of demanding it." },
  { isTitle: true, top: "What we", bottom: "don't." },
  {
    isTitle: false,
    top: "Confuse being visible",
    bottom: "with being valuable.",
  },
  {
    isTitle: false,
    top: "Chase attention",
    bottom: "at the cost of credibility.",
  },
];

export default function WhatWeDoPhilosophy() {
  const root = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".wwd-phil-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=560%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1,
        },
      });

      items.forEach((it, i) => {
        tl.fromTo(
          it,
          { opacity: 0, scale: 1.15, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5 },
        );
        if (i !== items.length - 1) {
          tl.to(it, {
            opacity: 0,
            scale: 0.9,
            filter: "blur(8px)",
            duration: 0.5,
          });
        }
      });

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15",
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={root}
      className="wwd-philosophy-section tex-grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="tex-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2" />

      {/* Animated frames */}
      <div className="relative z-10 h-[50vh] w-full">
        {frames.map(({ isTitle, top, bottom }, i) => (
          <div
            key={i}
            className="wwd-phil-line absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-10 md:px-16"
            style={{ opacity: 0 }}
          >
            {isTitle ? (
              /* Title/divider frame — large display text */
              <>
                <span className="block font-bold leading-[0.9] text-foreground text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw]">
                  {top}
                </span>
                <span className="wwd-phil-gradient block font-bold leading-[0.9] text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw]">
                  {bottom}
                </span>
              </>
            ) : (
              /* Content frame — readable sentence size */
              <>
                {/* <span
                  className="block font-semibold leading-snug text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  style={{ opacity: 0.4 }}
                >
                  {top}
                </span>
                <span className="wwd-phil-gradient block font-semibold leading-snug text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {bottom}
                </span> */}
                <span className="block font-semibold leading-[0.9] text-foreground text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw]">
                  {top}
                </span>
                <span className="wwd-phil-gradient block font-bold leading-[0.9] text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw]">
                  {bottom}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* CTA — fades in with the last frame */}
      <div
        ref={ctaRef}
        className="absolute bottom-50 z-10 flex flex-col items-center gap-5"
        style={{ opacity: 0 }}
      >
        <Link href="/capabilities" className="primary-btn">
          Our Capabilities
          <span className="btn-icon">
            <ArrowRight size={13} strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </section>
  );
}
