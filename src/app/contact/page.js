"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { MailIcon, PhoneIcon } from "lucide-react";
import gsap from "gsap";
import Button from "@/components/ui/button.jsx";
import { CircleArrowRight } from "lucide-react";

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

export default function ContactPage() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-up animation for content
      const items = [...cardRefs.current].filter(Boolean);

      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      {/* Gradient overlay at top */}
      {/* <div className="absolute inset-x-0 top-0 h-[20%] bg-[linear-gradient(180deg,#482BFF_0%,rgba(81,60,213,0.6)_35%,rgba(81,60,213,0)_100%)]" /> */}
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative contact-hero-gradient">
          {/* Purple Glow Between Title and Content */}
          <div className="relative h-24 sm:h-32 md:h-48 flex items-center justify-center pointer-events-none contact-glow">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#6A53FF]/40 via-[#6A53FF]/20 to-transparent blur-3xl" />
          </div>

          {/* Hero Section */}
          <section className="pt-8 pb-2 sm:pb-8 px-4 sm:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground uppercase leading-tight max-w-3xl mx-auto">
              {`LET'S TALK`}
            </h1>
          </section>
        </div>
        {/* Contact Section - Two Column Layout */}
        <section
          className="pt-8 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-20 md:mb-28 mb-28"
          ref={sectionRef}
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left Column - Contact Cards */}
            <div>
              <div className="max-w-7xl mx-auto py-8">
                <h2 className="font-semibold text-foreground text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[50px] leading-tight">
                  Contact Details
                </h2>
                <p className="text-lg sm:text-md md:text-lg lg:text-lg text-textColor leading-relaxed font-semibold">
                  Reach out directly.
                </p>
              </div>

              <div className="flex flex-col gap-6 sm:gap-8">
                {contactCards.map((card, index) => (
                  <Card
                    key={index}
                    ref={(el) => (cardRefs.current[index] = el)}
                    className="glass-card rounded-2xl sm:rounded-3xl transition-all duration-300"
                  >
                    <CardContent className="flex h-full flex-col gap-3 sm:gap-4 px-5 sm:px-6 md:px-7 py-5 sm:py-6 md:py-7">
                      <card.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-medium text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-textColor">
                          {card.description}
                        </p>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm md:text-base text-primary">
                        <a href={card.link}>{card.contact}</a>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <div className="max-w-7xl py-8 mx-auto">
                <h2 className="font-semibold text-foreground text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[50px] leading-tight">
                  Contact Form
                </h2>
                <p className="text-lg sm:text-md md:text-lg lg:text-lg text-textColor leading-relaxed font-semibold">
                  Ready to be impossible to ignore?
                </p>
              </div>
              <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all"
                      placeholder="Ex: John Williamsons"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all"
                      placeholder="Ex: john@gmail.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2"
                    >
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all"
                      placeholder="Your company or brand name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all resize-none"
                      placeholder="What’s on your mind?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-btn w-full sm:w-auto mt-4"
                  >
                    Submit Inquiry
                    <span className="btn-icon">
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
