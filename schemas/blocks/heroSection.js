import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_hero",
  title: "Hero — Full-bleed or Split",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 2 }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Full bleed (image fills)", value: "full" },
          { title: "Image left, text right", value: "imageLeft" },
          { title: "Image right, text left", value: "imageRight" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: { title: "headline", media: "image", subtitle: "layout" },
    prepare({ title, media, subtitle }) {
      const layoutLabel = { full: "Full-bleed", imageLeft: "Image left", imageRight: "Image right" };
      return {
        title: title || "Hero — untitled",
        media,
        subtitle: `Layout: ${layoutLabel[subtitle] || subtitle || "full"}`,
      };
    },
  },
});
