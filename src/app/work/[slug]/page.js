import { getProjectBySlug, getProjectSlugs, getAllProjects } from "@/sanity/queries";
import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Kathart Studios`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();

  const project = await getProjectBySlug(slug, isDraft);
  if (!project) notFound();

  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.slug === slug);

  // Collect up to 2 distinct next projects, deduped by slug
  const others = all.filter((p) => p.slug !== slug);
  const next1 = others[(idx) % Math.max(others.length, 1)] ?? null;
  const next2 = others.length > 1 ? others[(idx + 1) % others.length] ?? null : null;
  const seen = new Set();
  const nextProjects = [next1, next2].filter((p) => {
    if (!p || seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return (
    <ProjectDetailClient project={project} nextProjects={nextProjects} />
  );
}
