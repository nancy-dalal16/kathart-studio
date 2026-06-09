import { getAllProjects } from "@/sanity/queries";
import WorkPageClient from "./WorkPageClient";
import { draftMode } from "next/headers";

export const metadata = {
  title: "Our Work — Kathart Studios",
  description:
    "Stories we've shaped, identities we've built, and brands we've helped grow.",
};

export default async function WorkPage() {
  const { isEnabled: isDraft } = await draftMode();
  const projects = await getAllProjects(isDraft);
  return <WorkPageClient projects={projects} />;
}
