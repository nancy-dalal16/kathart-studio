"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Introduction",
    content:
      "At Kathart Studios, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
  },
  {
    title: "Information We Collect",
    content: [
      "Personal Information: When you contact us through forms, email, or phone, we collect information such as your name, email address, phone number, company name, and any messages you provide.",
      "Website Usage Information: We collect information about how you interact with our website, including IP addresses, browser type, pages visited, and time spent on pages.",
      "Cookies and Tracking Technologies: We use cookies and similar technologies to enhance your browsing experience and analyze website traffic.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To respond to your inquiries and provide services you request",
      "To improve our website and services",
      "To send promotional materials and updates (with your consent)",
      "To comply with legal obligations",
      "To protect our rights and prevent fraud",
      "To analyze website performance and user behavior",
    ],
  },
  {
    title: "Data Sharing",
    content:
      "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "Your Rights",
    content: [
      "Access: You may request access to the personal information we hold about you",
      "Correction: You may request correction of inaccurate or incomplete information",
      "Deletion: You may request deletion of your personal information",
      "Opt-out: You may opt out of marketing communications at any time",
    ],
  },
  {
    title: "Cookies Policy",
    content:
      "We use cookies to improve your experience on our website. You can control cookies through your browser settings. Disabling cookies may affect the functionality of our website.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.",
  },
  {
    title: "Contact Us",
    content:
      "If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@kathart.com or call +91 8938261901.",
  },
  {
    title: "Policy Updates",
    content:
      "We may update this Privacy Policy periodically. We will notify you of significant changes via email or by posting the updated policy on our website.",
  },
];

export default function PrivacyPolicyClient() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.filter(Boolean).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
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
      <div className="relative privacy-hero-gradient">
        {/* Purple Glow Between Title and Content */}
        <div className="relative h-24 sm:h-32 md:h-48 flex items-center justify-center pointer-events-none privacy-glow">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#6A53FF]/40 via-[#6A53FF]/20 to-transparent blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="pt-8 pb-2 sm:pb-8 px-4 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground uppercase leading-tight max-w-3xl mx-auto">
            Privacy Policy
          </h1>
        </section>
      </div>

      <section className="pt-8 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          {sections.map((section, index) => (
            <div
              key={index}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-3 sm:space-y-4 list-disc list-inside">
                  {section.content.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-base sm:text-lg text-textColor leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base sm:text-lg text-textColor leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>
          ))}

          <div className="mt-20 pt-12 border-t border-foreground/10">
            <p className="text-sm sm:text-base text-textColor/80">
              If you have any questions about this Privacy Policy, please don't
              hesitate to contact us. We're here to help and ensure your privacy
              is protected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
