import { defineField, defineType } from "sanity";
import { ColorInput } from "../../studio/components/ColorInput";

export default defineType({
  name: "pb_video",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Embed (YouTube / Vimeo)", value: "embed" },
          { title: "Upload from device", value: "upload" },
        ],
        layout: "radio",
      },
      initialValue: "embed",
      validation: (R) => R.required(),
    }),

    // ── Embed fields ──────────────────────────────────────────────────────────
    defineField({
      name: "url",
      title: "Video URL (YouTube or Vimeo)",
      type: "url",
      hidden: ({ parent }) => parent?.source !== "embed",
      validation: (R) =>
        R.custom((val, ctx) => {
          if (ctx.parent?.source === "embed" && !val)
            return "A URL is required for embedded video.";
          return true;
        }),
    }),

    // ── Upload field ──────────────────────────────────────────────────────────
    defineField({
      name: "videoFile",
      title: "Video File",
      description: "MP4, WebM, or MOV — max size depends on your Sanity plan.",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime,video/*" },
      hidden: ({ parent }) => parent?.source !== "upload",
      validation: (R) =>
        R.custom((val, ctx) => {
          if (ctx.parent?.source === "upload" && !val?.asset)
            return "Please upload a video file.";
          return true;
        }),
    }),

    // ── Shared fields ─────────────────────────────────────────────────────────
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "bgColor",
      title: "Background Color",
      description:
        "The letterbox color shown behind the video when it doesn't fill the frame — like Behance. Defaults to black.",
      type: "string",
      components: { input: ColorInput },
      initialValue: "#000000",
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "16:9 (Widescreen)", value: "16/9" },
          { title: "4:3 (Classic)", value: "4/3" },
          { title: "1:1 (Square)", value: "1/1" },
          { title: "9:16 (Portrait)", value: "9/16" },
        ],
        layout: "radio",
      },
      initialValue: "16/9",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay (muted loop)",
      description: "Only applies to uploaded video files.",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.source !== "upload",
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      ratio: "aspectRatio",
      source: "source",
      url: "url",
    },
    prepare({ caption, ratio, source, url }) {
      const isEmbed = source !== "upload";
      let platform = "Uploaded Video";
      if (isEmbed && url) {
        platform = url.includes("youtu") ? "YouTube" : url.includes("vimeo") ? "Vimeo" : "Embed";
      }
      return {
        title: caption || (isEmbed ? `${platform} Embed` : "Uploaded Video"),
        subtitle: [platform, ratio ? ratio : null].filter(Boolean).join(" · "),
      };
    },
  },
});
