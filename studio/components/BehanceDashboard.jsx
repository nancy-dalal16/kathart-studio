import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useClient } from "sanity";

// ─── Data hook ────────────────────────────────────────────────────────────────

function useProjects() {
  const client = useClient({ apiVersion: "2024-06-01" });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const raw = client.withConfig({ perspective: "raw" });
    const docs = await raw.fetch(
      `*[_type == "project"]{
        _id, _updatedAt, title, category, tags,
        "cover": coverImage.asset->url,
        "modules": count(pageBuilder)
      }`
    );

    const map = new Map();
    for (const d of docs) {
      const baseId = d._id.replace(/^drafts\./, "");
      const isDraft = d._id.startsWith("drafts.");
      const existing = map.get(baseId);
      if (!existing) {
        map.set(baseId, { ...d, baseId, hasDraft: isDraft, hasPublished: !isDraft });
      } else {
        map.set(baseId, {
          ...(isDraft ? d : existing),
          baseId,
          hasDraft: existing.hasDraft || isDraft,
          hasPublished: existing.hasPublished || !isDraft,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

const CATEGORY_COLORS = {
  "Branding":       "#FF6B6B",
  "UI/UX":          "#6B5CE7",
  "Motion":         "#00C9A7",
  "Photography":    "#F7B731",
  "Illustration":   "#FC5C65",
  "Typography":     "#4ECDC4",
  "Web Design":     "#45AAF2",
  "Product Design": "#A55EEA",
};

function catColor(cat) {
  return CATEGORY_COLORS[cat] || "#8E8E9A";
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div>
      <div style={{
        width: "100%", aspectRatio: "4/3", borderRadius: "8px",
        background: "linear-gradient(90deg,#F0F0F4 25%,#E4E4EA 50%,#F0F0F4 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite linear",
      }} />
      <div style={{ padding: "12px 0 0", display: "flex", flexDirection: "column", gap: "7px" }}>
        <div style={{ height: "13px", width: "70%", borderRadius: "4px", background: "#EEEEF3" }} />
        <div style={{ height: "11px", width: "45%", borderRadius: "4px", background: "#F4F4F7" }} />
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ p }) {
  if (!p.hasDraft && p.hasPublished) return null;
  const unpublished = !p.hasPublished;
  return (
    <div style={{
      position: "absolute", top: "10px", left: "10px", zIndex: 3,
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", color: "#fff",
      background: unpublished ? "#E8A33D" : "#6B5CE7",
      padding: "3px 8px", borderRadius: "100px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.2)",
    }}>
      {unpublished ? "Draft" : "Edited"}
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ icon, value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "4px",
      color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: 600,
    }}>
      {icon}
      <span>{value}</span>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ p, onOpen }) {
  const [hover, setHover] = useState(false);
  const initials = (p.title || "U").slice(0, 2).toUpperCase();
  const categoryLabel = Array.isArray(p.category) ? p.category.join(", ") : (p.category || "");
  const color = catColor(Array.isArray(p.category) ? p.category[0] : p.category);

  return (
    <article
      onClick={() => onOpen(p.baseId)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {/* Cover */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "4/3",
        borderRadius: "8px", overflow: "hidden",
        background: "#F5F5F8",
        boxShadow: hover ? "0 12px 36px rgba(0,0,0,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
      }}>
        <StatusBadge p={p} />

        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title || "Untitled"}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hover ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${color}22 0%, ${color}08 60%, #F0F0F6 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "38px", fontWeight: 900, color: `${color}55`, letterSpacing: "-0.02em" }}>
              {initials}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(15,15,26,0.68) 0%, rgba(15,15,26,0.15) 55%, transparent 100%)",
          opacity: hover ? 1 : 0, transition: "opacity 0.22s ease",
        }}>
          {/* Stats — real metadata only (no vanity counters) */}
          <div style={{
            position: "absolute", bottom: "12px", left: "12px",
            display: "flex", gap: "14px",
            transform: hover ? "translateY(0)" : "translateY(6px)",
            transition: "transform 0.22s ease",
          }}>
            <StatChip
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>}
              value={typeof p.modules === "number" && p.modules > 0 ? `${p.modules} block${p.modules !== 1 ? "s" : ""}` : "Empty"}
            />
            <StatChip
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
              value={timeAgo(p._updatedAt)}
            />
          </div>

          {/* Edit pill */}
          <div style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(255,255,255,0.16)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)", borderRadius: "100px",
            padding: "5px 12px", fontSize: "11px", fontWeight: 700, color: "#fff",
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(-4px)",
            transition: "all 0.2s ease",
          }}>
            Edit
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: "11px 2px 0" }}>
        <div style={{
          fontSize: "14px", fontWeight: 700, color: "#0F0F1A", lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: "6px",
        }}>
          {p.title || "Untitled project"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {/* Mini avatar */}
          <div style={{
            width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "8px", fontWeight: 800, color: "#fff",
          }}>
            {initials[0]}
          </div>

          <span style={{
            fontSize: "12px", color: "#6B6B7B", flex: 1,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {categoryLabel || "Uncategorized"}
          </span>

          {categoryLabel && (
            <span style={{
              flexShrink: 0, fontSize: "10px", fontWeight: 700,
              color: color, background: `${color}18`,
              padding: "2px 7px", borderRadius: "100px",
            }}>
              {categoryLabel}
            </span>
          )}
        </div>

        <div style={{ marginTop: "5px", fontSize: "11px", color: "#B0B0BC" }}>
          {timeAgo(p._updatedAt)}
          {typeof p.modules === "number" && p.modules > 0 && ` · ${p.modules} block${p.modules !== 1 ? "s" : ""}`}
        </div>
      </div>
    </article>
  );
}

// ─── Create tile ──────────────────────────────────────────────────────────────

function CreateTile({ onCreate }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onCreate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div style={{
        width: "100%", aspectRatio: "4/3", borderRadius: "8px",
        border: `2px dashed ${hover ? "#6B5CE7" : "#DCDCE6"}`,
        background: hover ? "rgba(107,92,231,0.04)" : "#FAFAFA",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "10px",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all 0.22s ease",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: hover ? "#6B5CE7" : "rgba(107,92,231,0.1)",
          color: hover ? "#fff" : "#6B5CE7",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", lineHeight: 1,
          transition: "all 0.22s ease",
        }}>
          +
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 700,
          color: hover ? "#6B5CE7" : "#8E8E9A",
          transition: "color 0.22s",
        }}>
          New project
        </span>
      </div>
      <div style={{ height: "56px" }} />
    </article>
  );
}

