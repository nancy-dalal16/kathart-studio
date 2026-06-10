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

// Categories are derived from the projects present, so any new Creative Field
// added in the Studio automatically becomes a filter tab.
function buildCategories(projects) {
  const seen = [];
  for (const p of projects) {
    if (p.category && !seen.includes(p.category)) seen.push(p.category);
  }
  return ["All", ...seen];
}

// Distribute N cards into 3 columns (round-robin) and assign tall/short heights
// so all columns end at the same total height when N is divisible by 3,
// and differ by at most one card height otherwise.
function buildMasonryColumns(items) {
  const cols = [[], [], []];
  items.forEach((project, i) => {
    cols[i % 3].push(project);
  });

  // Track how many items each column got for height balancing
  const colCounts = cols.map((c) => c.length);
  const maxCount = Math.max(...colCounts);

  // Within each column, alternate tall/short.
  // Longer columns (extra item) start with SHORT to stay close in total height
  // to the shorter columns that start with TALL.
  return cols.map((col, ci) => {
    const startTall = col.length < maxCount; // shorter col → start tall
    return col.map((project, j) => ({
      project,
      tall: startTall ? j % 2 === 0 : j % 2 === 1,
    }));
  });
}

export default function WorkPageClient({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const wrapRef = useRef(null);
  const heroRef = useRef(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const categories = buildCategories(projects);
  const masonryColumns = buildMasonryColumns(filtered);

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
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Re-animate cards when filter changes
  useEffect(() => {
    if (!wrapRef.current) return;
    const cards = wrapRef.current.querySelectorAll(".gallery-item");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
    );
  }, [activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="px-4 sm:px-8 md:px-12 lg:px-20 pt-36 sm:pt-40 pb-16 sm:pb-20"
      >
        <div className="h-anim text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-primary">
            Our Work
          </span>
        </div>

        <div className="flex justify-center mt-4">
          <h1 className="h-anim text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-semibold leading-[1.0] tracking-tight text-center">
            Crafted&nbsp;With
            <br />
            <span className="text-primary">Purpose.</span>
          </h1>
        </div>

        {/* Stats row */}
        <div className="h-anim flex flex-wrap justify-center gap-8 sm:gap-14 mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-border">
          {[
            { v: "10+", l: "Years" },
            { v: "50+", l: "Projects Delivered" },
            { v: "99%", l: "Client Satisfaction" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-foreground">
                {v}
              </div>
              <div className="text-textColor text-xs sm:text-sm mt-0.5">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER ── */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white"
                  : "border-border text-textColor hover:border-primary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 pb-28" ref={wrapRef}>
        {filtered.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-textColor text-lg">
              No projects in this category yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: 3 explicit flex columns — guarantees consistent endings */}
            <div className="hidden lg:flex gap-4 items-start">
              {masonryColumns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-4 flex-1 min-w-0">
                  {col.map(({ project, tall }) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      tall={tall}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile / tablet: 2-col simple grid */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  tall={false}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <CTA />
    </main>
  );
}

/* ── Individual project card ── */
function ProjectCard({ project, tall }) {
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`gallery-item ${tall ? "h-[560px]" : "h-[280px]"}`}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative overflow-hidden rounded-2xl border border-border bg-secondary block h-full"
      >
        {/* Image */}
        <Image
          src={project.coverImage || "/images/work/travel-smarter.png"}
          alt={project.title}
          fill
          className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-25"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">
            {project.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
            {project.title}
          </h3>

          {/* Hover-reveal details */}
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="overflow-hidden space-y-3">
              <p className="text-white/75 text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] border border-white/30 text-white/60 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-white mt-1">
                <span className="border-b border-white/50">View Project</span>
                <ArrowUpRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
