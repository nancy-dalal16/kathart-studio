/**
 * Seed script — creates all 7 projects in Sanity (no images).
 * Add images manually via /studio after running this.
 *
 * Run: node --env-file=.env.local scripts/seed-projects.mjs
 */

import { createClient } from "@sanity/client";

const key = () => Math.random().toString(36).slice(2, 10);

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9zw49757";
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || "production";
const TOKEN      = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error(
    "\n❌  SANITY_API_TOKEN is not set.\n" +
    "   Go to https://sanity.io/manage → API → Tokens → create an Editor token\n" +
    "   then add SANITY_API_TOKEN=... to .env.local\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  apiVersion: "2024-06-01",
  token:      TOKEN,
  useCdn:     false,
});

const PROJECTS = [
  {
    slug:     "customised-energy-solutions",
    title:    "Customised Energy Solutions",
    category: "Design",
    tags:     ["Web Design", "Development"],
    client:   "Customized Energy Solutions",
    year:     "2020",
    services: "Website Design & Development",
    description:
      "MICRO — a web-based platform to establish and facilitate microgrids energy generation and distribution in India.",
    challenge:
      "Making complex microgrid infrastructure concepts accessible to investors and everyday consumers, while maintaining technical credibility for serious industry partners.",
    approach:
      "We used character-driven storytelling on a classy, professional landing page — turning technical complexity into a compelling narrative that resonates with a broad audience.",
    outcome:
      "A platform that bridges technical complexity with compelling narrative, establishing MICRO as a credible voice in India's energy sector.",
    metrics: [
      { value: "< 2s",   label: "Page Load Time" },
      { value: "98/100", label: "Mobile Score" },
      { value: "+45%",   label: "Conversion Rate" },
    ],
    featured: true,
    order: 1,
  },
  {
    slug:     "zlade",
    title:    "Zlade",
    category: "Design",
    tags:     ["E-Commerce", "Web Design", "Development"],
    client:   "Zlade",
    year:     "2020",
    services: "E-Commerce Website Design & Development",
    description:
      "A premium e-commerce platform for Zlade — a German-engineered personal grooming brand from Pune.",
    challenge:
      "Zlade needed an online store that communicated their premium positioning and enabled direct-to-consumer sales in a saturated personal care market.",
    approach:
      "We built iteratively — a 'coming soon' page, then a launch site with retailer links, and finally a full e-commerce platform with direct purchase capability.",
    outcome:
      "A sleek, conversion-optimized storefront that elevated Zlade's digital presence and enabled independent online revenue.",
    metrics: [
      { value: "-30%",  label: "Bounce Rate" },
      { value: "+60%",  label: "Add-to-Cart Rate" },
      { value: "+2.4×", label: "Revenue Growth" },
    ],
    featured: true,
    order: 2,
  },
  {
    slug:     "soppa",
    title:    "Soppa",
    category: "Design",
    tags:     ["UI/UX Design", "Web Development", "Motion"],
    client:   "Prasanna Travels Pvt. Ltd.",
    year:     "2020",
    services: "UI/UX Design · Web Development · Explainer Video",
    description:
      "Soppa is an intelligent logistics platform with an AI-powered routing engine that recommends optimal shipping solutions.",
    challenge:
      "SOPPA needed a cohesive brand presence across video, web, and product — making a technically complex logistics platform feel intuitive to both enterprise and everyday users.",
    approach:
      "We delivered a full creative stack: a minimalist website with generous whitespace and a restrained two-color palette, an explainer video, and a unified UI/UX design system.",
    outcome:
      "A unified brand and product experience that made SOPPA approachable across all touchpoints, driving strong demo uptake at launch.",
    metrics: [
      { value: "+80%",    label: "Demo Requests" },
      { value: "+3.5min", label: "Avg. Session Time" },
      { value: "4.8/5",  label: "User Score" },
    ],
    featured: true,
    order: 3,
  },
  {
    slug:     "workout-cash",
    title:    "Workout Cash",
    category: "Films",
    tags:     ["Film Production", "Motion Design"],
    client:   "Hoofit (Workout.cash)",
    year:     "2020",
    services: "Film Production",
    description:
      "A 60-second advertisement film for Workout Cash — a fitness gamification platform that rewards physical activity.",
    challenge:
      "Communicating the concept of fitness gamification quickly and memorably, in a way that resonates with fitness enthusiasts without feeling gimmicky.",
    approach:
      "We built the film around metaphor and humor — placing the audience in their natural environment and using relatable situations to make the value proposition land instantly.",
    outcome:
      "A shareable, high-energy film that drove strong awareness and app installs at platform launch.",
    metrics: [
      { value: "100K+", label: "Video Views" },
      { value: "12%",   label: "Share Rate" },
      { value: "+35%",  label: "App Installs" },
    ],
    featured: false,
    order: 4,
  },
  {
    slug:     "arya-ayurveda",
    title:    "Arya Ayurveda",
    category: "Marketing",
    tags:     ["Web Design", "E-Commerce", "Digital Marketing"],
    client:   "Arya Ayurveda",
    year:     "2020",
    services: "Web Design & Online Sales Enablement",
    description:
      "Website design and online sale enablement for an established Ayurvedic pharmacy.",
    challenge:
      "Bringing a trusted offline pharmacy online without losing the warmth and credibility customers associate with traditional Ayurveda.",
    approach:
      "We designed a nature-inspired digital experience with a smooth e-commerce flow — making online shopping feel as approachable as walking into the pharmacy itself.",
    outcome:
      "A digital storefront that expanded their customer reach beyond the local region and enabled consistent, growing online revenue.",
    metrics: [
      { value: "+120%", label: "Online Orders" },
      { value: "+50%",  label: "New Customers" },
      { value: "68%",   label: "Return Rate" },
    ],
    featured: false,
    order: 5,
  },
  {
    slug:     "sunfeast",
    title:    "SunFeast — The Parking",
    category: "Films",
    tags:     ["Film Production", "Brand Story"],
    client:   "SunFeast",
    year:     "2020",
    services: "Short Film Production",
    description:
      '"The Parking" — a short film for SunFeast\'s nationwide "Live your moment" competition. Concept to post-production in four days. Finished 2nd in India.',
    challenge:
      "Crafting a compelling short film that connected emotionally with a broad national audience under an extremely tight four-day production timeline.",
    approach:
      "We built the story around city life's everyday hustle — a protagonist discovers a small, joyful moment, perfectly aligned with the brand's 'Live your moment' theme.",
    outcome:
      "Finished second out of thousands of entries nationwide, earning critical recognition and building brand affinity with younger audiences.",
    metrics: [
      { value: "2nd",    label: "National Rank" },
      { value: "4 days", label: "Production Time" },
      { value: "96%",    label: "Audience Score" },
    ],
    featured: false,
    order: 6,
  },
  {
    slug:     "indorse",
    title:    "Indorse",
    category: "Films",
    tags:     ["Film Production", "Brand Video"],
    client:   "Indorse",
    year:     "2020",
    services: "Introductory Video Production",
    description:
      "Introductory video production for Indorse — establishing the brand's voice and vision through film.",
    challenge:
      "Distilling a complex tech product into a clear, engaging introductory video that communicates value at a glance.",
    approach:
      "We focused on clarity and energy — using a crisp visual language to introduce the brand with confidence and intrigue.",
    outcome:
      "A polished introductory film that gave Indorse a strong first impression across digital channels.",
    metrics: [
      { value: "60s",   label: "Run Time" },
      { value: "100%",  label: "On Brief" },
      { value: "4.9/5", label: "Client Score" },
    ],
    featured: false,
    order: 7,
  },
];

