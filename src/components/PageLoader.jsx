"use client";
import { useEffect, useRef, useState } from "react";

export default function PageLoader() {
  const [phase, setPhase] = useState("visible"); // visible → fading → gone
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isLight =
      document.documentElement.dataset.theme === "light" ||
      document.documentElement.classList.contains("light");

    const base = isLight
      ? "/images/cursor/Logo_Dark_Full"
      : "/images/cursor/Logo_Light_Full";

    const webm = document.createElement("source");
    webm.src = `${base}.webm`;
    webm.type = "video/webm";

    const mov = document.createElement("source");
    mov.src = `${base}.mov`;
    mov.type = "video/quicktime";

    video.appendChild(webm);
    video.appendChild(mov);
    video.load();

    const dismiss = () => {
      setPhase("fading");
      setTimeout(() => setPhase("gone"), 600);
    };

    video.addEventListener("ended", dismiss);
    video.play().catch(dismiss);

    // Hard fallback in case video fails silently
    const fallback = setTimeout(dismiss, 5000);

    return () => {
      video.removeEventListener("ended", dismiss);
      clearTimeout(fallback);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        style={{ width: 220, height: 220, objectFit: "contain" }}
      />
    </div>
  );
}
