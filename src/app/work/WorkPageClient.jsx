"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA } from "@/components/CTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ["All", "Design", "Films", "Marketing"];

export default function WorkPageClient({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const wrapRef = useRef(null);
  const heroRef = useRef(null);
  const filterRef = useRef(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // Hero entrance
  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".h-anim"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.2,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Re-animate rows when filter changes
  useEffect(() => {
    if (!wrapRef.current) return;
    const rows = wrapRef.current.querySelectorAll(".project-row");
    if (!rows.length) return;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }
    );
  }, [activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="px-4 sm:px-8 md:px-12 lg:px-20 pt-36 sm:pt-40 pb-16 sm:pb-20">
        <div className="h-anim">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-dark-purple">
            Portfolio
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-4">
          <h1 className="h-anim text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-semibold leading-[1.0] tracking-tight max-w-2xl">
            Crafted&nbsp;With
            <br />
            <span className="text-primary">Purpose.</span>
          </h1>

          {/* Counter card */}
          <div className="h-anim flex-shrink-0 self-start lg:self-end">
            <div className="glass-card rounded-2xl px-6 py-5 text-center min-w-[120px]">
              <span className="block text-4xl sm:text-5xl font-semibold text-foreground leading-none">
                {String(projects.length).padStart(2, "0")}
              </span>
              <span className="block text-textColor text-xs mt-1 tracking-wider uppercase">
                Projects
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="h-anim flex flex-wrap gap-8 sm:gap-14 mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-border">
          {[
            { v: "10+", l: "Years" },
            { v: "50+", l: "Projects Delivered" },
            { v: "99%", l: "Client Satisfaction" },
          ].map(({ v, l }) => (
            <div key={l}>
              <div className="text-2xl sm:text-3xl font-semibold text-foreground">{v}</div>
              <div className="text-textColor text-xs sm:text-sm mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER ── */}
      <section
        ref={filterRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 pb-6"
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-dark-purple border-dark-purple text-white"
                  : "border-border text-textColor hover:border-primary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECTS — Editorial alternating rows ── */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 pb-28" ref={wrapRef}>
        {/* Top separator */}
        <div className="w-full h-px bg-border mb-0" />

        {filtered.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} />
        ))}

        {filtered.length === 0 && (
          <div className="py-28 text-center">
            <p className="text-textColor text-lg">
              No projects in this category yet.
            </p>
          </div>
        )}
      </section>

      <CTA />
    </main>
  );
}

/* ── Individual project row ── */
function ProjectRow({ project, index }) {
  const rowRef = useRef(null);
  const imgRef = useRef(null);
  const isEven = index % 2 === 0;

  useLayoutEffect(() => {
    if (!rowRef.current) return;
    const ctx = gsap.context(() => {
      // Content reveal
      const textEls = rowRef.current.querySelectorAll(".row-anim");
      gsap.fromTo(
        textEls,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );

      // Image clip-path reveal
      gsap.fromTo(
        imgRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, rowRef);
    return () => ctx.revert();
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <>
      <Link href={`/work/${project.slug}`} className="block group">
        <article
          ref={rowRef}
          className={`flex flex-col lg:flex-row gap-0 py-10 sm:py-12 lg:py-14 items-stretch ${
            isEven ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* Image block */}
          <div
            ref={imgRef}
            className="relative w-full lg:w-[58%] aspect-[16/10] lg:aspect-auto lg:min-h-[380px] rounded-2xl lg:rounded-3xl overflow-hidden flex-shrink-0"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Image
              src={project.coverImage || "/images/work/travel-smarter.png"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content block */}
          <div
            className={`flex flex-col justify-center w-full lg:w-[42%] ${
              isEven
                ? "lg:pl-10 xl:pl-14 pt-6 lg:pt-0"
                : "lg:pr-10 xl:pr-14 pt-6 lg:pt-0"
            }`}
          >
            {/* Number + category */}
            <div className="row-anim flex items-baseline gap-4 mb-5">
              <span
                className="text-[64px] sm:text-[80px] font-semibold leading-none"
                style={{ color: "var(--color-border)" }}
              >
                {num}
              </span>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-dark-purple">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="row-anim text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-4">
              {project.title}
            </h2>

            {/* Description */}
            <p className="row-anim text-textColor text-sm sm:text-base leading-relaxed mb-6 max-w-sm">
              {project.description}
            </p>

            {/* Tags */}
            <div className="row-anim flex flex-wrap gap-2 mb-8">
              {(project.tags ?? []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] sm:text-xs border border-border text-textColor px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="row-anim inline-flex items-center gap-2 text-sm font-medium text-foreground group/cta self-start">
              <span className="border-b border-textColor group-hover/cta:border-foreground transition-colors duration-200">
                View Project
              </span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </div>
          </div>
        </article>
      </Link>

      {/* Separator */}
      <div className="w-full h-px bg-border" />
    </>
  );
}
