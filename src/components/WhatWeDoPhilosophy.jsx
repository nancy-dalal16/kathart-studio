"use client";
import { useLayoutEffect, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const sentences = [
  [{ t: "turn good businesses into " }, { t: "believable brands", hi: true }, { t: "." }],
  [{ t: "" }, { t: "earn attention", hi: true }, { t: " instead of demanding it." }],
  [{ t: "don’t confuse being visible with " }, { t: "being valuable", hi: true }, { t: "." }],
  [{ t: "don’t chase attention at the cost of " }, { t: "credibility", hi: true }, { t: "." }],
];

export default function WhatWeDoPhilosophy() {
  const root = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray(".wwd-phil-line");

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          // one screen of scroll per sentence
          end: () => "+=" + window.innerHeight * frames.length,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1,
          // Snap so every scroll settles on a fully-visible sentence,
          // never on an in-between transition state.
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut",
          },
        },
      });

      // CTA fades in once and then stays static for the whole pin
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4 },
      );

      frames.forEach((frame, i) => {
        // Each full sentence (incl. "We") fades in centered
        tl.fromTo(
          frame,
          {
            opacity: 0,
            scale: 1.15,
            filter: "blur(8px)",
            transformOrigin: "center center",
          },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5 },
        );
        // Snap point — sentence fully visible & sharp
        tl.addLabel("frame" + i);
        // Dwell so the snap has a comfortable resting zone
        tl.to(frame, { opacity: 1, duration: 0.4 });
        // Blur + scale out before the next one (last one stays)
        if (i !== frames.length - 1) {
          tl.to(frame, {
            opacity: 0,
            scale: 0.9,
            filter: "blur(8px)",
            duration: 0.5,
          });
        }
      });
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

      {/* Cycling sentences — each full sentence is centered as a block */}
      <div className="relative z-10 my-8 h-[40vh] w-full sm:my-10">
        {sentences.map((parts, i) => (
          <div
            key={i}
            className="wwd-phil-line absolute inset-0 flex items-center justify-center px-6 text-center sm:px-10 md:px-16"
            style={{ opacity: 0 }}
          >
            <p className="max-w-[16ch] font-bold leading-[1.1] text-foreground text-4xl [text-wrap:balance] [font-family:var(--font-geologica)] sm:max-w-[20ch] sm:text-5xl md:max-w-[24ch] md:text-6xl lg:text-7xl">
              We{" "}
              {parts.map(({ t, hi }, j) =>
                hi ? <span key={j} className="wwd-phil-gradient">{t}</span> : t
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Static CTA */}
      <div
        ref={ctaRef}
        className="relative z-10 flex flex-col items-center gap-5"
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
