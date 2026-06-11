import React, { useState, useEffect, useRef, useCallback } from "react";
import { set, unset } from "sanity";

/**
 * Reusable multiselect dropdown for Sanity custom inputs.
 *
 * Props:
 *   value       – string[] (currently selected items)
 *   onChange    – Sanity patch dispatcher (set / unset)
 *   options     – string[] (all available options to show in the list)
 *   readOnly    – bool
 *   placeholder – string shown when nothing is selected
 *   onAddOption – (newOption: string) => void  called when user adds a new custom entry
 */
export function MultiSelectInput({
  value = [],
  onChange,
  options = [],
  readOnly,
  placeholder = "Select…",
  onAddOption,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = useCallback(
    (option) => {
      if (readOnly) return;
      const next = value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option];
      onChange(next.length ? set(next) : unset());
    },
    [value, onChange, readOnly]
  );

  const remove = useCallback(
    (option) => {
      const next = value.filter((v) => v !== option);
      onChange(next.length ? set(next) : unset());
    },
    [value, onChange]
  );

  const addAndSelect = useCallback(
    (raw) => {
      const v = raw.trim();
      if (!v) return;
      onAddOption?.(v);
      if (!value.includes(v)) {
        onChange(set([...value, v]));
      }
      setSearch("");
    },
    [value, onChange, onAddOption]
  );

  const searchLower = search.trim().toLowerCase();
  const filtered = options.filter(
    (o) => !searchLower || o.toLowerCase().includes(searchLower)
  );
  const exactMatch = options.some((o) => o.toLowerCase() === searchLower);
  const canAddCustom = searchLower && !exactMatch;

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: "480px" }}>
      {/* Selected chips */}
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
          {value.map((v) => (
            <span
              key={v}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                fontSize: "12px", fontWeight: 600,
                padding: "4px 8px 4px 12px", borderRadius: "100px",
                background: "#6B5CE7", color: "#fff",
              }}
            >
              {v}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => remove(v)}
                  style={{
                    background: "none", border: "none",
                    color: "rgba(255,255,255,0.75)", cursor: "pointer",
                    padding: "0 2px", fontSize: "14px", lineHeight: 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      {!readOnly && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%", textAlign: "left",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: "8px",
            border: `1.5px solid ${open ? "#6B5CE7" : "#D9D9E0"}`,
            background: "#fff",
            fontSize: "13px",
            color: value.length ? "#1A1733" : "#999",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          <span>{value.length ? `${value.length} selected` : placeholder}</span>
          <span style={{ fontSize: "10px", color: "#aaa", marginLeft: "8px" }}>
            {open ? "▲" : "▼"}
          </span>
        </button>
      )}

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#fff",
            border: "1.5px solid #D9D9E0",
            borderRadius: "10px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Search / filter input */}
          <div style={{ padding: "8px 8px 6px" }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAddCustom) {
                  e.preventDefault();
                  addAndSelect(search);
                }
              }}
              placeholder="Search or type to add…"
              style={{
                width: "100%", boxSizing: "border-box",
                fontSize: "13px", padding: "7px 10px",
                borderRadius: "6px", border: "1.5px solid #E2E2E8",
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* Options list */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.length === 0 && !canAddCustom && (
              <div style={{ padding: "10px 14px", fontSize: "12px", color: "#aaa" }}>
                No options found
              </div>
            )}
            {filtered.map((opt) => {
              const checked = value.includes(opt);
              return (
                <label
                  key={opt}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 14px", cursor: "pointer",
                    background: checked ? "#F3F1FF" : "transparent",
                    fontSize: "13px", fontWeight: checked ? 600 : 400,
                    color: "#1A1733",
                  }}
                  onMouseEnter={(e) => {
                    if (!checked) e.currentTarget.style.background = "#F8F8FB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = checked ? "#F3F1FF" : "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt)}
                    style={{ accentColor: "#6B5CE7", width: "15px", height: "15px", flexShrink: 0 }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>

          {/* Add custom option */}
          {canAddCustom && (
            <div style={{ padding: "6px 8px 8px", borderTop: "1px solid #EEEDF3" }}>
              <button
                type="button"
                onClick={() => addAndSelect(search)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "8px 12px", borderRadius: "7px",
                  border: "none", background: "#1A1733", color: "#fff",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2D2855")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1733")}
              >
                + Add &ldquo;{search.trim()}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
