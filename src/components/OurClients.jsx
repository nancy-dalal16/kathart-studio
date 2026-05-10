"use client";

import React, { useRef } from "react";
import Image from "next/image";

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
        className={`flex gap-12 whitespace-nowrap ${
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
function LogoRow1() {
  return (
    <>
      <Image
        src="/images/clients/creative-market.svg"
        alt="Creative market"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/walmart.svg"
        alt="Walmart"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/maze.svg"
        alt="Maze"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/bukalapak.svg"
        alt="Vector4"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/grapho.svg"
        alt="grapho"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/traveloka.svg"
        alt="traveloka"
        width={500}
        height={500}
      />

      <Image
        src="/images/clients/ebay.svg"
        alt="ebay"
        width={500}
        height={500}
      />
    </>
  );
}

function LogoRow2() {
  return (
    <>
      <Image
        src="/images/clients/emblem.svg"
        alt="emblem"
        width={500}
        height={500}
      />
      <Image
        src="/images/clients/iconic.svg"
        alt="iconic"
        width={500}
        height={500}
      />{" "}
      <Image
        src="/images/clients/optimal.svg"
        alt="optimal"
        width={500}
        height={500}
      />{" "}
      <Image
        src="/images/clients/visualy.svg"
        alt="visualy"
        width={500}
        height={500}
      />{" "}
      <Image
        src="/images/clients/signet.svg"
        alt="signet"
        width={500}
        height={500}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// ⭐ Main Component Export — Our Clients Section
// -----------------------------------------------------------------------------
export default function OurClients() {
  return (
    <section className="relative flex flex-col items-center justify-center py-32 md:py-48 px-4 overflow-hidden w-full">
      {/* Background Decorative Image */}
      <Image
        src="/images/our-clients-back.png"
        alt="Background Element"
        width={1440}
        height={328}
        className="absolute md:top-[250px] top-[500px] left-0 w-full opacity-40 object-contain"
      />

      {/* Headings */}
      <div className="max-w-3xl text-center space-y-3 relative z-10">
        <h2 className="font-semibold text-foreground text-4xl md:text-6xl">
          Our Clients
        </h2>
        <p className="text-foreground text-lg md:text-xl">
          {`Stories we’ve shaped, identities we've built, and brands we’ve helped
          grow.`}
        </p>
      </div>

      {/* Row 1 — Scroll Left */}
      <Marquee speed={35} className="mt-16">
        <LogoRow1 />
      </Marquee>

      {/* Row 2 — Scroll Right */}
      <Marquee speed={40} reverse className="mt-6">
        <LogoRow2 />
      </Marquee>

      {/* Left and Right Fade Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[30rem]" style={{ background: 'linear-gradient(to right, var(--bg-base), transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[30rem]" style={{ background: 'linear-gradient(to left, var(--bg-base), transparent)' }} />
    </section>
  );
}