async function seed() {
  console.log(`\n🌱  Seeding Sanity "${PROJECT_ID}" / "${DATASET}"\n`);

  const existing    = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`);
  const existingSet = new Set(existing.map((p) => p.slug));

  for (const p of PROJECTS) {
    if (existingSet.has(p.slug)) {
      console.log(`⏭  Skipping "${p.title}" — already exists`);
      continue;
    }

    console.log(`📦  Creating "${p.title}"...`);

    const doc = {
      _type:       "project",
      title:       p.title,
      slug:        { _type: "slug", current: p.slug },
      category:    p.category,
      tags:        p.tags,
      client:      p.client,
      year:        p.year,
      services:    p.services,
      description: p.description,
      challenge:   p.challenge,
      approach:    p.approach,
      outcome:     p.outcome,
      metrics:     p.metrics.map((m) => ({ ...m, _key: key() })),
      featured:    p.featured,
      order:       p.order,
    };

    const created = await client.create(doc);
    console.log(`  ✓ ${created._id}`);
  }

  // Wire nextProject references
  const allDocs  = await client.fetch(`*[_type == "project"]{ _id, "slug": slug.current }`);
  const idBySlug = Object.fromEntries(allDocs.map((d) => [d.slug, d._id]));

  const chain = [
    ["customised-energy-solutions", "zlade"],
    ["zlade",                        "soppa"],
    ["soppa",                        "workout-cash"],
    ["workout-cash",                 "arya-ayurveda"],
    ["arya-ayurveda",                "sunfeast"],
    ["sunfeast",                     "indorse"],
    ["indorse",                      "customised-energy-solutions"],
  ];

  console.log("\n🔗  Wiring nextProject references...");
  for (const [slug, nextSlug] of chain) {
    const docId  = idBySlug[slug];
    const nextId = idBySlug[nextSlug];
    if (!docId || !nextId) continue;
    await client.patch(docId).set({ nextProject: { _type: "reference", _ref: nextId } }).commit();
    console.log(`  ✓ ${slug} → ${nextSlug}`);
  }

  console.log("\n✅  Done! Visit /studio to add images to each project.\n");
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
