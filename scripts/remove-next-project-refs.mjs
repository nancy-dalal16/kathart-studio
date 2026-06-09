/**
 * One-shot migration: remove the legacy `nextProject` reference field from
 * all project documents in Sanity. Run once, then delete this file.
 *
 *   bun run --env-file=.env.local scripts/remove-next-project-refs.mjs
 * or
 *   node --env-file=.env.local scripts/remove-next-project-refs.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-06-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const affected = await client.fetch(
  `*[_type == "project" && defined(nextProject)]{ _id, title }`
);

if (!affected.length) {
  console.log("No documents have nextProject set — nothing to do.");
  process.exit(0);
}

console.log(`Clearing nextProject from ${affected.length} document(s)…`);

for (const doc of affected) {
  await client.patch(doc._id).unset(["nextProject"]).commit();
  console.log(`  ✓  ${doc.title ?? doc._id}`);
}

console.log("Done. All nextProject references removed.");
