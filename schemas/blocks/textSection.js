import { defineField, defineType } from "sanity";

// ─── Rich-text block definition ───────────────────────────────────────────────

const richTextBlock = {
  type: "block",

  styles: [
    { title: "Normal",     value: "normal"    },
    { title: "Lead",       value: "lead"      },  // large intro paragraph
    { title: "Heading 1",  value: "h1"        },
    { title: "Heading 2",  value: "h2"        },
    { title: "Heading 3",  value: "h3"        },
    { title: "Heading 4",  value: "h4"        },
    { title: "Blockquote", value: "blockquote" },
    { title: "Code Block", value: "code"      },  // monospace block
  ],

  lists: [
    { title: "Bullet",   value: "bullet" },
    { title: "Numbered", value: "number" },
  ],

  marks: {
    decorators: [
      { title: "Bold",        value: "strong"        },
      { title: "Italic",      value: "em"            },
      { title: "Underline",   value: "underline"     },
      { title: "Strike",      value: "strike-through" },
      { title: "Code",        value: "code"          },
    ],

    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
          }),
          defineField({
            name: "blank",
            title: "Open in new tab",
            type: "boolean",
            initialValue: true,
          }),
        ],
      },
      {
        name: "highlight",
        type: "object",
        title: "Highlight",
        fields: [
          defineField({
            name: "color",
            title: "Colour",
            type: "string",
            options: {
              list: [
                { title: "Yellow", value: "#FFF176" },
                { title: "Cyan",   value: "#B2EBF2" },
                { title: "Lime",   value: "#CCFF90" },
                { title: "Pink",   value: "#F8BBD0" },
                { title: "Violet", value: "#E1BEE7" },
              ],
              layout: "radio",
            },
            initialValue: "#FFF176",
          }),
        ],
      },
    ],
  },
};

// ─── Schema ───────────────────────────────────────────────────────────────────

export default defineType({
  name: "pb_text",
  title: "Text — Narrative Block",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Heading",       type: "string" }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        richTextBlock,
        // Inline image within prose
        {
          type: "image",
          title: "Inline Image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt",     title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption",  type: "string" }),
          ],
        },
      ],
    }),

    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Full width",        value: "full"     },
          { title: "Centered (narrow)", value: "centered" },
          { title: "Two columns",       value: "twoCol"   },
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
