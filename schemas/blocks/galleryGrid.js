import { defineField, defineType } from "sanity";
import { ColorInput } from "../../studio/components/ColorInput";

export default defineType({
  name: "pb_grid",
  title: "Gallery — Grid",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (R) => R.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: {
            select: { media: "image", title: "caption" },
            prepare({ media, title }) {
              return { media, title: title || "Image" };
            },
          },
        },
      ],
      validation: (R) => R.min(2),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 columns", value: 2 },
          { title: "3 columns", value: 3 },
        ],
        layout: "radio",
      },
      initialValue: 2,
    }),
    defineField({ name: "caption", title: "Section Caption", type: "string" }),
    defineField({
      name: "bgColor",
      title: "Background Color",
      description: "Optional color panel behind the gallery. Leave empty for none.",
      type: "string",
      components: { input: ColorInput },
    }),
  ],
  preview: {
    select: { columns: "columns", caption: "caption", count: "images" },
    prepare({ columns, caption, count }) {
      const n = Array.isArray(count) ? count.length : 0;
      return {
        title: caption || "Gallery Grid",
        subtitle: `${n} image${n !== 1 ? "s" : ""} · ${columns || 2} columns`,
      };
    },
  },
});
