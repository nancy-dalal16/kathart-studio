"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MailIcon, PhoneIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-up animation for content
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
        },
      });

      // 3D movable / tilt effect for cards (on hover)
      const listeners = [];

      return () => {
        listeners.forEach(({ card, handleMouseMove, handleMouseLeave }) => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-16 md:py-20 lg:py-24 "
    >
      {/* Right glow like screenshot */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] max-w-[480px] bg-[radial-gradient(circle_at_top,#4F37FF_0%,rgba(79,55,255,0)_60%)] opacity-60 blur-3xl overflow-hidden" />

      <div className="relative z-10 flex w-full flex-col gap-10 lg:flex-row lg:items-center">
        {/* Left: Text + Button */}
        <div className="flex flex-1 flex-col items-start gap-6 text-left">
          <div className="space-y-3">
            <h2
              ref={headingRef}
              className="font-semibold text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight"
            >
              Ready to be impossible to ignore?
            </h2>
            <p
              ref={textRef}
              className="max-w-xl text-sm sm:text-base md:text-lg text-textColor leading-relaxed"
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
        <div className="flex flex-1 flex-col gap-4 sm:flex-row lg:flex-row">
          {contactCards.map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="flex-1"
            >
              <div className="">
                <Card className="bg-secondary gradient-border">
                  <CardContent className="flex h-full flex-col gap-4 px-6 py-6 sm:px-7 sm:py-7">
                    <card.icon className="h-7 w-7 text-foreground" />

                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-medium text-foreground">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-textColor">
                        {card.description}
                      </p>
                    </div>

                    <p className="mt-2 text-sm sm:text-base text-primary">
                      <a href={card.link}>{card.contact}</a>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
