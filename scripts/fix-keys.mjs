/**
 * Patches all project documents:
 *  - tags: reverts back to plain strings (was wrongly converted to objects)
 *  - metrics: adds _key to each object item (required by Sanity)
 *  - gallery: adds _key to each image item (required by Sanity)
 *
 * Run: node --env-file=.env.local scripts/fix-keys.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9zw49757",
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    || "production",
  apiVersion: "2024-06-01",
  token:      process.env.SANITY_API_TOKEN,
  useCdn:     false,
});

const key = () => Math.random().toString(36).slice(2, 10);

async function fixKeys() {
  const projects = await client.fetch(
    `*[_type == "project"]{ _id, tags, metrics, gallery }`
  );

  console.log(`\n🔧  Fixing ${projects.length} project(s)...\n`);

  for (const p of projects) {
    // Tags — must be plain strings, not wrapped objects
    const fixedTags = (p.tags ?? []).map((t) => {
      if (typeof t === "string") return t;
      // Undo previous wrong fix: extract value from { value: "..." } or { _type: "string", ... }
      return t.value ?? t._type ?? String(t);
    });

    // Metrics — objects that need _key
    const fixedMetrics = (p.metrics ?? []).map((m) =>
      m._key ? m : { ...m, _key: key() }
    );

    // Gallery — image objects that need _key
    const fixedGallery = (p.gallery ?? []).map((g) =>
      g._key ? g : { ...g, _key: key() }
    );

    await client
      .patch(p._id)
      .set({ tags: fixedTags, metrics: fixedMetrics, gallery: fixedGallery })
      .commit();

    console.log(`  ✓ ${p._id}`);
  }

  console.log("\n✅  Done. Refresh /studio to confirm.\n");
}

fixKeys().catch((err) => {
  console.error("\n❌  Failed:", err.message);
  process.exit(1);
});
