"use client";
import { useEffect } from "react";

const SIZE = 56;

export default function TransitionHandler() {
  useEffect(() => {
    const handleClick = (e) => {
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
        left: ${e.clientX - SIZE / 2}px;
        top: ${e.clientY - SIZE / 2}px;
        object-fit: contain;
      `;

      const webm = document.createElement("source");
      webm.src = `${base}.webm`;
      webm.type = "video/webm; codecs=vp9";

      const mov = document.createElement("source");
      mov.src = `${base}.mov`;
      mov.type = "video/quicktime";

      video.appendChild(webm);
      video.appendChild(mov);
      document.body.appendChild(video);

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        video.remove();
      };

      const fallback = setTimeout(finish, 3500);
      video.onended = () => {
        clearTimeout(fallback);
        finish();
      };
      video.onerror = () => {
        clearTimeout(fallback);
        finish();
      };
      video.play().catch(() => {
        clearTimeout(fallback);
        finish();
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
}
