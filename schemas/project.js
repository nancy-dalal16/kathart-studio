import { defineField, defineType } from "sanity";
import { PageBuilderInput } from "../studio/components/PageBuilderInput";
import { ProjectEditor } from "../studio/components/ProjectEditor";
import { CreativeFieldInput } from "../studio/components/CreativeFieldInput";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  // Behance-style: a project is a cover + title + a canvas of content modules.
  // A custom document editor arranges these fields like Behance.
  components: { input: ProjectEditor },
  fields: [
    // ── Project Settings (Behance "Project Settings" panel) ──
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      description: "The thumbnail shown on the dashboard and work grid.",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Creative Field",
      description: "Pick an existing field or add a new one.",
      type: "string",
      components: { input: CreativeFieldInput },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description: "One or two lines shown on the project card and header.",
      type: "text",
      rows: 2,
    }),

    // ── Content canvas (Behance module stack) ──
    defineField({
      name: "pageBuilder",
      title: "Project Content",
      description: "Build your project by stacking modules — images, text, video and more.",
      type: "array",
      components: { input: PageBuilderInput },
      of: [
        { type: "pb_hero" },
        { type: "pb_text" },
        { type: "pb_media" },
        { type: "pb_split" },
        { type: "pb_grid" },
        { type: "pb_metrics" },
        { type: "pb_quote" },
        { type: "pb_video" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
  },
});
