"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/CTA";
import ServicesShowcase from "@/components/ServicesShowcase";

gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Hero */}
      <div className="relative contact-hero-gradient overflow-hidden">
        <div className="relative h-24 sm:h-32 md:h-48 flex items-center justify-center pointer-events-none contact-glow">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#6A53FF]/40 via-[#6A53FF]/20 to-transparent blur-3xl" />
        </div>

        <section className="pt-8 md:pt-0 pb-12 sm:pb-16 px-4 sm:px-8 text-center">
          <div ref={heroRef} className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground uppercase leading-tight">
              Everything your brand needs. <br />
              <em className="not-italic italic">Under one roof.</em>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-textColor max-w-2xl mx-auto leading-relaxed">
              From the first strategy session to the final film frame — we cover
              every dimension of your brand, so nothing gets lost in
              translation.
            </p>
            <div className="pt-2">
              <Link href="/contact" className="primary-btn inline-flex">
                Start a Project
                <span className="btn-icon">
                  <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Services — scroll-driven showcase */}
      <ServicesShowcase />

      <CTA />
    </main>
  );
}
