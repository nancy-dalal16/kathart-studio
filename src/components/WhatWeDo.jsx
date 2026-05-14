"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function WhatWeDo() {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const textElements = gsap.utils.selector(textContentRef.current)("h1, p");

      gsap.from(textElements, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.from(imageRef.current, {
        x: 80,
        opacity: 0,
        duration: 1.1,
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
      className="w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-16 md:py-24 lg:py-40 flex flex-col items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 rounded-[0_0_40px_40px] sm:rounded-[0_0_60px_60px] lg:rounded-[0_0_80px_80px] whatwedo-section"
    >
      <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-20">
        {/* LEFT 50% - Text Content */}
        <div
          ref={textContentRef}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center gap-4 md:gap-6 lg:gap-7 overflow-hidden"
        >
          <div className="flex flex-col items-center lg:items-start gap-3 md:gap-5 lg:gap-6 overflow-hidden text-center lg:text-left">
            <h1 className="font-semibold text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight">
              What we do
            </h1>

            <div className="flex flex-col gap-2 md:gap-3">
              <p className="text-textColor text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 md:leading-8 max-w-full lg:max-w-100">
                {` We don't hand you a logo and walk away. We think in systems - brand identity, film, content, marketing - so every touchpoint says the same true thing about your business.`}
              </p>
            </div>

            <Link href="/capabilities" className="primary-btn">
              Our Capabilities
              <span className="btn-icon">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT 50% - Image (appears first on mobile due to flex-col-reverse) */}
        <div className="w-full lg:w-1/2 flex justify-center items-center overflow-hidden mb-4 sm:mb-6 md:mb-0">
          <Image
            ref={imageRef}
            src="/images/whatwedo.png"
            alt="Concept cinema with film elements"
            width={600}
            height={600}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
