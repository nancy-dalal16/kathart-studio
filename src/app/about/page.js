"use client";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/button.jsx";
import { CircleArrowRight } from "lucide-react";
import Image from "next/image";
import { CTA } from "@/components/CTA";

gsap.registerPlugin(ScrollTrigger);

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
  const heroLogoRef = useRef(null);
  const essenceSectionRef = useRef(null);
  const approachSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Logo Animation - Fade in and scale
      if (heroLogoRef.current) {
        gsap.fromTo(
          heroLogoRef.current,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }

      // Essence Section Animation - Fade up
      if (essenceSectionRef.current) {
        const essenceElements = essenceSectionRef.current.children;
        gsap.fromTo(
          essenceElements,
          {
            y: 60,
            opacity: 0,
          },
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
          }
        );
      }

      // Our Belief Cards Animation
      const items = [...cardRefs.current].filter(Boolean);
      
      if (items.length > 0) {
        // Set initial state to visible
        gsap.set(items, { opacity: 1, y: 0 });

        // Fade-up animation for content
        gsap.fromTo(items, 
          {
            y: 40,
            opacity: 0,
          },
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
          }
        );
      }

      // Our Approach Section Animation
      if (approachSectionRef.current) {
        const approachElements = approachSectionRef.current.querySelectorAll('.approach-animate');
        gsap.fromTo(
          approachElements,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.3,
            scrollTrigger: {
              trigger: approachSectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden">
        {/* Full-Height Hero Section with Background */}
        <section className="relative h-screen w-full flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-background.png"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay for better logo visibility */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Centered Logo */}
          <div ref={heroLogoRef} className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <Image
              src="/images/Kathart-Logo-transparent.png"
              alt="Kathart Studios"
              fill
              className="object-contain"
              priority
            />
          </div>
        </section>

        {/* The Essence of Kathart Section */}
        <section className="py-20 px-4 sm:px-8 text-center">
          <div ref={essenceSectionRef} className="max-w-4xl mx-auto">
            {/* Lotus Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 M50 30 Q40 40 40 50 Q40 60 50 70 Q60 60 60 50 Q60 40 50 30"
                    fill="none"
                    stroke="url(#lotus-gradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    {/* <linearGradient id="lotus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#B88BFF" />
                      <stop offset="100%" stopColor="#E382FF" />
                    </linearGradient> */}
                  </defs>
                </svg>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
              The Essence of Kathart
            </h1>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              We are not an agency of posts and pixels. We are keepers of foundational narratives—where strategy meets soul, and creativity awakens what was always meant to be. From the quill&apos;s first stroke of creativity to the awakening of a lotus in full bloom, every story we craft is a quiet catharsis that endures.
            </p>
          </div>
        </section>

        {/* Our Belief Section */}
        <section className="py-20 px-4 sm:px-8" ref={sectionRef}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
              Our Belief
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {beliefCards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="glass-card rounded-3xl p-8 sm:p-10"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={48}
                        height={48}
                        className="object-contain"
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

        {/* Our Approach Section */}
        <section ref={approachSectionRef} className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-16 text-center approach-animate">
              Our Approach
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Image */}
              <div className="relative w-full h-[400px] lg:h-[500px] approach-animate">
                <Image
                  src="/images/Kathart-Logo-transparent.png"
                  alt="Lotus with feather"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Right Column - Text */}
              <div className="space-y-6 approach-animate">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  We release what lasts.
                </h3>
                <p className="text-lg sm:text-xl text-foreground leading-relaxed">
                  The katha leaves our hands quietly. Just a story set free to find its people. Ten years from now it still feels true, still pulls the right founders in, still quietly prospers. That&apos;s the catharsis we chase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
    
        {/* Extra spacing before footer */}
         <CTA />
      </main>
    
      <Footer />
    </>
  );
}
