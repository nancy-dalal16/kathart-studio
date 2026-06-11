import { defineField, defineType } from "sanity";
import { PageBuilderInput } from "../studio/components/PageBuilderInput";
import { ProjectEditor } from "../studio/components/ProjectEditor";
import { CreativeFieldInput } from "../studio/components/CreativeFieldInput";
import { TagsInput } from "../studio/components/TagsInput";

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
      description: "Pick one or more fields, or type to add a new one.",
      type: "array",
      of: [{ type: "string" }],
      components: { input: CreativeFieldInput },
      validation: (Rule) => Rule.min(1).error("At least one creative field is required."),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Select from existing tags or type to add a new one.",
      type: "array",
      of: [{ type: "string" }],
      components: { input: TagsInput },
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
        { type: "pb_gif" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: Array.isArray(subtitle) ? subtitle.join(", ") : subtitle,
      };
    },
  },
});
