import { defineField, defineType } from "sanity";
import { ColorInput } from "../../studio/components/ColorInput";

export default defineType({
  name: "pb_split",
  title: "Gallery — Side by Side",
  type: "object",
  fields: [
    defineField({
      name: "left",
      title: "Left Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "right",
      title: "Right Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "ratio",
      title: "Split Ratio",
      type: "string",
      options: {
        list: [
          { title: "50 / 50", value: "50/50" },
          { title: "60 left / 40 right", value: "60/40" },
          { title: "40 left / 60 right", value: "40/60" },
        ],
        layout: "radio",
      },
      initialValue: "50/50",
    }),
    defineField({
      name: "bgColor",
      title: "Background Color",
      description: "Optional color panel behind the images. Leave empty for none.",
      type: "string",
      components: { input: ColorInput },
    }),
  ],
  preview: {
    select: { media: "left", ratio: "ratio", caption: "caption" },
    prepare({ media, ratio, caption }) {
      return {
        title: caption || "Side-by-Side Images",
        media,
        subtitle: `Split: ${ratio || "50/50"}`,
      };
    },
  },
});
