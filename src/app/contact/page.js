"use client";
import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, ArrowRight, MapPin } from "lucide-react";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
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
  // {
  //   icon: MapPinIcon,
  //   title: "Visit us",
  //   description: "Kathart Studio",
  //   contact: "Pune, Maharashtra, India",
  //   link: "#",
  // },
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

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const recaptchaRef = useRef(null);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", message: "" });
      setFieldErrors({});
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
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
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Contact Form - Full Width */}
            <div>
              <div className="max-w-7xl py-8 mx-auto text-center">
                <h2 className="font-semibold text-foreground text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[50px] leading-tight">
                  Ready to be impossible to ignore?
                </h2>
                {/* <p className="text-lg sm:text-md md:text-lg lg:text-lg text-textColor leading-relaxed font-semibold">
                  Ready to be impossible to ignore?
                </p> */}
              </div>
              <div className="bg-seccolor-cta-cards-bg gradient-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                      <span className="text-3xl text-green-500">✓</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                      Thank You!
                    </h3>
                    <p className="text-textColor text-base sm:text-lg mb-6">
                      Your message has been sent successfully. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", company: "", message: "" });
                      }}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-500 font-medium">✗ {error}</p>
                      </div>
                    )}
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5 sm:space-y-6"
                    >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2 [font-family:var(--font-geologica)]"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border text-foreground placeholder-textColor/50 [font-family:var(--font-questrial)] focus:outline-none focus:bg-foreground/8 transition-all ${
                        fieldErrors.name
                          ? "border-red-500/60 focus:border-red-500/80"
                          : "border-[#B88BFF]/20 focus:border-[#B88BFF]/60"
                      }`}
                      placeholder="Ex: John Williamsons"
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2 [font-family:var(--font-geologica)]"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border text-foreground placeholder-textColor/50 [font-family:var(--font-questrial)] focus:outline-none focus:bg-foreground/8 transition-all ${
                        fieldErrors.email
                          ? "border-red-500/60 focus:border-red-500/80"
                          : "border-[#B88BFF]/20 focus:border-[#B88BFF]/60"
                      }`}
                      placeholder="Ex: john@gmail.com"
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2 [font-family:var(--font-geologica)]"
                    >
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 [font-family:var(--font-questrial)] focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all"
                      placeholder="Your company or brand name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-foreground text-xs sm:text-sm font-medium mb-2 [font-family:var(--font-geologica)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground/5 border border-[#B88BFF]/20 text-foreground placeholder-textColor/50 [font-family:var(--font-questrial)] focus:outline-none focus:border-[#B88BFF]/60 focus:bg-foreground/8 transition-all resize-none"
                      placeholder="What’s on your mind?"
                    />
                  </div>

                      <div className="flex justify-start my-6">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                          theme="dark"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn w-full sm:w-auto mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending..." : "Submit Inquiry"}
                        <span className="btn-icon">
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </span>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Details - Full Row */}
            <div>
              <div className="max-w-7xl mx-auto py-8 text-center">
                <h2 className="font-semibold text-foreground text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[50px] leading-tight">
                  Or reach out directly
                </h2>
                {/* <p className="text-lg sm:text-md md:text-lg lg:text-lg text-textColor leading-relaxed font-semibold">
                  Or reach out directly.
                </p> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {contactCards.map((card, index) => (
                  <Card
                    key={index}
                    ref={(el) => (cardRefs.current[index] = el)}
                    className="bg-seccolor-cta-cards-bg gradient-border"
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
                        {card.link !== "#" ? (
                          <a href={card.link}>{card.contact}</a>
                        ) : (
                          card.contact
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
