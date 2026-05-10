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
      const items = [
      
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
        {/* Dark gradient background */}
     

        {/* Hero Section */}
        <section className="pt-50 pb-16 px-4 sm:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground uppercase leading-20 max-w-3xl mx-auto">
            START YOUR STORY WITH US
          </h1>
        </section>

        {/* Contact Section - Two Column Layout */}
        <section className="py-12 px-4 sm:px-8 lg:px-20"  ref={sectionRef}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column - Contact Cards */}
           
              <div className="flex flex-col gap-8">
                      {contactCards.map((card, index) => (
                        <div
                          key={index}
                          ref={(el) => (cardRefs.current[index] = el)}
                          className=""
                        >
                          <div className="rounded-4xl overflow-hidden">
                            <Card 
                              className="glass-card transition-all duration-300"
                            >
                              <CardContent className="flex h-full flex-col gap-4 px-6 py-6 sm:px-7 sm:py-7">
                                <card.icon className="h-7 w-7 text-foreground" />
            
                                <div className="space-y-1">
                                  <h3 className="text-base sm:text-lg font-medium text-foreground">
                                    {card.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-foreground">
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

            {/* Right Column - Contact Form */}
            <div className="glass-card rounded-4xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-foreground text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-gray-500 focus:outline-none focus:border-[#B88BFF] transition-colors"
                    placeholder="Ex: John Williamsons"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-foreground text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-gray-500 focus:outline-none focus:border-[#B88BFF] transition-colors"
                    placeholder="Ex: john@gmail.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-foreground text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-gray-500 focus:outline-none focus:border-[#B88BFF] transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-foreground text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-gray-500 focus:outline-none focus:border-[#B88BFF] transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

               <Button className="primary-btn" type="submit">
                <div className="btn-content">
                  <div className="btn-arrow">
                    <CircleArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-base font-normal text-white pr-8">
                    Submit Inquiry
                  </span>
                </div>
              </Button>
              </form>
            </div>



          </div>
        </section>

        {/* Extra spacing before footer */}
        <div className="h-20" />
      </main>
      <Footer />
    </>
  );
}
