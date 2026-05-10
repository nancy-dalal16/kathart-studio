"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleArrowRight } from "lucide-react";
import Button from "./ui/button";
import Image from "next/image";

// Register ScrollTrigger outside the component
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function WhatWeDo() {
  const sectionRef = useRef(null);
  const textContentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // --- 1. Staggered Text Entrance (Left Side) ---
    const textElements = gsap.utils.selector(textContentRef.current)(
      "h1, p, .primary-btn" // Target the main heading, paragraphs, and the button
    );

    gsap.from(textElements, {
      y: 50, // Start 50px below
      opacity: 0, // Start invisible
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.15, // Stagger the appearance of each element
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // Start animation when 80% of the section is visible
        once: true, // Only run the animation once
        // markers: true, // Uncomment for debugging
      },
    });

    // --- 2. Image Slide-in (Right Side) ---
    gsap.from(imageRef.current, {
      x: 100, // Start 100px to the right
      opacity: 0, // Start invisible
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // Trigger at the same time as the text
        once: true, // Only run the animation once
      },
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
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
          className="w-full lg:w-1/2 flex flex-col items-start gap-6 overflow-hidden"
        >
          <h1 className="font-semibold text-foreground text-4xl sm:text-5xl lg:text-[64px] leading-tight">
            What we do
          </h1>

          <div className="flex flex-col gap-3">
            <p className="text-textColor text-lg sm:text-xl leading-7 sm:leading-8 max-w-100">
              We combine <strong>design, marketing, and film</strong> into one powerful
              creative offering.
            </p>

            <p className="text-textColor text-lg sm:text-xl leading-7 sm:leading-8 max-w-100">
              Our work helps brands express who they are, connect deeply with
              their audiences, and <strong>grow with purpose</strong>.
            </p>
          </div>

          <Button className="primary-btn">
            <span className="text-base font-medium text-white">
              Explore Capabilities
            </span>
          </Button>
        </div>

        {/* RIGHT 50% - Image */}
        {/* Added imageRef and overflow-hidden to the parent for smooth slide */}
        <div className="w-full lg:w-1/2 flex justify-center overflow-hidden">
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
