"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { CTA } from "@/components/CTA";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Strategy",
    tagline: "Where everything begins.",
    description:
      "Most brand problems are not creative problems. They are clarity problems. Before we design anything or shoot a single frame, we establish what your brand truly stands for, what it stands against, and what it delivers. This is the work that makes everything else cohesive.",
    tags: [
      "Naming",
      "Logo Design",
      "Visual Language & Brand Guidelines",
      "Brand Architecture",
    ],
  },
  {
    number: "02",
    title: "Brand Identity",
    tagline: "The system that speaks before you do.",
    description:
      "A brand identity is not just a logo. It is a complete set of signals — visual, verbal, sensorial. They communicate who you are before you say a word. We build those systems to be distinct, consistent, and flexible enough to get stronger as your business grows.",
    tags: [
      "Naming",
      "Logo Design",
      "Visual Language & Brand Guidelines",
      "Brand Architecture",
    ],
  },
  {
    number: "03",
    title: "Film & Content",
    tagline: "The work that gets you noticed.",
    description:
      "People don't remember what they read, what they saw, what they heard. They remember what they felt. Film is the most powerful brand tool available. Every film we make is a deliberate brand statement, built to move people and built to last.",
    tags: [
      "Ad Film & Brand Video",
      "Corporate & Institutional Video",
      "2D Animated Explainer Video",
      "Social Media Reels & Content",
      "Script & Direction",
    ],
  },
  {
    number: "04",
    title: "Digital Presence",
    tagline: "Where your brand lives 24 hours a day.",
    description:
      "For most prospects, your website is their first real encounter with your brand. It needs to do what a great salesperson does — build trust, communicate value, and make the next step obvious. We design and build digital experiences that are as considered as the brand behind them.",
    tags: ["Website Design & Development", "UI/UX Design", "Landing Pages"],
  },
  {
    number: "05",
    title: "Brand Marketing",
    tagline: "The right message. The right people. The right time.",
    description:
      "Visibility means nothing if the wrong people are seeing the wrong message. We build and execute marketing strategies that give your brand's reach meaning — without compromising what makes it worth noticing in the first place.",
    tags: [
      "Social Media Strategy & Management",
      "Content Marketing",
      "Campaign Planning & Execution",
      "Performance Marketing",
      "Personal Branding",
    ],
  },
];

function AccordionItem({ service, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    if (isOpen) {
      gsap.set(content, { height: "auto", opacity: 1 });
      const height = inner.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-t border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-7 sm:py-8 text-left group"
        aria-expanded={isOpen}
      >
        {/* Left: number + title */}
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="text-primary text-xs font-semibold tracking-widest flex-shrink-0">
            {service.number}
          </span>
          <span
            className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight transition-colors duration-300 ${
              isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
            }`}
          >
            {service.title}
          </span>
        </div>

        {/* Right: icon */}
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-textColor group-hover:border-primary group-hover:text-primary"
          }`}
        >
          {isOpen ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
        </span>
      </button>

      {/* Collapsible content */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div ref={innerRef} className="pb-10 flex flex-col md:flex-row md:gap-16 lg:gap-24">
          {/* Tagline */}
          <p className="md:w-[42%] flex-shrink-0 text-sm italic text-textColor mb-6 md:mb-0 md:pt-1">
            {service.tagline}
          </p>

          {/* Description + list */}
          <div className="md:w-[58%] space-y-6">
            <p className="text-sm sm:text-base text-textColor leading-relaxed">
              {service.description}
            </p>
            <ul className="space-y-2">
              {service.tags.map((tag) => (
                <li key={tag} className="flex items-start gap-3 text-sm text-textColor">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CapabilitiesPage() {
  const heroRef = useRef(null);
  const serviceRefs = useRef([]);
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = useCallback(
    (index) => setOpenIndex((prev) => (prev === index ? null : index)),
    []
  );

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

      serviceRefs.current.filter(Boolean).forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".svc-animate"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <div className="relative contact-hero-gradient">
        <div className="relative h-24 sm:h-32 md:h-48 flex items-center justify-center pointer-events-none contact-glow">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#6A53FF]/40 via-[#6A53FF]/20 to-transparent blur-3xl" />
        </div>

        <section className="pt-8 pb-12 sm:pb-16 px-4 sm:px-8 text-center">
          <div ref={heroRef} className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground uppercase leading-tight">
              Everything your brand needs.{" "}
              <em className="not-italic italic">Under one roof.</em>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-textColor max-w-2xl mx-auto leading-relaxed">
              From the first strategy session to the final film frame — we cover
              every dimension of your brand, so nothing gets lost in translation.
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

      {/* Services — detailed layout */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.number}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="border-t border-border py-12 sm:py-16 md:py-20 flex flex-col md:flex-row md:gap-16 lg:gap-24"
            >
              {/* Left */}
              <div className="md:w-[42%] flex-shrink-0 mb-8 md:mb-0">
                <span className="svc-animate block text-primary text-xs font-semibold tracking-widest mb-4 md:mb-6">
                  {service.number}
                </span>
                <h2 className="svc-animate text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.05] mb-3 md:mb-4">
                  {service.title}
                </h2>
                <p className="svc-animate text-sm sm:text-base text-textColor italic">
                  {service.tagline}
                </p>
              </div>

              {/* Right */}
              <div className="md:w-[58%] flex flex-col justify-between gap-8">
                <p className="svc-animate text-sm sm:text-base md:text-lg text-textColor leading-relaxed">
                  {service.description}
                </p>
                <div className="svc-animate flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-textColor"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Services — accordion */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-12">
            Quick Look
          </h2>
          {services.map((service, index) => (
            <AccordionItem
              key={service.number}
              service={service}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      <CTA />
    </main>
  );
}
