"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA } from "@/components/CTA";
import PageBuilder from "@/components/PageBuilder";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetailClient({ project, nextProjects = [] }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const coverRef = useRef(null);
  const pageBuilderRef = useRef(null);
  const nextRef = useRef(null);

  const hasModules = Boolean(project.pageBuilder?.length);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Hero text entrance
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(".h-anim"),
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.1,
          },
        );
      }

      // Cover — clip reveal
      if (coverRef.current) {
        gsap.fromTo(
          coverRef.current,
          { clipPath: "inset(8% 0% 0% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.4,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: coverRef.current,
              start: "top 92%",
              once: true,
            },
          },
        );
      }

      // Module canvas — animate each section/figure on scroll
      if (pageBuilderRef.current) {
        pageBuilderRef.current
          .querySelectorAll("section, figure")
          .forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });
      }

      // Next projects
      if (nextRef.current) {
        gsap.fromTo(
          nextRef.current.querySelectorAll(".next-card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: nextRef.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [project.slug, hasModules]);

  return (
    <main ref={pageRef} className="min-h-screen">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 pt-36 sm:pt-40 pb-8 sm:pb-10"
      >
        <Link
          href="/work"
          className="h-anim inline-flex items-center gap-2 text-textColor hover:text-foreground text-sm transition-colors duration-200 group mb-10 sm:mb-12"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          All Projects
        </Link>{" "}
        <br />
        {project.category && (
          <p className="h-anim inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-5">
            {project.category}
          </p>
        )}
        <h1 className="h-anim text-[clamp(2.5rem,7vw,5.5rem)] font-semibold text-foreground leading-[1.0] tracking-tight max-w-4xl mb-6">
          {project.title}
        </h1>
        {project.description && (
          <p className="h-anim text-textColor text-base sm:text-lg leading-relaxed max-w-2xl">
            {project.description}
          </p>
        )}
        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="h-anim flex flex-wrap gap-2 mt-7">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-textColor border border-border rounded-full px-3 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── COVER ── */}
      <div
        ref={coverRef}
        className="w-full mt-4 overflow-hidden"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div
          className="relative w-full"
          style={{ minHeight: "62vh", aspectRatio: "16/9" }}
        >
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1A1733 0%, #2D1A4A 40%, #0F0F1A 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 50%, rgba(184,139,255,0.6) 0%, transparent 60%), radial-gradient(circle at 75% 40%, rgba(81,60,213,0.5) 0%, transparent 55%)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── MODULE CANVAS ── */}
      {hasModules ? (
        <div ref={pageBuilderRef} className="pt-8 sm:pt-12">
          <PageBuilder blocks={project.pageBuilder} />
        </div>
      ) : (
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-24 text-center">
          <p className="text-textColor text-sm">
            This project has no content modules yet.
          </p>
        </section>
      )}

      {/* ── NEXT PROJECTS ── */}
      {nextProjects.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-20 pb-24 border-t border-border">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-8 sm:mb-10">
            More Projects
          </p>

          <div
            ref={nextRef}
            className={`grid gap-4 sm:gap-5 ${
              nextProjects.length >= 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 max-w-lg"
            }`}
          >
            {nextProjects.map((np) => (
              <Link
                key={np.slug}
                href={`/work/${np.slug}`}
                className="next-card relative rounded-2xl lg:rounded-3xl overflow-hidden group block"
                style={{ minHeight: "280px" }}
              >
                {np.coverImage ? (
                  <Image
                    src={np.coverImage}
                    alt={np.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <ArrowUpRight size={14} className="text-white" />
                </div>

                <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6">
                  <p className="text-white/50 text-[10px] tracking-[0.18em] uppercase mb-1.5">
                    {np.category}
                  </p>
                  <h3 className="text-white text-xl sm:text-2xl font-semibold leading-tight">
                    {np.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CTA />
    </main>
  );
}
