import { getSanityClient, getPreviewClient, isSanityConfigured } from "./client";
import { projects as staticProjects } from "@/data/projects";

export async function getRecentProjects(limit = 3, preview = false) {
  if (!isSanityConfigured()) return staticProjects.slice(0, limit);

  const client = preview ? getPreviewClient() : getSanityClient();
  if (!client) return staticProjects.slice(0, limit);

  try {
    const data = await client.fetch(
      `*[_type == "project"] | order(_createdAt desc) [0...$limit] {
        "slug": slug.current,
        category,
        tags,
        title,
        description,
        "coverImage": coalesce(coverImage.asset->url, ""),
      }`,
      { limit }
    );
    return data?.length ? data : staticProjects.slice(0, limit);
  } catch {
    return staticProjects.slice(0, limit);
  }
}

export async function getAllProjects(preview = false) {
  if (!isSanityConfigured()) return staticProjects;

  const client = preview ? getPreviewClient() : getSanityClient();
  if (!client) return staticProjects;

  try {
    const data = await client.fetch(
      `*[_type == "project"] | order(_createdAt desc) {
        "slug": slug.current,
        category,
        tags,
        title,
        description,
        "coverImage": coalesce(coverImage.asset->url, ""),
      }`
    );
    // Deduplicate by slug — defensive guard in case the API ever returns both a
    // published doc and its draft counterpart (e.g. during perspective fallback).
    const seen = new Set();
    const unique = (data || []).filter((p) => {
      if (!p.slug || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
    return unique.length ? unique : staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug, preview = false) {
  if (!isSanityConfigured()) {
    return staticProjects.find((p) => p.slug === slug) ?? null;
  }

  const client = preview ? getPreviewClient() : getSanityClient();
  if (!client) return staticProjects.find((p) => p.slug === slug) ?? null;

  try {
    const data = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        "slug": slug.current,
        category,
        tags,
        title,
        description,
        "coverImage": coalesce(coverImage.asset->url, ""),
        "pageBuilder": pageBuilder[] {
          _type,
          _key,
          headline,
          tagline,
          layout,
          "image": image.asset->url,
          "imageAspect": image.asset->metadata.dimensions.aspectRatio,
          "imageWidth": image.asset->metadata.dimensions.width,
          "imageHeight": image.asset->metadata.dimensions.height,
          fullBleed,
          eyebrow,
          heading,
          body,
          caption,
          aspectRatio,
          "leftImage": left.asset->url,
          "rightImage": right.asset->url,
          ratio,
          "images": images[] { "url": image.asset->url, caption },
          columns,
          "metrics": metrics[] { value, label, _key },
          quote,
          attribution,
          url,
          bgColor,
          source,
          "videoFileUrl": videoFile.asset->url,
          autoplay,
          "gifUrl": gif.asset->url,
          width,
          alignment,
          size,
          style,
        },
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
    // Deduplicate slugs for the same reason as getAllProjects
    const seen = new Set();
    const unique = (data || []).filter((p) => {
      if (!p.slug || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
    return unique.length ? unique : staticProjects.map((p) => ({ slug: p.slug }));
  } catch {
    return staticProjects.map((p) => ({ slug: p.slug }));
  }
}
