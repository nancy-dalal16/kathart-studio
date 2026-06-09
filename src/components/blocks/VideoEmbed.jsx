"use client";

import { useState } from "react";

const aspectPaddingMap = {
  "16/9": "56.25%",
  "4/3": "75%",
  "1/1": "100%",
};

function toEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0`;
  return url;
}

export default function VideoEmbed({ block }) {
  const { url, caption, aspectRatio = "16/9" } = block;
  const embedUrl = toEmbedUrl(url);
  const [active, setActive] = useState(false);

  if (!embedUrl) return null;

  const paddingTop = aspectPaddingMap[aspectRatio] ?? "56.25%";

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-4">
      <figure>
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop }}>
          <iframe
            src={embedUrl}
            title={caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
          {/* Transparent overlay intercepts pointer events so Lenis can scroll
              the page normally when the cursor is over the embed. Removed on
              click so the user can interact with the video player. */}
          {!active && (
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={() => setActive(true)}
              title="Click to interact with video"
            />
          )}
        </div>
        {caption && (
          <figcaption className="mt-3 text-textColor text-xs sm:text-sm text-center leading-relaxed">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
