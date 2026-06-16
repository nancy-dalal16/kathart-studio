import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_media",
  title: "Media — Full Width Image",
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
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      description:
        "Pick a crop, or “Original” to show a tall/vertical image full-height with no cropping (like Behance).",
      type: "string",
      options: {
        list: [
          { title: "Original — full height, no crop", value: "original" },
          { title: "Widescreen 16:9", value: "16/9" },
          { title: "Cinematic 2.39:1", value: "cinema" },
          { title: "Standard 3:2", value: "3/2" },
          { title: "Square 1:1", value: "1/1" },
          { title: "Portrait 2:3", value: "2/3" },
          { title: "Tall 9:16", value: "9/16" },
        ],
        layout: "radio",
      },
      initialValue: "16/9",
    }),
    defineField({
      name: "fullBleed",
      title: "Full bleed (edge to edge)",
      description: "Remove side margins and rounded corners so the image spans the full viewport width.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { caption: "caption", media: "image", ratio: "aspectRatio", bleed: "fullBleed" },
    prepare({ caption, media, ratio, bleed }) {
      const ratioLabel = ratio === "original" ? "Original" : ratio || "16/9";
      return {
        title: caption || "Full-width Image",
        media,
        subtitle: `Aspect: ${ratioLabel}${bleed ? " · Full bleed" : ""}`,
      };
    },
  },
});
