"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Button from "./ui/button";
import Image from "next/image";

// Register ScrollTrigger outside the component to ensure it's done once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WeAreSection() {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !backgroundRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(backgroundRef.current, {
        y: 100,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 10%",
          once: true,
        },
      });

      const elementsToAnimate = gsap.utils.selector(contentRef.current)(
        "img, h2, p, div:last-child"
      );

      gsap.from(elementsToAnimate, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="weare"
        ref={sectionRef}
        className="relative flex items-center justify-center min-h-[100vh] overflow-hidden"
      >
        {/* Background Layer: Next.js Image Component */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden" // This container holds the image
        >
          <Image
            ref={backgroundRef}
            alt="We Are background image"
            // object-cover is fine now since we are moving the image itself
            className="absolute inset-0 w-full h-full object-contain will-change-transform"
            src="/images/weare-Hero.png"
            width={1920}
            height={1080}
          />
        </div>

        {/* Content Layer */}
        <div
          ref={contentRef}
          className="flex flex-col items-center w-full relative z-10 px-4 sm:px-8 md:px-20 pb-16 pt-16"
        >
          <div className="flex flex-col items-center gap-8 md:gap-12 relative z-10 max-w-4xl w-full">
            {/* Logo + Headings */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
              <Image
                alt="Kathart logo icon"
                width={100}
                height={100}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32"
                src="/images/Kathart_logo-light.svg"
              />
              <div className="flex flex-col items-center gap-4 w-full">
                <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl text-center leading-tight">
                  We are
                </h2>
                <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl text-center leading-1">
                  Kathart Studios
                </h2>
              </div>
              <p className="text-center text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mt-3">
                At Kathart Studios, we believe every story deserves to be seen,
                felt, and remembered. We combine creativity, strategy, and craft
                across design, marketing, and film to create experiences that
                engage audiences, inspire action, and build brands that last.
              </p>
            </div>
            {/* Button */}
            <div>
              <Button className="primary-btn">
                Know more About us
                <span className="btn-icon">
                  <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
