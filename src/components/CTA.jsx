"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { MailIcon, PhoneIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactCards = [
  {
    icon: MailIcon,
    title: "Chat to Sales",
    description: "Contact our sales team",
    contact: "sales@kathart.com",
    link: "mailto:sales@kathart.com",
  },
  {
    icon: PhoneIcon,
    title: "Call us",
    description: "Get instant help",
    contact: "+91 8938261901",
    link: "tel:+918938261901",
  },
];

export function CTA() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = [
        headingRef.current,
        textRef.current,
        ...cardRefs.current,
      ].filter(Boolean);

      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-24 lg:py-32 "
    >
      {/* Right glow like screenshot */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] max-w-[480px] bg-[radial-gradient(circle_at_top,#4F37FF_0%,rgba(79,55,255,0)_60%)] opacity-60 blur-3xl overflow-hidden" />

      <div className="relative z-10 flex w-full flex-col gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-12">
        {/* Left: Text + Button */}
        <div className="flex flex-1 flex-col items-start gap-5 md:gap-6 text-left">
          <div className="space-y-2 md:space-y-3">
            <h2
              ref={headingRef}
              className="font-semibold text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] leading-tight"
            >
              Ready to be impossible to ignore?
            </h2>
            <p
              ref={textRef}
              className="max-w-xl text-xs sm:text-sm md:text-base lg:text-lg text-textColor leading-relaxed"
            >
              Every great brand begins with a story worth telling. Let&apos;s
              craft yours.
            </p>
          </div>

          <Link href="/contact" className="primary-btn">
            Let&apos;s Talk
            <span className="btn-icon">
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </Link>
        </div>

        {/* Right: Cards */}
        <div className="flex flex-1 flex-col gap-3 md:gap-4 lg:flex-row w-full">
          {contactCards.map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="flex-1"
            >
              <Card className="bg-secondary gradient-border">
                <CardContent className="flex h-full flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
                  <card.icon className="h-6 w-6 sm:h-7 sm:w-7 text-foreground" />

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-xs text-textColor">
                      {card.description}
                    </p>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm md:text-base text-primary">
                    <a href={card.link}>{card.contact}</a>
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
