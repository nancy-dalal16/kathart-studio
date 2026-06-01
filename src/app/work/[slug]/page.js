import { getProjectBySlug, getProjectSlugs, getAllProjects } from "@/sanity/queries";
import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";

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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.slug === slug);

  // Resolve 2 next projects in the chain
  const next1 = all[(idx + 1) % all.length] ?? null;
  const next2 = all[(idx + 2) % all.length] ?? null;
  const nextProjects = [next1, next2].filter(Boolean);

  return <ProjectDetailClient project={project} nextProjects={nextProjects} />;
}
