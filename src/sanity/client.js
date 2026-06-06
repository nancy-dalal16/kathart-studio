import { createClient } from "next-sanity";

export const isSanityConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

let _client = null;

export function getSanityClient() {
  if (!isSanityConfigured()) return null;
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-06-01",
      useCdn: process.env.NODE_ENV === "production",
    });
  }
  return _client;
}
