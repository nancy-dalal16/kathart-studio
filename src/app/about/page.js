"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { CTA } from "@/components/CTA";
import CassiopeiaConstellation from "@/components/CassiopeiaConstellation";

gsap.registerPlugin(ScrollTrigger);

const approachSteps = [
  {
    image: "/images/about/approach-1.jpg",
    oneliner: "We find the story you can't ignore.",
    description:
      "We don't invent stories. We hunt the one already living in your system… the part you keep repeating to yourself at 3 a.m., the reason you started this in the first place - the \"why\". That's the story worth telling.",
  },
  {
    image: "/images/about/approach-2.jpg",
    oneliner: "We strip everything that isn't it.",
    description:
      "We gently move aside the noise until only the one thing that truly matters is left standing. What's left is the single, undeniable truth your brand owns. Nothing added. Nothing forced. Just the essence.",
  },
  {
    image: "/images/about/approach-3.jpg",
    oneliner: "We craft like it's ours.",
    description:
      "Identity that feels like it's always belonged to you. Films that stop thumbs mid-scroll. Words that turn strangers into believers. We don't stop until the work sells itself.",
  },
  {
    image: "/images/about/approach-4.jpg",
    oneliner: "We release what lasts.",
    description:
      "The katha leaves our hands quietly. Just a story set free to find its people. Ten years from now it still feels true, still pulls the right founders in, still quietly prospers. That's the catharsis we chase.",
  },
];

const beliefCards = [
  {
    icon: "/images/about/story.svg",
    title: "Story over schedule",
    description: "We craft narratives that outlive trends",
  },
  {
    icon: "/images/about/strategy.svg",
    title: "Strategy over operations",
    description: "Depth drives every decision",
  },
  {
    icon: "/images/about/vision.svg",
    title: "Vision over volume",
    description: "Your brand grows from its core",
  },
  {
    icon: "/images/about/legacy.svg",
    title: "Legacy over flash",
    description: "We build what endures, quietly & permanently.",
  },
];

export default function AboutPage() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const essenceSectionRef = useRef(null);
  const approachSectionRef = useRef(null);
  const approachStepRefs = useRef([]);
  const approachHeadingRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  // Entrance animations for existing sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (essenceSectionRef.current) {
        gsap.fromTo(
          essenceSectionRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: essenceSectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const items = [...cardRefs.current].filter(Boolean);
      if (items.length > 0) {
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (approachHeadingRef.current) {
        gsap.fromTo(
          approachHeadingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: approachHeadingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      approachStepRefs.current.filter(Boolean).forEach((el) => {
        const image = el.querySelector(".approach-image");
        const text = el.querySelector(".approach-text");
        gsap.fromTo(
          [image, text],
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        {/* Hero Video */}
        <section className="relative w-full overflow-hidden h-auto md:h-[85vh] lg:h-[90vh] mt-[70px] md:mt-[80px]">
          <video
            ref={videoRef}
            src="/images/about/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto md:absolute md:inset-0 md:w-full md:h-full md:object-cover"
          />
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M13 3.586L7.414 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3.414L13 20.414V3.586zM16.293 9.293a1 1 0 011.414 1.414L16.414 12l1.293 1.293a1 1 0 01-1.414 1.414L15 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 12l-1.293-1.293a1 1 0 011.414-1.414L15 10.586l1.293-1.293z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M13 3.586L7.414 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3.414L13 20.414V3.586zM16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </section>

        {/* The Essence of Kathart */}
        <section className="py-20 px-4 sm:px-8 text-center">
          <div ref={essenceSectionRef} className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
              The Essence of Kathart
            </h1>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              We are not here just to make things look good. We are here to make
              your brand mean something.
              <br /> We are a creative marketing agency working at the
              intersection of strategy, design, and film. We find the one true
              thing about your brand, and build everything around it. Every
              identity we craft, every film we make, every campaign we run is a
              &lsquo;Katharsis&rsquo; - a quiet but permanent shift in how your
              brand is seen, felt, and remembered. We are not here just to make
              things look good. We are here to make your brand mean something.
              We are a creative marketing agency working at the intersection of
              strategy, design, and film. We find the one true thing about your
              brand, and build everything around it. Every identity we craft,
              every film we make, every campaign we run is a
              &lsquo;Katharsis&rsquo; - a quiet but permanent shift in how your
              brand is seen, felt, and remembered.
            </p>
          </div>
        </section>

        {/* Our Belief */}
        <section className="py-20 px-4 sm:px-8" ref={sectionRef}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
              Our Belief
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {beliefCards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="bg-seccolor-cta-cards-bg gradient-border rounded-3xl p-8 sm:p-10"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={48}
                        height={48}
                        className="object-contain belief-card-icon"
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-base sm:text-lg text-textColor">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        {/* <section ref={approachSectionRef} className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2
              ref={approachHeadingRef}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-20 text-center"
            >
              Our Approach
            </h2>
            <div className="flex flex-col gap-24">
              {approachSteps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    ref={(el) => (approachStepRefs.current[index] = el)}
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                      !isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="approach-image w-full lg:w-1/2 relative h-72 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={step.image}
                        alt={step.oneliner}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="approach-text w-full lg:w-1/2 space-y-5">
                      <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                        0{index + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
                        {step.oneliner}
                      </h3>
                      <p className="text-base sm:text-lg text-textColor leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section> */}

        {/* ══ The Cassiopeia Constellation ══ */}
        <CassiopeiaConstellation />

        <CTA />
      </main>
    </>
  );
}
