"use client";
import { useEffect, useRef, useState } from "react";

export default function PageLoader() {
  const [phase, setPhase] = useState("visible"); // visible → fading → gone
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null);

  // Detect theme on the client and pick the right video
  useEffect(() => {
    const isLight =
      document.documentElement.dataset.theme === "light" ||
      document.documentElement.classList.contains("light");
    setSrc(
      isLight
        ? "/images/cursor/Logo_Dark_Full.webm"
        : "/images/cursor/Logo_Light_Full.webm"
    );
  }, []);

  // Play once src is set in state (video element already has the src attr)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const dismiss = () => {
      setPhase("fading");
      setTimeout(() => setPhase("gone"), 600);
    };

    video.addEventListener("ended", dismiss);
    video.load();
    video.play().catch(dismiss);

    const fallback = setTimeout(dismiss, 5000);

    return () => {
      video.removeEventListener("ended", dismiss);
      clearTimeout(fallback);
    };
  }, [src]);

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
      {src && (
        <video
          ref={videoRef}
          muted
          playsInline
          src={src}
          style={{ width: 220, height: 220, objectFit: "contain" }}
        />
      )}
    </div>
  );
}
