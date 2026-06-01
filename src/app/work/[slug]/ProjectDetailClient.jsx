"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA } from "@/components/CTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetailClient({ project, nextProjects = [] }) {
  const heroRef    = useRef(null);
  const coverRef   = useRef(null);
  const infoRef    = useRef(null);
  const editRef    = useRef(null);
  const galleryRef = useRef(null);
  const outcomeRef = useRef(null);
  const metricsRef = useRef(null);
  const nextRef    = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(".h-anim"),
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
        );
      }

      // Cover image reveal — scale up from slightly zoomed
      if (coverRef.current) {
        gsap.fromTo(
          coverRef.current,
          { opacity: 0, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: coverRef.current, start: "top 90%", once: true },
          }
        );
      }

      // Info cols
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.querySelectorAll(".info-col"),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: "power3.out",
            scrollTrigger: { trigger: infoRef.current, start: "top 88%", once: true },
          }
        );
      }

      // Editorial
      if (editRef.current) {
        gsap.fromTo(
          editRef.current.querySelectorAll(".ed-anim"),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: editRef.current, start: "top 82%", once: true },
          }
        );
      }

      // Gallery
      if (galleryRef.current) {
        galleryRef.current.querySelectorAll(".gallery-item").forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power4.inOut",
              delay: i * 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });
      }

      // Outcome + metrics
      if (outcomeRef.current) {
        gsap.fromTo(
          outcomeRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: outcomeRef.current, start: "top 86%", once: true },
          }
        );
      }
      if (metricsRef.current) {
        gsap.fromTo(
          metricsRef.current.querySelectorAll(".metric-card"),
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: metricsRef.current, start: "top 88%", once: true },
          }
        );
      }

      // Next projects
      if (nextRef.current) {
        gsap.fromTo(
          nextRef.current.querySelectorAll(".next-card"),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: nextRef.current, start: "top 88%", once: true },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [project.slug]);

  return (
    <main className="min-h-screen">

      {/* ── HERO — no image background, clear of transparent header ── */}
      <section
        ref={heroRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 pt-36 sm:pt-40 pb-10 sm:pb-12"
      >
        {/* Back link */}
        <Link
          href="/work"
          className="h-anim inline-flex items-center gap-2 text-textColor hover:text-foreground text-sm transition-colors duration-200 group mb-8 sm:mb-10 block"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          All Projects
        </Link>

        <div className="max-w-4xl">
          <p className="h-anim text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-4">
            {project.category}&nbsp;·&nbsp;{project.year}
          </p>
          <h1 className="h-anim text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold text-foreground leading-[1.03] mb-5">
            {project.title}
          </h1>
          <p className="h-anim text-textColor text-base sm:text-lg leading-relaxed max-w-xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* ── COVER IMAGE — full-bleed, edge-to-edge ── */}
      <div
        ref={coverRef}
        className="w-full mt-2 sm:mt-4 overflow-hidden"
      >
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
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
            /* Gradient placeholder when no image is uploaded yet */
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
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/20 text-sm tracking-[0.3em] uppercase">
                  Cover image
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <section
        ref={infoRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 border-b border-border"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
          {[
            { label: "Client",       value: project.client },
            { label: "Services",     value: project.services },
            { label: "Year",         value: project.year },
            { label: "Disciplines",  value: (project.tags ?? []).join(" · ") },
          ].map(({ label, value }) => (
            <div key={label} className="info-col">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-textColor mb-1.5">
                {label}
              </p>
              <p className="text-foreground text-sm sm:text-base font-medium leading-snug">
                {value || "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHALLENGE + APPROACH ── */}
      <section
        ref={editRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28"
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          <div>
            <div className="ed-anim flex items-baseline gap-4 mb-6">
              <span className="text-6xl sm:text-7xl font-semibold leading-none" style={{ color: "var(--color-border)" }}>
                01
              </span>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-dark-purple">
                The Challenge
              </p>
            </div>
            <h2 className="ed-anim text-2xl sm:text-3xl font-semibold leading-snug mb-5">
              What we were<br />asked to solve.
            </h2>
            <p className="ed-anim text-textColor text-sm sm:text-base leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div>
            <div className="ed-anim flex items-baseline gap-4 mb-6">
              <span className="text-6xl sm:text-7xl font-semibold leading-none" style={{ color: "var(--color-border)" }}>
                02
              </span>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-dark-purple">
                Our Approach
              </p>
            </div>
            <h2 className="ed-anim text-2xl sm:text-3xl font-semibold leading-snug mb-5">
              How we crafted<br />the solution.
            </h2>
            <p className="ed-anim text-textColor text-sm sm:text-base leading-relaxed">
              {project.approach}
            </p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      {project.gallery?.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 pb-16 sm:pb-20">
          <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className={`gallery-item relative rounded-2xl lg:rounded-3xl overflow-hidden ${
                  i === 0 ? "md:col-span-8 aspect-[16/9]" : "md:col-span-4 aspect-[4/3]"
                }`}
                style={{ clipPath: "inset(0% 0% 0% 0%)" }}
              >
                <Image
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OUTCOME + METRICS ── */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28 border-t border-border">
        <div className="mb-12 sm:mb-16" ref={outcomeRef}>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple block mb-4">
            The Outcome
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-snug max-w-3xl">
            {project.outcome}
          </p>
        </div>

        {project.metrics?.length > 0 && (
          <div ref={metricsRef} className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="metric-card glass-card rounded-2xl p-5 sm:p-7 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-1.5">
                  {metric.value}
                </div>
                <div className="text-textColor text-[10px] sm:text-xs leading-snug">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── NEXT PROJECTS (2 cards) ── */}
      {nextProjects.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 pb-20 border-t border-border pt-12 sm:pt-16">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-6 sm:mb-8">
            More Projects
          </p>

          <div ref={nextRef} className={`grid gap-4 sm:gap-5 ${nextProjects.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-lg"}`}>
            {nextProjects.map((np) => (
              <Link
                key={np.slug}
                href={`/work/${np.slug}`}
                className="next-card relative rounded-2xl lg:rounded-3xl overflow-hidden group min-h-[220px] sm:min-h-[280px]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Arrow icon */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <ArrowUpRight size={13} className="text-white" />
                </div>

                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5">
                  <p className="text-white/50 text-[10px] tracking-widest uppercase mb-1">
                    {np.category}&nbsp;·&nbsp;{np.year}
                  </p>
                  <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
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
