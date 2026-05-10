"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Badge from "./ui/badge";
import Button from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CircleArrowRight, ArrowUpRightIcon } from "lucide-react";

const slides = [
  {
    title: "FinEase – UPI Payment App",
    badge: "Mobile App",
    image: "/images/fin-ease.png",
    description:
      "Designed an intuitive banking app for seamless UPI and fund transfers, improving transaction completion by 40%.",
    highlights: "Modern UI | Dark Mode | User-Centered Flows",
    impact: [
      "85% faster payments",
      "0 data errors",
      "2.5X customer satisfaction score",
    ],
  },
  {
    title: "NeoBank – Finance Dashboard",
    badge: "FinTech SaaS",
    image: "/images/fin-ease.png",
    description:
      "Built a modern dashboard for fintech startups to manage money flow, transactions, and analytics.",
    highlights: "Analytics | Reports | Secure Architecture",
    impact: ["60% workflow improvement", "100% uptime", "3X engagement"],
  },
  {
    title: "FoodKart – Delivery App",
    badge: "Mobile App",
    image: "/images/fin-ease.png",
    description:
      "A visually rich food delivery experience with smoother cart & checkout interaction.",
    highlights: "Dark Mode | UI Revamp | Faster Checkout",
    impact: ["50% faster ordering", "Zero cart drop-offs", "2X retention"],
  },
];

export default function OurWork() {
  const [active, setActive] = useState(0);

  const slideRef = useRef(null);
  const imageRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef([]);

  const startX = useRef(0);
  const currentX = useRef(0);

  // -------------------------------
  // 3D IMAGE TILT
  // -------------------------------
  const handleMouseMove = (e) => {
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(img, {
      rotateY: x / 25,
      rotateX: -y / 25,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const resetTilt = () => {
    gsap.to(imageRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  // -------------------------------
  // SLIDE TRANSITION + ANIMATIONS
  // -------------------------------
  const goToSlide = (i) => {
    const tl = gsap.timeline();

    // IMAGE PARALLAX REVEAL
    tl.fromTo(
      imageRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );

    // TEXT STAGGER ANIMATION
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
      "-=0.5",
    );

    setActive(i);
  };

  // -------------------------------
  // CARD FLOATING FOREVER
  // -------------------------------
  useEffect(() => {
    gsap.to(cardRef.current, {
      y: -15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  // -------------------------------
  // AUTOPLAY
  // -------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((active + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);

  // -------------------------------
  // SWIPE HANDLERS
  // -------------------------------
  const handleStart = (e) => {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    currentX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = () => {
    const diff = currentX.current - startX.current;

    if (diff > 60) goToSlide((active - 1 + slides.length) % slides.length);
    else if (diff < -60) goToSlide((active + 1) % slides.length);
  };

  return (
    <section
      className="w-full px-6 sm:px-10 lg:px-20 pt-20 pb-10 flex flex-col gap-20"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* HEADER */}
      <header className="flex justify-between items-center flex-col lg:flex-row gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold">
            Our Work
          </h1>
          <p className="text-lg sm:text-xl">
            {`   Stories we've shaped, identities we've built, and brands we've
            helped grow.`}
          </p>
        </div>

        <div className="flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                active === i ? "bg-primary w-12" : "bg-foreground w-4"
              }`}
            />
          ))}
        </div>
      </header>

      {/* SLIDE */}
      <div
        ref={slideRef}
        className="flex flex-col lg:flex-row gap-10 items-center"
      >
        {/* IMAGE SIDE WITH FLOATING + 3D TILT */}
        <Card
          ref={cardRef}
          className="w-full lg:w-1/2 rounded-[40px] overflow-hidden relative"
        >
          <CardContent className="p-0">
            <Image
              ref={imageRef}
              src={slides[active].image}
              alt={slides[active].title}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
            />
          </CardContent>
        </Card>

        {/* CONTENT SIDE WITH STAGGER */}
        <article className="w-full lg:w-1/2 flex flex-col gap-6 items-start">
          <Badge
            ref={(el) => (textRef.current[0] = el)}
            variant="outline"
            className="border-[#3e3966]"
          >
            {slides[active].badge}
          </Badge>

          <h2
            ref={(el) => (textRef.current[1] = el)}
            className="text-3xl sm:text-4xl font-semibold"
          >
            {slides[active].title}
          </h2>

          <p
            ref={(el) => (textRef.current[2] = el)}
            className="text-lg sm:text-xl"
          >
            {slides[active].description}
          </p>

          <div ref={(el) => (textRef.current[3] = el)}>
            <h3 className="text-xl">Highlights</h3>
            <p className="text-textColor text-lg">
              {slides[active].highlights}
            </p>
          </div>

          <div>
            <h3 ref={(el) => (textRef.current[4] = el)} className="text-xl">
              Impact
            </h3>
            <div className="flex flex-col gap-2">
              {slides[active].impact.map((metric, i) => (
                <div
                  key={i}
                  ref={(el) => (textRef.current[5 + i] = el)}
                  className="flex gap-2 items-center"
                >
                  <Image
                    src="/images/check-mark-green.svg"
                    width={20}
                    height={20}
                    alt="check"
                  />
                  <span className="text-textColor text-lg">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            ref={(el) => (textRef.current[10] = el)}
            className="btn-border-gradient"
          >
            View Case Study
            <ArrowUpRightIcon className="w-6 h-6 ml-2" />
          </Button>
        </article>
      </div>

      {/* FOOTER */}
      <Card className="px-4 py-4 rounded-2xl bg-secondary border-0">
        <CardContent className="flex justify-between items-center flex-col sm:flex-row gap-6">
          <p className="text-xl sm:text-2xl">
            {`  We've got more cool stuff waiting for you — go explore!`}
          </p>

          <Button className="primary-btn">
            <span className="text-base font-medium text-white">
              View All Projects
            </span>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
