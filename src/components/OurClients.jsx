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
function Marquee({ children, reverse = false, speed = 30, className = "" }) {
  const marqueeRef = useRef(null);

  const pause = () => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "paused";
  };

  const resume = () => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "running";
  };

  return (
    <div
      className={`relative overflow-hidden w-full select-none ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div
        ref={marqueeRef}
        className={`flex gap-5 sm:gap-8 md:gap-14 lg:gap-16 whitespace-nowrap items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ⭐ Logo Rows (Inline, same file)
// -----------------------------------------------------------------------------
const logoClass =
  // Height-based sizing (auto width hugs each logo — no empty boxes/gaps).
  // Larger on mobile so only ~3-4 fit across the viewport.
  "client-logo h-11 sm:h-12 md:h-12 lg:h-16 w-auto max-w-[140px] sm:max-w-[150px] md:max-w-[160px] object-contain flex-shrink-0";

function LogoRow1() {
  return (
    <>
      <Image
        src="/images/clients/Murgappa.png"
        alt="Creative market"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Tide.png"
        alt="Walmart"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Wealthseva.png"
        alt="Maze"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Startup-Factory.png"
        alt="Bukalapak"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Altizon.png"
        alt="Grapho"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Zlade.png"
        alt="Traveloka"
        width={500}
        height={500}
        className={logoClass}
      />
      {/* <Image
        src="/images/clients/ebay.svg"
        alt="eBay"
        width={500}
        height={500}
        className={logoClass}
      /> */}
    </>
  );
}

function LogoRow2() {
  return (
    <>
      <Image
        src="/images/clients/ezest.png"
        alt="Emblem"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Gyde.png"
        alt="Iconic"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Indus.png"
        alt="Optimal"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Purple.png"
        alt="Visually"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/Cresa.png"
        alt="Signet"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/SAPL.png"
        alt="Signet"
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
