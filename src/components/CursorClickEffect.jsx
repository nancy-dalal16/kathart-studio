"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SIZE = 48;

function playClickVideo(clientX, clientY, onEnd) {
  const isLight =
    document.documentElement.dataset.theme === "light" ||
    document.documentElement.classList.contains("light");

  const base = isLight
    ? "/images/cursor/Logo_Dark_Full"
    : "/images/cursor/Logo_Light_Full";

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99999;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${clientX - SIZE / 2}px;
    top: ${clientY - SIZE / 2}px;
    object-fit: contain;
  `;

  // webm VP9+alpha: Chrome, Firefox, Edge on Windows / Linux / Mac
  // mov ARGB: Safari on Mac / iOS
  const webm = document.createElement("source");
  webm.src = `${base}.webm`;
  webm.type = "video/webm; codecs=vp9";

  const mov = document.createElement("source");
  mov.src = `${base}.mov`;
  mov.type = "video/quicktime";

  video.appendChild(webm);
  video.appendChild(mov);
  document.body.appendChild(video);

  // Guard: ensure onEnd and cleanup only run once
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    video.remove();
    onEnd?.();
  };

  const fallback = setTimeout(finish, 3500);

  video.onended = () => { clearTimeout(fallback); finish(); };
  video.onerror = () => { clearTimeout(fallback); finish(); };

  video.play().catch(() => { clearTimeout(fallback); finish(); });
}

export default function CursorClickEffect() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a[href]");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const isExternal = /^(https?:)?\/\//.test(href);
        const isHash     = href.startsWith("#");
        const isNewTab   = anchor.target === "_blank";
        const isDownload = anchor.hasAttribute("download");
        const isMailto   = href.startsWith("mailto:");
        const isTel      = href.startsWith("tel:");

        if (!isExternal && !isHash && !isNewTab && !isDownload && !isMailto && !isTel) {
          e.preventDefault();
          // stopImmediatePropagation prevents ALL other listeners on this phase,
          // including Next.js Link's React-delegated handler
          e.stopImmediatePropagation();
          playClickVideo(e.clientX, e.clientY, () => router.push(href));
          return;
        }
      }

      playClickVideo(e.clientX, e.clientY);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return null;
}
