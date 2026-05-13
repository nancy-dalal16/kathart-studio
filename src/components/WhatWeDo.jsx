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
      ref={sectionRef} // Use sectionRef to define the trigger area
      className="w-full min-h-screen px-6 sm:px-10 lg:px-20 py-20 sm:py-32 lg:py-40 flex flex-col items-center justify-center gap-16 rounded-[0_0_60px_60px] sm:rounded-[0_0_80px_80px] whatwedo-section"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* LEFT 50% - Text Content */}
        {/* Added textContentRef and overflow-hidden for smooth entrance */}
        <div
          ref={textContentRef}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6 overflow-hidden"
        >
          <div className="flex flex-col items-start gap-6 overflow-hidden">
            <h1 className="font-semibold text-foreground text-4xl sm:text-5xl lg:text-[64px] leading-tight">
              What we do
            </h1>

            <div className="flex flex-col gap-3">
              <p className="text-textColor text-lg sm:text-xl leading-7 sm:leading-8 max-w-100">
                {` We don't hand you a logo and walk away. We think in systems - brand identity, film, content, marketing - so every touchpoint says the same true thing about your business.`}
              </p>

              {/* <p className="text-textColor text-lg sm:text-xl leading-7 sm:leading-8 max-w-100">
              Our work helps brands express who they are, connect deeply with
              their audiences, and <strong>grow with purpose</strong>.
            </p> */}
            </div>

            <Link href="/capabilities" className="primary-btn">
              Our Capabilities
              <span className="btn-icon">
                <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT 50% - Image */}
        {/* Added imageRef and overflow-hidden to the parent for smooth slide */}
        <div className="w-full lg:w-1/2 flex justify-center items-center overflow-hidden">
          <Image
            ref={imageRef} // Use imageRef to target the image for animation
            src="/images/whatwedo.png"
            alt="Concept cinema with film elements"
            width={600}
            height={600}
            className="w-full h-auto object-contain "
          />
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
