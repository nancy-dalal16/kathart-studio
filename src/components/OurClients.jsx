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
        className={`flex gap-8 sm:gap-12 md:gap-16 whitespace-nowrap items-center ${
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
const logoClass = "h-7 sm:h-8 md:h-10 w-auto object-contain flex-shrink-0";

function LogoRow1() {
  return (
    <>
      <Image
        src="/images/clients/creative-market.svg"
        alt="Creative market"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/walmart.svg"
        alt="Walmart"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/maze.svg"
        alt="Maze"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/bukalapak.svg"
        alt="Bukalapak"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/grapho.svg"
        alt="Grapho"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/traveloka.svg"
        alt="Traveloka"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/ebay.svg"
        alt="eBay"
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
        src="/images/clients/emblem.svg"
        alt="Emblem"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/iconic.svg"
        alt="Iconic"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/optimal.svg"
        alt="Optimal"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/visualy.svg"
        alt="Visually"
        width={500}
        height={500}
        className={logoClass}
      />
      <Image
        src="/images/clients/signet.svg"
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
      className="relative flex flex-col items-center justify-center py-8 sm:py-16 md:py-24 lg:py-40 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden w-full"
    >
      {/* Background Decorative Image */}
      <>
        {/* Dark Mode Image */}
        <Image
          src="/images/our-clients-back.png"
          alt="Background Element"
          width={1440}
          height={328}
          className="clients-bg-dark absolute md:top-[180px] top-[400px] left-0 w-full opacity-40 object-contain"
        />

        {/* Light Mode Image */}
        <Image
          src="/images/our-clients-light-bg.png"
          alt="Background Element"
          width={1440}
          height={328}
          className="clients-bg-light absolute md:top-[180px] top-[400px] left-0 w-full opacity-40 object-contain"
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
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-48 lg:w-64 xl:w-[20rem]"
        style={{
          background: "linear-gradient(to right, var(--bg-base), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-48 lg:w-64 xl:w-[20rem]"
        style={{
          background: "linear-gradient(to left, var(--bg-base), transparent)",
        }}
      />
    </section>
  );
}
