"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { Separator } from "./ui/seperator";

const FOOTER_STARS = [
  { top: 50, left: 4, s: 1.5, d: 0.0, dur: 3.2, o: 0.45 },
  { top: 58, left: 11, s: 2.0, d: 1.3, dur: 2.7, o: 0.6 },
  { top: 72, left: 7, s: 1.0, d: 0.6, dur: 4.1, o: 0.35 },
  { top: 85, left: 14, s: 1.5, d: 2.1, dur: 3.5, o: 0.5 },
  { top: 93, left: 2, s: 1.0, d: 0.9, dur: 2.9, o: 0.4 },
  { top: 55, left: 22, s: 1.0, d: 1.7, dur: 3.8, o: 0.3 },
  { top: 66, left: 28, s: 2.0, d: 0.3, dur: 2.5, o: 0.65 },
  { top: 80, left: 19, s: 1.5, d: 2.8, dur: 4.3, o: 0.45 },
  { top: 90, left: 25, s: 1.0, d: 1.1, dur: 3.1, o: 0.55 },
  { top: 97, left: 33, s: 2.5, d: 0.5, dur: 2.6, o: 0.7 },
  { top: 52, left: 38, s: 1.5, d: 3.2, dur: 3.9, o: 0.35 },
  { top: 63, left: 44, s: 1.0, d: 1.9, dur: 4.0, o: 0.4 },
  { top: 75, left: 41, s: 2.0, d: 0.8, dur: 2.8, o: 0.6 },
  { top: 88, left: 48, s: 1.5, d: 2.4, dur: 3.3, o: 0.5 },
  { top: 95, left: 55, s: 1.0, d: 1.0, dur: 4.5, o: 0.35 },
  { top: 57, left: 60, s: 2.0, d: 0.4, dur: 3.0, o: 0.65 },
  { top: 70, left: 53, s: 1.5, d: 2.7, dur: 2.7, o: 0.45 },
  { top: 82, left: 62, s: 1.0, d: 1.5, dur: 3.6, o: 0.4 },
  { top: 91, left: 68, s: 2.5, d: 3.5, dur: 3.2, o: 0.7 },
  { top: 98, left: 58, s: 1.0, d: 0.2, dur: 4.2, o: 0.3 },
  { top: 54, left: 74, s: 1.5, d: 1.8, dur: 2.9, o: 0.5 },
  { top: 65, left: 79, s: 2.0, d: 0.7, dur: 3.7, o: 0.6 },
  { top: 77, left: 72, s: 1.0, d: 2.3, dur: 4.4, o: 0.35 },
  { top: 86, left: 83, s: 1.5, d: 1.2, dur: 3.1, o: 0.55 },
  { top: 94, left: 77, s: 1.0, d: 3.0, dur: 2.6, o: 0.4 },
  { top: 59, left: 88, s: 2.0, d: 0.1, dur: 3.4, o: 0.65 },
  { top: 71, left: 93, s: 1.5, d: 2.0, dur: 4.0, o: 0.45 },
  { top: 84, left: 89, s: 1.0, d: 1.6, dur: 3.8, o: 0.35 },
  { top: 92, left: 96, s: 2.5, d: 2.9, dur: 2.8, o: 0.75 },
  { top: 97, left: 91, s: 1.0, d: 0.4, dur: 3.5, o: 0.45 },
  { top: 60, left: 35, s: 1.5, d: 3.8, dur: 4.1, o: 0.3 },
  { top: 79, left: 16, s: 1.0, d: 1.4, dur: 3.0, o: 0.5 },
  { top: 87, left: 47, s: 2.0, d: 2.6, dur: 2.7, o: 0.6 },
  { top: 96, left: 65, s: 1.5, d: 0.9, dur: 4.3, o: 0.4 },
  { top: 73, left: 86, s: 1.0, d: 1.7, dur: 3.2, o: 0.35 },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const socialLinks = [
  { icon: FacebookIcon, alt: "Facebook" },
  { icon: InstagramIcon, alt: "Instagram" },
  { icon: LinkedinIcon, alt: "Linkedin" },
];

const companyLinks = [
  { label: "Our Work", href: "/work" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

const footerColumns = [
  { title: "Explore", links: companyLinks },
  { title: "Legal", links: legalLinks },
];

export function Footer() {
  const animRef = useRef(null);

  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // immediateRender:false keeps the footer visible at full opacity until the
      // ScrollTrigger fires — prevents it staying blank if Lenis hasn't settled yet.
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 pt-0 pb-4 md:pb-6 lg:pb-10 px-4 sm:px-8 md:px-12 lg:px-20 w-full footer-bg">
      {/* Dark-theme-only glowing stars in the purple gradient zone */}
      <div className="footer-stars-layer" aria-hidden="true">
        {FOOTER_STARS.map((star, i) => (
          <span
            key={i}
            className="footer-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.s}px`,
              height: `${star.s}px`,
              "--so": star.o,
              animationDelay: `${star.d}s`,
              animationDuration: `${star.dur}s`,
            }}
          />
        ))}
      </div>
      {/* ONLY THIS WRAPS ANIMATED CONTENT */}
      <div ref={animRef} className="w-full">
        <div className="flex flex-col items-start gap-8 md:gap-12 lg:gap-16 xl:gap-20 w-full">
          <div className="flex flex-col lg:flex-row items-start justify-start lg:justify-around gap-6 md:gap-10 lg:gap-14 xl:gap-[163px] w-full">
            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-10 lg:gap-14 xl:gap-[100px] flex-1 w-full">
              {/* About section */}
              <div className="w-full lg:w-[418px] gap-3 md:gap-4 lg:gap-6 flex flex-col items-start">
                <div className="flex flex-col items-start gap-2 md:gap-3 w-full">
                  <h2 className="mt-[-1px] font-semibold text-foreground text-lg md:text-xl lg:text-2xl leading-tight">
                    Kathart Studios
                  </h2>

                  <p className="font-normal text-textColor text-xs sm:text-sm md:text-base leading-5 md:leading-6">
                    Elevated. Integrated. Intentional.
                  </p>
                </div>

                <div className="inline-flex items-start gap-4 md:gap-6">
                  {socialLinks.map((social, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 md:gap-6"
                    >
                      <button
                        aria-label={social.alt}
                        className="w-5 h-5 md:w-6 md:h-6 text-foreground hover:text-primary transition-colors"
                      >
                        <social.icon className="w-5 h-5 md:w-6 md:h-6 hover:scale-125 hover:text-primary" />
                      </button>

                      {index < socialLinks.length - 1 && (
                        <Separator
                          orientation="vertical"
                          className="h-5 md:h-6 w-px bg-border"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1 w-full">
                {footerColumns.map((column, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start gap-2 md:gap-3 lg:gap-4"
                  >
                    <h3 className="mt-[-1px] font-semibold text-foreground text-base md:text-lg lg:text-xl leading-tight">
                      {column.title}
                    </h3>

                    <nav className="flex flex-col items-start gap-1.5 md:gap-2">
                      {column.links.map((link, lidx) => (
                        <Link
                          key={lidx}
                          href={link.href}
                          className={`${
                            lidx === 0 ? "mt-[-1px]" : ""
                          } font-normal text-textColor text-xs sm:text-sm md:text-base leading-5 hover:text-primary transition-colors`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="w-full h-px bg-border" />
        </div>

        <p className="w-full text-center font-normal text-foreground/70 text-xs sm:text-sm md:text-base leading-5 md:leading-6 mt-6 md:mt-8">
          © Copyright 2026, All Rights Reserved by Kathart Studios Pvt Ltd.
        </p>
      </div>
      {/* END ANIM WRAPPER */}
    </footer>
  );
}
