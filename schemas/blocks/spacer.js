import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_spacer",
  title: "Spacer / Divider",
  type: "object",
  fields: [
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
          { title: "Extra large", value: "xlarge" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Blank space", value: "blank" },
          { title: "Thin rule", value: "rule" },
          { title: "Dotted rule", value: "dotted" },
        ],
        layout: "radio",
      },
      initialValue: "blank",
    }),
  ],
  preview: {
    select: { size: "size", style: "style" },
    prepare({ size, style }) {
      const sizeLabel = { small: "Small", medium: "Medium", large: "Large", xlarge: "Extra large" };
      const styleLabel = { blank: "Blank space", rule: "Thin rule", dotted: "Dotted rule" };
      return {
        title: styleLabel[style] || "Blank space",
        subtitle: sizeLabel[size] || "Medium",
      };
    },
  },
});
