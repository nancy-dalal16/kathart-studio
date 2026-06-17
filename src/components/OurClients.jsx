"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// ⭐ Marquee Component (No `cn`, fully rewritten)
// -----------------------------------------------------------------------------
function Marquee({
  children,
  reverse = false,
  speed = 30,
  repeat = 3,
  className = "",
}) {
  // The track is sized to its content (width: max-content) so translateX(-50%)
  // is measured against the content — not the viewport — and lands exactly on
  // the seam between the two identical halves. Each half repeats the logos
  // `repeat` times so it is always wider than the viewport, meaning the loop
  // never exposes empty space. animationDuration scales with `repeat` so the
  // on-screen speed stays constant regardless of how many copies are rendered.
  const groupClass =
    "flex items-center gap-5 sm:gap-8 md:gap-14 lg:gap-16 flex-shrink-0 pr-5 sm:pr-8 md:pr-14 lg:pr-16";

  const half = Array.from({ length: repeat }).map((_, i) => (
    <React.Fragment key={i}>{children}</React.Fragment>
  ));

  return (
    <div className={`relative overflow-hidden w-full select-none ${className}`}>
      <div
        className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{
          width: "max-content",
          animationDuration: `${speed * repeat}s`,
        }}
      >
        <div className={groupClass}>{half}</div>
        <div className={groupClass} aria-hidden="true">
          {half}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ⭐ Logo Rows (Inline, same file)
// -----------------------------------------------------------------------------
const logoClass =
  "client-logo h-10 sm:h-12 md:h-16 lg:h-20 w-auto max-w-[110px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[170px] object-contain flex-shrink-0";

function LogoRow1() {
  return (
    <>
      <Image
        src="/images/clients/Zlade.png"
        alt="Zlade"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Wealthseva.png"
        alt="Wealthseva"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Coreco.png"
        alt="Coreco"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Cogbee.svg"
        alt="Cogbee"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Gyde.png"
        alt="Gyde"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Altzor.svg"
        alt="Altzor"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Whitehedge.svg"
        alt="Whitehedge"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Murgappa.png"
        alt="Murgappa"
        width={500}
        height={500}
        className={logoClass}
      />
    </>
  );
}

function LogoRow2() {
  return (
    <>
      <Image
        src="/images/clients/Altizon.png"
        alt="Altizon"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/ezest.png"
        alt="ezest"
        width={500}
        height={500}
        className={logoClass}
      />

      <Image
        src="/images/clients/Indus.png"
        alt="Indus"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Purple.png"
        alt="Purple"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Cresa.png"
        alt="Cresa"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/SAPL.png"
        alt="SAPL"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Tracelink.svg"
        alt="Tracelink"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Startup-Factory.png"
        alt="Startup Factory"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Tii.png"
        alt="Tii"
        width={500}
        height={500}
        className={logoClass}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// ⭐ Main Component Export — Our Clients Section
// -----------------------------------------------------------------------------
export default function OurClients() {
  const headingRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden w-full"
    >
      {/* Background Decorative Image */}
      <>
        {/* Dark Mode Image */}
        <Image
          src="/images/our-clients-back.png"
          alt="Background Element"
          width={1440}
          height={328}
          className="clients-bg-dark pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none w-[240%] sm:w-[170%] md:w-[120%] lg:w-full opacity-40 object-contain"
        />

        {/* Light Mode Image */}
        <Image
          src="/images/our-clients-light-bg.png"
          alt="Background Element"
          width={1440}
          height={328}
          className="clients-bg-light pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none w-[240%] sm:w-[170%] md:w-[120%] lg:w-full opacity-40 object-contain"
        />
      </>
      {/* Headings */}
      <div
        ref={headingRef}
        className="max-w-3xl text-center space-y-2 md:space-y-3 relative z-10"
      >
        <h2 className="font-semibold text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Our Clients
        </h2>
        {/* <p className="text-foreground text-lg md:text-xl">
          {`Stories we’ve shaped, identities we've built, and brands we’ve helped
          grow.`}
        </p> */}
      </div>

      {/* Row 1 — Scroll Left */}
      <Marquee speed={35} className="mt-8 md:mt-12 lg:mt-16">
        <LogoRow1 />
      </Marquee>

      {/* Row 2 — Scroll Right */}
      <Marquee speed={40} reverse className="mt-4 md:mt-6 lg:mt-8">
        <LogoRow2 />
      </Marquee>

      {/* Left and Right Fade Edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 md:w-40 lg:w-56 xl:w-[18rem]"
        style={{
          background: "linear-gradient(to right, var(--bg-base), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 md:w-40 lg:w-56 xl:w-[18rem]"
        style={{
          background: "linear-gradient(to left, var(--bg-base), transparent)",
        }}
      />
    </section>
  );
}
