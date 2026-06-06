import { getSanityClient, isSanityConfigured } from "./client";
import { projects as staticProjects } from "@/data/projects";

export async function getAllProjects() {
  if (!isSanityConfigured()) return staticProjects;

  try {
    const data = await getSanityClient().fetch(
      `*[_type == "project"] | order(order asc, _createdAt desc) {
        "slug": slug.current,
        category,
        tags,
        title,
        client,
        year,
        services,
        description,
        featured,
        "coverImage": coalesce(coverImage.asset->url, ""),
      }`
    );
    return data?.length ? data : staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug) {
  if (!isSanityConfigured()) {
    return staticProjects.find((p) => p.slug === slug) ?? null;
  }

  try {
    const data = await getSanityClient().fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        "slug": slug.current,
        category,
        tags,
        title,
        client,
        year,
        services,
        description,
        challenge,
        approach,
        outcome,
        "coverImage": coalesce(coverImage.asset->url, ""),
        "gallery": gallery[].asset->url,
        metrics,
        featured,
        "nextSlug": nextProject->slug.current,
      }`,
      { slug }
    );
    return data ?? staticProjects.find((p) => p.slug === slug) ?? null;
  } catch {
    return staticProjects.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProjectSlugs() {
  if (!isSanityConfigured()) {
    return staticProjects.map((p) => ({ slug: p.slug }));
  }

  try {
    const data = await getSanityClient().fetch(
      `*[_type == "project"]{ "slug": slug.current }`
    );
    return data?.length ? data : staticProjects.map((p) => ({ slug: p.slug }));
  } catch {
    return staticProjects.map((p) => ({ slug: p.slug }));
  }
}
