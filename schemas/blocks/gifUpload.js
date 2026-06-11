import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_gif",
  title: "Animated GIF",
  type: "object",
  fields: [
    defineField({
      name: "gif",
      title: "GIF File",
      description: "Upload an animated .gif file. Stored as-is — no compression applied.",
      type: "file",
      options: { accept: "image/gif" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "width",
      title: "Display Width",
      type: "string",
      options: {
        list: [
          { title: "Full width", value: "full" },
          { title: "Large — 75%", value: "large" },
          { title: "Medium — 50%", value: "medium" },
          { title: "Small — 33%", value: "small" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      hidden: ({ parent }) => parent?.width === "full",
    }),
  ],
  preview: {
    select: { caption: "caption", width: "width" },
    prepare({ caption, width }) {
      const labels = { full: "Full width", large: "Large (75%)", medium: "Medium (50%)", small: "Small (33%)" };
      return {
        title: caption || "Animated GIF",
        subtitle: labels[width] || "Full width",
      };
    },
  },
});
