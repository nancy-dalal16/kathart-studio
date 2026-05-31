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
      className="relative overflow-hidden w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-16 md:py-24 lg:py-40 flex flex-col items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 rounded-[0_0_40px_40px] sm:rounded-[0_0_60px_60px] lg:rounded-[0_0_80px_80px] whatwedo-section"
    >
      {/*
        Orbital system — absolute within the full section so arcs span the
        entire height and the section's overflow-hidden clips them cleanly.

        Ring centre sits at the right edge of the section, vertically centred.
        The Ring.png image contains 4 concentric rings.
        Each of the 4 "planets" sits on one ring:

          Ring 4 (outermost) → Film-reel (2.png) — upper-left arc
          Ring 3             → Megaphone (1.png) — lower-left arc
          Ring 2             → Empty moon (Empty.png) — upper-right arc (small)
          Ring 1 (innermost) → Empty moon (Empty.png) — lower-right arc (larger)
      */}
      <div
        ref={imageRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* ═══ DARK MODE GROUP ═══ */}
        <div className="whatwedo-dark-group absolute inset-0 transition-opacity duration-500">
          {/* Orbital rings — 4 concentric circles */}
          <Image
            src={`${DARK}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "34vw", height: "34vw" }}
          />
          <Image
            src={`${DARK}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "44vw", height: "44vw" }}
          />
          <Image
            src={`${DARK}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw" }}
          />
          <Image
            src={`${DARK}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw" }}
          />

          {/* Sun */}
          <Image
            src={`${DARK}/Sun.png`}
            alt=""
            width={700}
            height={700}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "24vw", height: "24vw" }}
          />

          {/* Film-reel (2.png) — Ring 4 (outermost), upper-left arc */}
          <Image
            src={`${DARK}/2.png`}
            alt="Film & content"
            width={200}
            height={200}
            className="absolute select-none"
            style={{ top: "35%", right: "19%", transform: "translate(-50%, -50%)", width: "clamp(80px, 9vw, 160px)", height: "auto" }}
          />

          {/* Small empty moon — Ring 2, upper-right arc (near sun) */}
          <Image
            src={`${DARK}/Empty.png`}
            alt=""
            width={60}
            height={60}
            className="absolute select-none"
            style={{ top: "38%", right: "11.5%", transform: "translate(-50%, -50%)", width: "clamp(30px, 3.8vw, 60px)", height: "auto" }}
          />

          {/* Megaphone (1.png) — Ring 3, lower-left arc */}
          <Image
            src={`${DARK}/1.png`}
            alt="Marketing"
            width={120}
            height={120}
            className="absolute select-none"
            style={{ top: "58%", right: "33.5%", transform: "translate(-50%, -50%)", width: "clamp(50px, 5.8vw, 100px)", height: "auto" }}
          />

          {/* Larger empty moon — Ring 1 (innermost), lower-right arc */}
          <Image
            src={`${DARK}/Empty.png`}
            alt=""
            width={80}
            height={80}
            className="absolute select-none"
            style={{ top: "75%", right: "12%", transform: "translate(-50%, -50%)", width: "clamp(35px, 4.5vw, 75px)", height: "auto" }}
          />
        </div>

        {/* ═══ LIGHT MODE GROUP ═══ */}
        <div className="whatwedo-light-group absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none">
          {/* Orbital rings — 4 concentric circles (mirrors dark mode) */}
          <Image
            src={`${LIGHT}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "34vw", height: "34vw" }}
          />
          <Image
            src={`${LIGHT}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "44vw", height: "44vw" }}
          />
          <Image
            src={`${LIGHT}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw" }}
          />
          <Image
            src={`${LIGHT}/Ring.png`}
            alt=""
            width={1200}
            height={1200}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw" }}
          />

          {/* Sun — no light variant, reuse dark sun */}
          <Image
            src={`${DARK}/Sun.png`}
            alt=""
            width={700}
            height={700}
            className="absolute max-w-none select-none"
            style={{ top: "50%", left: "100%", transform: "translate(-50%, -50%)", width: "24vw", height: "24vw" }}
          />

          {/* Film-reel (2.png) — Ring 4 (outermost), upper-left arc */}
          <Image
            src={`${LIGHT}/2.png`}
            alt="Film & content"
            width={200}
            height={200}
            className="absolute select-none"
            style={{ top: "35%", right: "19%", transform: "translate(-50%, -50%)", width: "clamp(80px, 9vw, 160px)", height: "auto" }}
          />

          {/* Small empty moon — Ring 2, upper-right arc (near sun) */}
          <Image
            src={`${LIGHT}/Empty.png`}
            alt=""
            width={60}
            height={60}
            className="absolute select-none"
            style={{ top: "38%", right: "11.5%", transform: "translate(-50%, -50%)", width: "clamp(30px, 3.8vw, 60px)", height: "auto" }}
          />

          {/* Megaphone (1.png) — Ring 3, lower-left arc */}
          <Image
            src={`${LIGHT}/1.png`}
            alt="Marketing"
            width={120}
            height={120}
            className="absolute select-none"
            style={{ top: "58%", right: "33.5%", transform: "translate(-50%, -50%)", width: "clamp(50px, 5.8vw, 100px)", height: "auto" }}
          />

          {/* Larger empty moon — Ring 1 (innermost), lower-right arc */}
          <Image
            src={`${LIGHT}/Empty.png`}
            alt=""
            width={80}
            height={80}
            className="absolute select-none"
            style={{ top: "75%", right: "12%", transform: "translate(-50%, -50%)", width: "clamp(35px, 4.5vw, 75px)", height: "auto" }}
          />
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
        <div className="w-full lg:w-1/2 h-[300px] sm:h-[380px] md:h-[460px] lg:h-[520px]" />
      </div>
    </section>
  );
}

export default WhatWeDo;
