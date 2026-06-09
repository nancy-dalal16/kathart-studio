import { defineField, defineType } from "sanity";

export default defineType({
  name: "pb_video",
  title: "Video — Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL (YouTube or Vimeo)",
      type: "url",
      validation: (R) => R.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "16:9 (Widescreen)", value: "16/9" },
          { title: "4:3 (Classic)", value: "4/3" },
          { title: "1:1 (Square)", value: "1/1" },
        ],
        layout: "radio",
      },
      initialValue: "16/9",
    }),
  ],
  preview: {
    select: { url: "url", caption: "caption", ratio: "aspectRatio" },
    prepare({ url, caption, ratio }) {
      const platform = url?.includes("youtu") ? "YouTube" : url?.includes("vimeo") ? "Vimeo" : "Video";
      return {
        title: caption || `${platform} Embed`,
        subtitle: [platform, ratio ? `${ratio}` : null].filter(Boolean).join(" · "),
      };
    },
  },
});
