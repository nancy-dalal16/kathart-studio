import React, { useEffect, useState, useCallback } from "react";
import { set, unset, useClient } from "sanity";

// Behance-style Creative Field picker: choose an existing field as a chip,
// or type a new one to add it. Stores a single string value.

const BASE_FIELDS = ["Design", "Films", "Marketing"];

export function CreativeFieldInput(props) {
  const { value, onChange, elementProps, readOnly } = props;
  const client = useClient({ apiVersion: "2024-06-01" });
  const [known, setKnown] = useState(BASE_FIELDS);
  const [draft, setDraft] = useState("");
  const [deleting, setDeleting] = useState(null); // field being deleted

  // Collect every creative field already used across projects
  useEffect(() => {
    let alive = true;
    client
      .withConfig({ perspective: "raw" })
      .fetch(`array::unique(*[_type == "project" && defined(category)].category)`)
      .then((vals) => {
        if (!alive) return;
        const merged = Array.from(new Set([...BASE_FIELDS, ...(vals || [])])).filter(Boolean);
        setKnown(merged);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [client]);

  const select = useCallback(
    (field) => onChange(field ? set(field) : unset()),
    [onChange]
  );

  const addNew = useCallback(() => {
    const v = draft.trim();
    if (!v) return;
    setKnown((k) => (k.includes(v) ? k : [...k, v]));
    select(v);
    setDraft("");
  }, [draft, select]);

  const deleteField = useCallback(async (field) => {
    if (deleting) return;

    // Count how many projects use this category (published + drafts)
    const raw = client.withConfig({ perspective: "raw" });
    const affected = await raw
      .fetch(`*[_type == "project" && category == $cat]{_id}`, { cat: field })
      .catch(() => []);

    const count = affected.length;
    const msg = count > 0
      ? `Delete the category "${field}"?\n\nThis will remove it from ${count} project${count !== 1 ? "s" : ""}.`
      : `Remove the category "${field}" from the picker?`;

    if (!window.confirm(msg)) return;

    setDeleting(field);
    try {
      // Unset category on every project that uses this field
      for (const doc of affected) {
        await client.patch(doc._id).unset(["category"]).commit();
      }
      // If this was the currently selected value, clear it
      if (value === field) onChange(unset());
      setKnown((k) => k.filter((f) => f !== field));
    } catch (err) {
      window.alert(`Could not delete category.\n\n${err?.message || err}`);
    } finally {
      setDeleting(null);
    }
  }, [client, value, onChange, deleting]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {known.map((field) => {
          const active = value === field;
          const isDeleting = deleting === field;
          return (
            <div
              key={field}
              style={{ display: "inline-flex", alignItems: "center", gap: 0 }}
            >
              <button
                type="button"
                disabled={readOnly || isDeleting}
                onClick={() => select(active ? null : field)}
                style={{
                  cursor: readOnly ? "default" : "pointer",
                  fontSize: "13px", fontWeight: 600,
                  padding: "7px 10px 7px 14px",
                  borderRadius: "100px 0 0 100px",
                  borderTop: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                  borderBottom: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                  borderLeft: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                  borderRight: "none",
                  background: active ? "#6B5CE7" : "transparent",
                  color: active ? "#fff" : "#1A1733",
                  transition: "all 0.15s",
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                {isDeleting ? "…" : field}
              </button>

              {/* Delete (×) button — only when not read-only */}
              {!readOnly && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => deleteField(field)}
                  title={`Remove "${field}"`}
                  style={{
                    cursor: isDeleting ? "default" : "pointer",
                    fontSize: "11px", fontWeight: 700, lineHeight: 1,
                    padding: "7px 8px",
                    borderRadius: "0 100px 100px 0",
                    borderTop: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                    borderRight: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                    borderBottom: `1.5px solid ${active ? "#6B5CE7" : "#D9D9E0"}`,
                    borderLeft: `1px solid ${active ? "rgba(255,255,255,0.3)" : "#E2E2E8"}`,
                    background: active ? "#6B5CE7" : "transparent",
                    color: active ? "rgba(255,255,255,0.8)" : "#999",
                    transition: "all 0.15s",
                    opacity: isDeleting ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.background = active ? "#5B4CC7" : "#FFF0F0";
                      e.currentTarget.style.color = active ? "#fff" : "#C0392B";
                      e.currentTarget.style.borderColor = active ? "#5B4CC7" : "#F0D4D4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = active ? "#6B5CE7" : "transparent";
                    e.currentTarget.style.color = active ? "rgba(255,255,255,0.8)" : "#999";
                    e.currentTarget.style.borderColor = active ? "#6B5CE7" : "#D9D9E0";
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add new */}
      {!readOnly && (
        <div style={{ display: "flex", gap: "8px", maxWidth: "360px" }}>
          <input
            {...elementProps}
            value={draft}
            placeholder="Add a creative field…"
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addNew(); }
            }}
            style={{
              flex: 1, fontSize: "13px",
              padding: "8px 12px", borderRadius: "8px",
              border: "1.5px solid #D9D9E0", outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={addNew}
            disabled={!draft.trim()}
            style={{
              fontSize: "13px", fontWeight: 700,
              padding: "8px 16px", borderRadius: "8px",
              border: "none",
              background: draft.trim() ? "#1A1733" : "#E2E2E8",
              color: "#fff",
              cursor: draft.trim() ? "pointer" : "default",
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
