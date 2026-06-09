import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_metrics",
  title: "Metrics — Stats Row",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label (e.g. The Results)", type: "string" }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value (e.g. +45%)", type: "string", validation: (R) => R.required() }),
            defineField({ name: "label", title: "Label (e.g. Conversion Rate)", type: "string", validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (R) => R.min(1).max(6),
    }),
  ],
  preview: {
    select: { eyebrow: "eyebrow", metrics: "metrics" },
    prepare({ eyebrow, metrics }) {
      const n = Array.isArray(metrics) ? metrics.length : 0;
      const vals = Array.isArray(metrics) ? metrics.slice(0, 3).map((m) => m.value).join(" · ") : "";
      return {
        title: eyebrow || "Metrics Row",
        subtitle: vals || `${n} stat${n !== 1 ? "s" : ""}`,
      };
    },
  },
});
