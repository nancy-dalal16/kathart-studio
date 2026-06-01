import { getAllProjects } from "@/sanity/queries";
import WorkPageClient from "./WorkPageClient";

export const metadata = {
  title: "Our Work — Kathart Studios",
  description:
    "Stories we've shaped, identities we've built, and brands we've helped grow.",
};

export default async function WorkPage() {
  const projects = await getAllProjects();
  return <WorkPageClient projects={projects} />;
}
