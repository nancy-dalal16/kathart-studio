"use client";

import { VisualEditing } from "@sanity/visual-editing/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function VisualEditingOverlay() {
  const pathname = usePathname();

  return (
    <>
      <VisualEditing />

      {/* Draft-mode banner — fixed at the bottom so it doesn't interfere with
          the Studio Presentation iframe, but is visible in standalone preview */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "8px 16px",
          background: "rgba(107, 92, 231, 0.95)",
          backdropFilter: "blur(8px)",
          fontSize: "12px",
          fontWeight: 600,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ opacity: 0.85 }}>Draft preview active</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <Link
          href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
          style={{
            color: "#fff",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            opacity: 0.85,
          }}
          prefetch={false}
        >
          Exit preview
        </Link>
        <span style={{ opacity: 0.5 }}>·</span>
        <Link
          href="/studio"
          style={{
            color: "#fff",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            opacity: 0.85,
          }}
        >
          Back to Studio
        </Link>
      </div>
    </>
  );
}