// ─── Filter tab ───────────────────────────────────────────────────────────────

function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", borderRadius: 0, cursor: "pointer",
        padding: "9px 14px",
        fontSize: "13px", fontWeight: active ? 700 : 500,
        color: active ? "#0F0F1A" : "#8E8E9A",
        borderBottom: `2px solid ${active ? "#0F0F1A" : "transparent"}`,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#1A1733"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#8E8E9A"; }}
    >
      {label}
    </button>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

const FILTERS = ["All", "Published", "Drafts", "Recent"];

export default function BehanceDashboard({ onOpen, onCreate }) {
  const { projects, loading } = useProjects();
  const [search, setSearch]         = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy]         = useState("updated"); // updated | title | blocks

  const counts = useMemo(() => ({
    All:       projects.length,
    Published: projects.filter((p) => p.hasPublished && !p.hasDraft).length,
    Drafts:    projects.filter((p) => p.hasDraft).length,
    Recent:    Math.min(projects.length, 8),
  }), [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (activeFilter === "Published") list = list.filter((p) => p.hasPublished && !p.hasDraft);
    else if (activeFilter === "Drafts")  list = list.filter((p) => p.hasDraft);
    else if (activeFilter === "Recent")  list = list.slice(0, 8);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title    || "").toLowerCase().includes(q) ||
          (Array.isArray(p.category) ? p.category.join(" ") : (p.category || "")).toLowerCase().includes(q)
      );
    }

    // Sort (clone first — never mutate the source list)
    const sorted = [...list];
    if (sortBy === "title") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "blocks") {
      sorted.sort((a, b) => (b.modules || 0) - (a.modules || 0));
    } else {
      sorted.sort((a, b) => new Date(b._updatedAt) - new Date(a._updatedAt));
    }
    return sorted;
  }, [projects, activeFilter, search, sortBy]);

  return (
    <div style={{
      height: "100%", overflowY: "auto",
      background: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

      {/* ── Top nav ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #F0F0F4",
      }}>
        {/* Nav row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          padding: "0 28px", height: "60px",
        }}>
          {/* Wordmark */}
          <div style={{
            fontSize: "19px", fontWeight: 900, letterSpacing: "-0.04em",
            color: "#0F0F1A", flexShrink: 0,
          }}>
            Kathart<span style={{ color: "#6B5CE7" }}>.</span>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: "420px", position: "relative", display: "flex", alignItems: "center" }}>
            <svg style={{ position: "absolute", left: "11px", color: "#B0B0BC", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              style={{
                width: "100%", height: "36px",
                background: "#F5F5F8", border: "1px solid transparent",
                borderRadius: "100px", outline: "none",
                paddingLeft: "34px", paddingRight: "14px",
                fontSize: "13px", color: "#0F0F1A",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onFocus={(e) => { e.target.style.background = "#fff"; e.target.style.borderColor = "#6B5CE7"; }}
              onBlur={(e)  => { e.target.style.background = "#F5F5F8"; e.target.style.borderColor = "transparent"; }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {!loading && (
            <span style={{ fontSize: "12px", color: "#B0B0BC", fontWeight: 500, flexShrink: 0 }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          )}

          <button
            onClick={onCreate}
            style={{
              flexShrink: 0, background: "#0F0F1A", color: "#fff",
              border: "none", borderRadius: "6px", padding: "9px 18px",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2D1A4A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0F0F1A"; e.currentTarget.style.transform = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload Work
          </button>
        </div>

        {/* Filter tabs + sort */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "0 24px", borderTop: "1px solid #F5F5F8",
          gap: "2px", overflowX: "auto",
        }}>
          {FILTERS.map((f) => (
            <FilterTab
              key={f}
              label={counts[f] > 0 ? `${f} (${counts[f]})` : f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}

          <div style={{ flex: 1, minWidth: "12px" }} />

          <label style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#B0B0BC", whiteSpace: "nowrap" }}>
              Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                appearance: "none", WebkitAppearance: "none",
                background: "#F5F5F8", border: "1px solid transparent",
                borderRadius: "100px", padding: "6px 28px 6px 12px",
                fontSize: "12px", fontWeight: 600, color: "#0F0F1A",
                cursor: "pointer", outline: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238E8E9A' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="updated">Recently updated</option>
              <option value="title">Title A–Z</option>
              <option value="blocks">Most blocks</option>
            </select>
          </label>
        </div>
      </header>

      {/* ── Grid ── */}
      <main style={{ maxWidth: "1480px", margin: "0 auto", padding: "28px 28px 80px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))",
          gap: "28px 20px",
        }}>
          <CreateTile onCreate={onCreate} />

          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((p) => (
                <ProjectCard key={p.baseId} p={p} onOpen={onOpen} />
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{
            marginTop: "80px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
          }}>
            <div style={{
              width: "68px", height: "68px", borderRadius: "50%", background: "#F5F5F8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C0C0CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F0F1A", margin: 0 }}>
              {search ? "No results found" : "No projects yet"}
            </p>
            <p style={{ fontSize: "13px", color: "#8E8E9A", margin: 0, textAlign: "center", maxWidth: "280px" }}>
              {search
                ? `Nothing matched "${search}" — try a different keyword.`
                : "Upload your first work to get started."}
            </p>
            {!search && (
              <button
                onClick={onCreate}
                style={{
                  marginTop: "8px", background: "#6B5CE7", color: "#fff",
                  border: "none", borderRadius: "100px", padding: "10px 24px",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                }}
              >
                Create a project
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
