"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { Separator } from "./ui/seperator";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: FacebookIcon, alt: "Facebook" },
  { icon: InstagramIcon, alt: "Instagram" },
  { icon: LinkedinIcon, alt: "Linkedin" },
];

const companyLinks = [
  { label: "About" },
  { label: "Leadership" },
  { label: "Contact Us" },
  { label: "Career" },
];

const legalLinks = [
  { label: "Customer Support" },
  { label: "Terms & Conditions" },
  { label: "Privacy Policy" },
];

const capabilityLinks = [
  { label: "Capability one" },
  { label: "Second capability" },
  { label: "Service number three" },
];

const footerColumns = [
  { title: "Company", links: companyLinks },
  { title: "Legal", links: legalLinks },
  { title: "Capabilities", links: capabilityLinks },
];

export function Footer() {
  const animRef = useRef(null);

  useEffect(() => {
    gsap.from(animRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: animRef.current,
        start: "top 85%",
        // toggleActions: "play none none none",
        pin: false, // IMPORTANT: prevents double scrollbars
      },
    });
  }, []);

  return (
    <footer className="flex flex-col items-center justify-center gap-6 md:gap-8 lg:gap-10 pt-0 pb-6 md:pb-8 lg:pb-10 px-4 md:px-10 lg:px-20 w-full footer-bg">
      {/* ONLY THIS WRAPS ANIMATED CONTENT */}
      <div ref={animRef} className="w-full">
        <div className="flex flex-col items-start gap-16 md:gap-20 lg:gap-[120px] w-full">
          <div className="flex flex-col lg:flex-row items-start justify-around gap-10 md:gap-16 lg:gap-[163px] w-full">
            <div className="flex flex-col lg:flex-row items-start gap-10 md:gap-16 lg:gap-[100px] flex-1 w-full">
              {/* About section */}
              <div className="w-full lg:w-[418px] gap-4 md:gap-6 flex flex-col items-start">
                <div className="flex flex-col items-start gap-2 md:gap-[9px] w-full">
                  <h2 className="mt-[-1px] font-semibold text-foreground text-xl md:text-2xl leading-[32px] md:leading-[38.4px]">
                    About Kathart
                  </h2>

                  <p className="font-normal text-textColor text-sm md:text-base leading-5 md:leading-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam dictum aliquet accumsan porta lectus ridiculus in
                    mattis. Netus sodales in volutpat ullamcorper amet
                    adipiscing fermentum.
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-9 flex-1 w-full">
                {footerColumns.map((column, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start gap-3 md:gap-[15px]"
                  >
                    <h3 className="mt-[-1px] font-semibold text-foreground text-xl md:text-2xl leading-[32px] md:leading-[38.4px]">
                      {column.title}
                    </h3>

                    <nav className="flex flex-col items-start gap-2 md:gap-3">
                      {column.links.map((link, lidx) => (
                        <a
                          key={lidx}
                          href="#"
                          className={`${
                            lidx === 0 ? "mt-[-1px]" : ""
                          } font-normal text-textColor text-sm md:text-base leading-5 md:leading-6 hover:text-primary transition-colors`}
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="w-full h-px bg-border" />
        </div>

        <p className="w-full text-center font-normal text-foreground/70 text-sm md:text-base leading-5 md:leading-6 mt-6">
          © Copyright 2025, All Rights Reserved by Kathart Studios Pvt Ltd.
        </p>
      </div>
      {/* END ANIM WRAPPER */}
    </footer>
  );
}
