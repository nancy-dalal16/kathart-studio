import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { route } from "sanity/router";
import { schemaTypes } from "./schemas";
import ProjectWorkspace from "./studio/components/ProjectWorkspace";

// Inline grid icon for the Projects tool
function ProjectsIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default defineConfig({
  name: "default",
  title: "Kathart Studio CMS",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [
    structureTool({ title: "Editor" }),
    presentationTool({
      // Points to your Next.js app for live preview
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      // Maps project documents to their preview URLs
      resolve: {
        mainDocuments: [
          {
            route: "/work/:slug",
            filter: `_type == "project" && slug.current == $slug`,
          },
        ],
      },
    }),
  ],

  // Behance-style dashboard is the default landing tool.
  // The Sanity "structure" desk is hidden from the nav (the plugin stays
  // installed so Presentation's editor pane still works), so editors only
  // ever see the Behance dashboard + in-tool editor.
  tools: (prev) => [
    {
      name: "projects",
      title: "Projects",
      icon: ProjectsIcon,
      component: ProjectWorkspace,
      router: route.create("/", [route.create("/edit/:projectId")]),
    },
    ...prev.filter((t) => t.name !== "structure"),
  ],

  schema: {
    types: schemaTypes,
  },
});
