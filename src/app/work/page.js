"use client";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import Image from "next/image";
import { BsBriefcase } from "react-icons/bs";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { FiSmile } from "react-icons/fi";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const statsCards = [
  {
    icon: BsBriefcase,
    number: "10",
    label: "Years of experience",
  },
  {
    icon: HiOutlineSquares2X2,
    number: "50+",
    label: "Projects delivered",
  },
  {
    icon: FiSmile,
    number: "99%",
    label: "Client satisfaction",
  },
];

const projects = [
  {
    category: "UX/UI Design",
    title: "Travel Smarter",
    image: "/images/work/travel-smarter.png",
  },
  {
    category: "Frontend Development",
    title: "Singapore, Sentosa Island",
    image: "/images/work/travel-smarter-2.png",
  },
  {
    category: "Full Stack Development",
    title: "Eduway",
    image: "/images/work/eduway.png",
  },
  {
    category: "Brand Identity",
    title: "The Coffee House",
    image: "/images/work/eduway-2.png",
  },
  {
    category: "Mobile App Development",
    title: "Vitality - Well Run",
    image: "/images/work/eduway-3.png",
  },
  {
    category: "E-commerce",
    title: "Loom & Leaf",
    image: "/images/work/eduway-4.png",
  },
];

export default function WorkPage() {
  const heroRef = useRef(null);
  const statsRef = useRef([]);
  const featuredRef = useRef(null);
  const projectsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero heading animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Stats cards animation
      const stats = [...statsRef.current].filter(Boolean);
      if (stats.length > 0) {
        gsap.fromTo(
          stats,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.5,
          }
        );
      }

      // Featured work animation
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Projects grid animation
      const projectItems = [...projectsRef.current].filter(Boolean);
      if (projectItems.length > 0) {
        gsap.fromTo(
          projectItems,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: projectItems[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden">
        {/* Hero Section */}
        <section className="pt-50 pb-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h1
              ref={heroRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-16 uppercase tracking-wide"
            >
              Showcasing Our Best Work
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  ref={(el) => (statsRef.current[index] = el)}
                  className="glass-card rounded-3xl p-8 text-center"
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-base sm:text-lg text-textColor">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
              Featured Work
            </h2>

            <div
              ref={featuredRef}
              className="glass-card rounded-3xl p-8 sm:p-12 overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  <div className="text-sm sm:text-base text-blue-400 font-medium">
                    UX/UI Design & Development
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                    FinEase - UPI Payment App
                  </h3>
                  <p className="text-base sm:text-lg text-textColor leading-relaxed">
                    Designed an intuitive banking app for seamless UPI and fund
                    transfers, improving transaction completion by 40%.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm sm:text-base text-textColor">
                    <span>Modern UI</span>
                    <span className="text-primary">|</span>
                    <span>Dark Mode</span>
                    <span className="text-primary">|</span>
                    <span>User-Centered Flows</span>
                  </div>
                  <div className="pt-4">
                    <Button className="primary-btn" type="button">
                      <div className="btn-content">
                        <div className="btn-arrow">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-base font-normal text-white pr-8">
                          View Case Study
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className="relative w-full h-[400px] lg:h-[500px]">
                  <Image
                    src="/images/work/featured-work.png"
                    alt="FinEase App Mockup"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Notch Work Section */}
        <section className="py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
              Top Notch Work
            </h2>
            <p className="text-base sm:text-lg text-textColor text-center mb-16 max-w-3xl mx-auto">
              At Kathart, we believe every story deserves to be seen, felt, and
              remembered.
            </p>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  ref={(el) => (projectsRef.current[index] = el)}
                  className="glass-card rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="relative">
                    {/* Category Tag */}
                    <div className="absolute top-6 left-6 z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                      <span className="text-sm font-medium text-foreground">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Image */}
                    <div className="relative w-full h-[300px] sm:h-[400px]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Project Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
