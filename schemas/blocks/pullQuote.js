import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_quote",
  title: "Pull Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (R) => R.required(),
    }),
    defineField({ name: "attribution", title: "Attribution (name / role)", type: "string" }),
  ],
  preview: {
    select: { quote: "quote", attribution: "attribution" },
    prepare({ quote, attribution }) {
      const preview = quote ? `"${quote.slice(0, 70)}${quote.length > 70 ? "…" : ""}"` : "Pull Quote — untitled";
      return { title: preview, subtitle: attribution || undefined };
    },
  },
});
