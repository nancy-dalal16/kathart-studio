import React, { useState } from "react";
import { ObjectInputMember } from "sanity";

// Behance-style document editor: a settings panel + a full-width module canvas,
// replacing Sanity's default tabbed form for the `project` document type.

const SETTINGS_FIELDS = ["title", "slug", "coverImage", "category", "tags", "description"];
const CONTENT_FIELD = "pageBuilder";

export function ProjectEditor(props) {
  const { members, value } = props;
  const [settingsOpen, setSettingsOpen] = useState(true);

  const renderCallbacks = {
    renderAnnotation: props.renderAnnotation,
    renderBlock: props.renderBlock,
    renderField: props.renderField,
    renderInlineBlock: props.renderInlineBlock,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  };

  const fieldMembers = members.filter((m) => m.kind === "field");
  const byName = (name) => fieldMembers.find((m) => m.name === name);

  // Any field members not explicitly placed (e.g. legacy fields) render at the bottom
  const placed = new Set([...SETTINGS_FIELDS, CONTENT_FIELD]);
  const leftover = fieldMembers.filter((m) => !placed.has(m.name));

  const contentMember = byName(CONTENT_FIELD);

  return (
    <div style={{ margin: "-16px", WebkitFontSmoothing: "antialiased" }}>

      {/* ── Editor header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1733 0%, #2D1A4A 55%, #0F0F1A 100%)",
        padding: "26px 28px",
        borderRadius: "0",
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.16)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 25 25" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="4" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: "17px", fontWeight: 800, color: "#fff",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {value?.title || "Untitled project"}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
            {value?.category ? `${Array.isArray(value.category) ? value.category.join(", ") : value.category} · ` : ""}Project Editor
          </div>
        </div>
      </div>

      <div style={{ padding: "22px 24px 40px", maxWidth: "920px", margin: "0 auto" }}>

        {/* ── Project Settings panel ── */}
        <div style={{
          border: "1px solid #E2E2E8", borderRadius: "14px",
          background: "#fff", overflow: "hidden", marginBottom: "26px",
        }}>
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 18px", background: "#FAFAFA", border: "none",
              borderBottom: settingsOpen ? "1px solid #EFEFF3" : "none",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#1A1733", letterSpacing: "0.01em" }}>
                Project Settings
              </span>
              <span style={{ fontSize: "11px", color: "#9A9AA6" }}>
                Title · Cover · Field · Tags
              </span>
            </span>
            <span style={{
              color: "#9A9AA6", fontSize: "12px",
              transform: settingsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
            }}>▾</span>
          </button>

          {settingsOpen && (
            <div style={{ padding: "18px" }}>
              <div style={{ display: "grid", gap: "18px" }}>
                {SETTINGS_FIELDS.map((name) => {
                  const member = byName(name);
                  if (!member) return null;
                  return (
                    <ObjectInputMember key={member.key} member={member} {...renderCallbacks} />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Content canvas ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#1A1733" }}>Project Content</span>
          <div style={{ flex: 1, height: "1px", background: "#ECECF1" }} />
        </div>

        {contentMember ? (
          <ObjectInputMember member={contentMember} {...renderCallbacks} />
        ) : null}

        {/* ── Leftover / legacy fields ── */}
        {leftover.length > 0 && (
          <div style={{
            marginTop: "30px", paddingTop: "20px", borderTop: "1px dashed #E2E2E8",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#B0B0BC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Other fields
            </div>
            <div style={{ display: "grid", gap: "18px" }}>
              {leftover.map((member) => (
                <ObjectInputMember key={member.key} member={member} {...renderCallbacks} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
