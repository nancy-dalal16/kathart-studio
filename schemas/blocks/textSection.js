import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_text",
  title: "Text — Narrative Block",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Large", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Full width", value: "full" },
          { title: "Centered (narrow)", value: "centered" },
          { title: "Two columns", value: "twoCol" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: { title: "heading", eyebrow: "eyebrow", layout: "layout" },
    prepare({ title, eyebrow, layout }) {
      const layoutLabel = { full: "Full width", centered: "Centered", twoCol: "Two columns" };
      return {
        title: title || "Text — untitled",
        subtitle: [eyebrow, layoutLabel[layout]].filter(Boolean).join(" · "),
      };
    },
  },
});
