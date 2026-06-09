import React, { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";

// ─── Data hook ────────────────────────────────────────────────────────────────

function useProjects() {
  const client = useClient({ apiVersion: "2024-06-01" });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    // `raw` perspective returns both published docs and drafts.<id> versions
    const raw = client.withConfig({ perspective: "raw" });
    const docs = await raw.fetch(
      `*[_type == "project"]{
        _id, _updatedAt, title, category,
        "cover": coverImage.asset->url,
        "modules": count(pageBuilder)
      }`
    );

    // Collapse draft + published into one card per project
    const map = new Map();
    for (const d of docs) {
      const baseId = d._id.replace(/^drafts\./, "");
      const isDraftDoc = d._id.startsWith("drafts.");
      const existing = map.get(baseId);
      if (!existing) {
        map.set(baseId, { ...d, baseId, hasDraft: isDraftDoc, hasPublished: !isDraftDoc });
      } else {
        // Prefer the draft's content for display; merge publish/draft flags
        map.set(baseId, {
          ...(isDraftDoc ? d : existing),
          baseId,
          hasDraft: existing.hasDraft || isDraftDoc,
          hasPublished: existing.hasPublished || !isDraftDoc,
        });
      }
    }

    const list = Array.from(map.values()).sort(
      (a, b) => new Date(b._updatedAt) - new Date(a._updatedAt)
    );
    setProjects(list);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  return { projects, loading, reload: load };
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ p }) {
  const unpublished = !p.hasPublished;
  const editedDraft = p.hasPublished && p.hasDraft;
  if (!unpublished && !editedDraft) return null;

  const label = unpublished ? "Draft" : "Unpublished changes";
  const color = unpublished ? "#E8A33D" : "#6B5CE7";
  return (
    <span style={{
      position: "absolute", top: "12px", left: "12px", zIndex: 2,
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em",
      color: "#fff", background: color,
      padding: "3px 9px", borderRadius: "100px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    }}>
      {label}
    </span>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ p, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onOpen(p.baseId)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {/* Cover */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "4 / 3",
        borderRadius: "12px", overflow: "hidden",
        background: "#1A1733",
        boxShadow: hover ? "0 12px 32px rgba(0,0,0,0.28)" : "0 2px 10px rgba(0,0,0,0.12)",
        transform: hover ? "translateY(-3px)" : "none",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}>
        <StatusPill p={p} />
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title || "Untitled"}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              display: "block",
              transform: hover ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#2D1A4A,#0F0F1A)",
            color: "rgba(255,255,255,0.35)", fontSize: "12px", letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            No cover
          </div>
        )}

        {/* Hover gradient + edit hint */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 45%)",
          opacity: hover ? 1 : 0, transition: "opacity 0.2s",
        }} />
        <div style={{
          position: "absolute", bottom: "12px", right: "12px",
          fontSize: "11px", fontWeight: 700, color: "#fff",
          background: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "100px", padding: "5px 12px",
          opacity: hover ? 1 : 0, transform: hover ? "translateY(0)" : "translateY(6px)",
          transition: "all 0.2s",
        }}>
          Edit Project
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: "10px 2px 0" }}>
        <div style={{
          fontSize: "14px", fontWeight: 600, color: "var(--card-fg, #1A1733)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {p.title || "Untitled project"}
        </div>
        <div style={{ fontSize: "12px", color: "#8E8E9A", marginTop: "2px" }}>
          {p.category || "Uncategorized"}
          {typeof p.modules === "number" && p.modules > 0 && ` · ${p.modules} module${p.modules !== 1 ? "s" : ""}`}
        </div>
      </div>
    </div>
  );
}

// ─── Create tile ──────────────────────────────────────────────────────────────

function CreateTile({ onCreate }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onCreate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div style={{
        width: "100%", aspectRatio: "4 / 3", borderRadius: "12px",
        border: `2px dashed ${hover ? "#6B5CE7" : "#D6D6DE"}`,
        background: hover ? "rgba(107,92,231,0.05)" : "transparent",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "12px",
        transition: "all 0.2s",
        transform: hover ? "translateY(-3px)" : "none",
      }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: hover ? "#6B5CE7" : "rgba(107,92,231,0.1)",
          color: hover ? "#fff" : "#6B5CE7",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", lineHeight: 1, fontWeight: 300,
          transition: "all 0.2s",
        }}>
          +
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: hover ? "#6B5CE7" : "#1A1733" }}>
          Create a project
        </div>
      </div>
      <div style={{ height: "44px" }} />
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function BehanceDashboard({ onOpen, onCreate }) {
  const { projects, loading } = useProjects();

  const openProject = useCallback((id) => onOpen?.(id), [onOpen]);
  const createProject = useCallback(() => onCreate?.(), [onCreate]);

  return (
    <div style={{
      height: "100%", overflow: "auto",
      background: "var(--dash-bg, #FBFBFD)",
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* Header bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 5,
        background: "rgba(251,251,253,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #ECECF1",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: "22px", fontWeight: 800,
            color: "#1A1733", letterSpacing: "-0.01em",
          }}>
            Projects
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#8E8E9A" }}>
            {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={createProject}
          style={{
            background: "#6B5CE7", color: "#fff", border: "none",
            borderRadius: "100px", padding: "11px 22px",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "7px",
            boxShadow: "0 4px 14px rgba(107,92,231,0.32)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(107,92,231,0.42)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(107,92,231,0.32)"; }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
          Create a project
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "26px 22px",
        padding: "28px 32px 64px",
        maxWidth: "1400px", margin: "0 auto",
      }}>
        <CreateTile onCreate={createProject} />
        {projects.map((p) => (
          <ProjectCard key={p.baseId} p={p} onOpen={openProject} />
        ))}

        {!loading && projects.length === 0 && (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center",
            color: "#8E8E9A", fontSize: "13px", padding: "40px 0",
          }}>
            No projects yet — create your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
