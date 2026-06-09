import { createClient } from "next-sanity";

export const isSanityConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-06-01",
};

let _client = null;

export function getSanityClient() {
  if (!isSanityConfigured()) return null;
  if (!_client) {
    _client = createClient({
      ...clientConfig,
      useCdn: process.env.NODE_ENV === "production",
      // Explicitly exclude draft documents — without this the API returns both
      // the published doc and its drafts.* counterpart for the same document.
      perspective: "published",
    });
  }
  return _client;
}

// Preview client: bypasses CDN, fetches draft documents, for use in draft mode.
// stega encodes field coordinates into strings so the Presentation tool's
// click-to-edit overlay can map rendered content back to Studio fields.
export function getPreviewClient() {
  if (!isSanityConfigured()) return null;
  return createClient({
    ...clientConfig,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: "drafts",
    stega: {
      enabled: true,
      studioUrl: "/studio",
    },
  });
}
