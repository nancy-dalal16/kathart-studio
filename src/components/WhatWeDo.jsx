"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/* ── Dark‑mode image paths ── */
const DARK = "/images/What We Do Section_Png/What We Do Section_Png";
/* ── Light‑mode image paths ── */
const LIGHT = "/images/What We Do Section_Png/What We Do Section_Png/White";

/**
 * Renders the orbital system (rings + sun + planets) for a given theme.
 * Uses CSS classes for responsive sizing so each element has fixed
 * positions across every breakpoint.
 */
function OrbitalSystem({ basePath, darkSunPath, isDark }) {
  const sunSrc = isDark ? `${basePath}/Sun.png` : `${darkSunPath}/Sun.png`;

  return (
    <>
      {/* ─── Concentric rings ─── */}
      <Image
        src={`${basePath}/Ring.png`}
        alt=""
        width={1200}
        height={1200}
        className="absolute max-w-none select-none wwd-ring wwd-ring-1"
      />
      <Image
        src={`${basePath}/Ring.png`}
        alt=""
        width={1200}
        height={1200}
        className="absolute max-w-none select-none wwd-ring wwd-ring-2"
      />
      <Image
        src={`${basePath}/Ring.png`}
        alt=""
        width={1200}
        height={1200}
        className="absolute max-w-none select-none wwd-ring wwd-ring-3"
      />
      <Image
        src={`${basePath}/Ring.png`}
        alt=""
        width={1200}
        height={1200}
        className="absolute max-w-none select-none wwd-ring wwd-ring-4"
      />

      {/* ─── Sun ─── */}
      <Image
        src={sunSrc}
        alt=""
        width={700}
        height={700}
        className="absolute max-w-none select-none wwd-sun"
      />

      {/* Film-reel (2.png) — Ring 4 (outermost), upper-left arc */}
      <Image
        src={`${basePath}/2.png`}
        alt="Film & content"
        width={200}
        height={200}
        className="absolute select-none wwd-planet wwd-planet-film"
      />

      {/* Small empty moon — Ring 2, upper-right arc (near sun) */}
      <Image
        src={`${basePath}/Empty.png`}
        alt=""
        width={60}
        height={60}
        className="absolute select-none wwd-planet wwd-planet-moon-sm"
      />

      {/* Megaphone (1.png) — Ring 3, lower-left arc */}
      <Image
        src={`${basePath}/1.png`}
        alt="Marketing"
        width={120}
        height={120}
        className="absolute select-none wwd-planet wwd-planet-mega"
      />

      {/* Larger empty moon — Ring 1 (innermost), lower-right arc */}
      <Image
        src={`${basePath}/Empty.png`}
        alt=""
        width={80}
        height={80}
        className="absolute select-none wwd-planet wwd-planet-moon-lg"
      />
    </>
  );
}

function WhatWeDo() {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !textContentRef.current || !imageRef.current)
      return;

    let played = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played) {
            played = true;
            observer.disconnect();

            const textElements = gsap.utils.selector(textContentRef.current)(
              "h1, p, a",
            );

            gsap.from(textElements, {
              y: 30,
              opacity: 0,
              duration: 0.9,
              delay: 0.5,
              ease: "power3.out",
              stagger: 0.12,
            });

            gsap.from(imageRef.current, {
              x: 80,
              opacity: 0,
              duration: 1.1,
              delay: 0.5,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-16 md:py-24 lg:py-40 flex flex-col items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 rounded-[40px_40px_40px_40px] sm:rounded-[60px_60px_60px_60px] lg:rounded-[80px_80px_80px_80px] whatwedo-section"
    >
      {/*
        DESKTOP (lg+): Orbital system is absolute within the full section
        so arcs span the entire height and the section's overflow-hidden
        clips them cleanly at the right edge (half-circle effect).

        MOBILE/TABLET (<lg): Orbital system lives inside a relative
        container (the spacer div) so it doesn't overlap the text below.
      */}

      {/* ═══ DESKTOP orbital layer (lg+ only) — absolutely positioned ═══ */}
      <div
        ref={imageRef}
        className="wwd-orbital-layer pointer-events-none"
        aria-hidden="true"
      >
        {/* ── DARK MODE ── */}
        <div className="whatwedo-dark-group absolute inset-0 transition-opacity duration-500">
          <OrbitalSystem basePath={DARK} darkSunPath={DARK} isDark />
        </div>

        {/* ── LIGHT MODE ── */}
        <div className="whatwedo-light-group absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none">
          <OrbitalSystem basePath={LIGHT} darkSunPath={DARK} isDark={false} />
        </div>
      </div>

      {/* Content row — sits above the orbital background */}
      <div className="relative z-10 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-20">
        {/* LEFT — text */}
        <div
          ref={textContentRef}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-center justify-center gap-4 md:gap-6 lg:gap-7"
        >
          <div className="flex flex-col items-center lg:items-start gap-3 md:gap-5 lg:gap-6 text-center lg:text-left">
            <div className="overflow-hidden flex flex-col items-center lg:items-start gap-3 md:gap-5">
              <h1 className="font-semibold text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight">
                What we do
              </h1>

              <div className="flex flex-col gap-2 md:gap-3">
                <p className="text-textColor text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 md:leading-8 max-w-full lg:max-w-100">
                  {` We don't hand you a logo and walk away. We think in systems - brand identity, film, content, marketing - so every touchpoint says the same true thing about your business.`}
                </p>
              </div>
            </div>

            <Link href="/capabilities" className="primary-btn">
              Our Capabilities
              <span className="btn-icon">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT — spacer reserves the right half of the flex row */}
        <div className="w-full lg:w-1/2 wwd-spacer" />
      </div>
    </section>
  );
}

export default WhatWeDo;
