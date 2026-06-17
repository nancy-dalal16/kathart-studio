"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
  },
  {
    title: "Intellectual Property Rights",
    content: [
      "All content on our website, including text, graphics, logos, images, and software, is the property of Kathart Studios or licensed to us by third parties.",
      "You may not reproduce, modify, distribute, or transmit any content without our prior written consent.",
      "Your use of our website does not grant you any ownership rights to any intellectual property.",
    ],
  },
  {
    title: "Permitted Use",
    content: [
      "You may use our website for lawful purposes only.",
      "You may not use the website in any way that violates any applicable law or regulation.",
      "You may not engage in any conduct that restricts or inhibits anyone's use of the website.",
      "You may not obtain or attempt to obtain any materials or information through any means not intentionally made available.",
    ],
  },
  {
    title: "User Submissions",
    content:
      "Any information, content, or materials you submit through our website (including contact forms) may be used by Kathart Studios for business purposes. By submitting, you grant us the right to use such information as described in our Privacy Policy.",
  },
  {
    title: "Disclaimers",
    content: [
      "Our website is provided on an 'as-is' and 'as-available' basis.",
      "We make no warranties, express or implied, regarding the website or services.",
      "We do not guarantee that the website will be uninterrupted, secure, or error-free.",
      "We disclaim all warranties, including implied warranties of merchantability and fitness for a particular purpose.",
    ],
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall Kathart Studios, its owners, employees, or agents be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use our website or services.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party sites is at your own risk and subject to their terms of use.",
  },
  {
    title: "Indemnification",
    content:
      "You agree to indemnify and hold harmless Kathart Studios, its owners, employees, and agents from any claims, damages, or expenses arising out of your use of the website or violation of these terms.",
  },
  {
    title: "Service Fees and Payment",
    content:
      "Any pricing and service terms are subject to change without notice. Invoices are due upon receipt unless otherwise agreed in writing. Late payments may result in suspension of services.",
  },
  {
    title: "Confidentiality",
    content:
      "Both parties agree to maintain the confidentiality of any proprietary information shared during our business relationship. This obligation survives the termination of our business relationship.",
  },
  {
    title: "Modification of Terms",
    content:
      "We reserve the right to modify these terms at any time. Your continued use of the website following the posting of revised terms means you accept and agree to the changes.",
  },
  {
    title: "Governing Law",
    content:
      "These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in India.",
  },
  {
    title: "Contact Information",
    content:
      "If you have questions about these Terms of Use, please contact us at legal@kathart.com or call +91 8938261901.",
  },
];

export default function TermsOfUseClient() {
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
      <div className="relative terms-hero-gradient">
        {/* Purple Glow Between Title and Content */}
        <div className="relative h-24 sm:h-32 md:h-48 flex items-center justify-center pointer-events-none terms-glow">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#6A53FF]/40 via-[#6A53FF]/20 to-transparent blur-3xl" />
        </div>

        {/* Hero Section */}
        <section className="pt-8 pb-2 sm:pb-8 px-4 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground uppercase leading-tight max-w-3xl mx-auto">
            Terms of Use
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
              By using our website and services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Use. If
              you have any questions, please contact us.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
