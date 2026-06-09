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
      type: "string",
      options: {
        list: [
          { title: "Widescreen 16:9", value: "16/9" },
          { title: "Cinematic 2.39:1", value: "cinema" },
          { title: "Standard 3:2", value: "3/2" },
          { title: "Square 1:1", value: "1/1" },
        ],
        layout: "radio",
      },
      initialValue: "16/9",
    }),
  ],
  preview: {
    select: { caption: "caption", media: "image", ratio: "aspectRatio" },
    prepare({ caption, media, ratio }) {
      return {
        title: caption || "Full-width Image",
        media,
        subtitle: `Aspect: ${ratio || "16/9"}`,
      };
    },
  },
});
