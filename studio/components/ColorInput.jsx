import React, { useCallback } from "react";
import { set, unset } from "sanity";

// Behance-style background color picker, usable as a Sanity custom input on any
// `string` field that stores a hex value. Provides quick preset swatches, a
// native color well, an editable hex field, and a "clear" affordance.

const PRESETS = [
  "#000000", // black (Behance default video letterbox)
  "#0F0F1A", // near-black ink
  "#1A1733", // deep violet-ink
  "#FFFFFF", // white
  "#F5F5F8", // light grey
  "#6B5CE7", // brand purple
  "#00C9A7", // teal
  "#FF6B6B", // coral
  "#F7B731", // amber
  "#45AAF2", // sky
];

function normalizeHex(raw) {
  if (!raw) return null;
  let v = raw.trim();
  if (!v.startsWith("#")) v = `#${v}`;
  // Accept #rgb or #rrggbb
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v.toLowerCase();
  return null;
}

export function ColorInput(props) {
  const { value, onChange, elementProps, readOnly } = props;
  const current = value || "";

  const commit = useCallback(
    (next) => {
      if (!next) onChange(unset());
      else onChange(set(next));
    },
    [onChange]
  );

  const onNative = useCallback((e) => commit(e.target.value), [commit]);

  const onHexChange = useCallback(
    (e) => {
      // Let the user type freely; only commit when it's a valid hex.
      const norm = normalizeHex(e.target.value);
      if (norm) commit(norm);
      else if (e.target.value === "") commit(null);
    },
    [commit]
  );

  const swatchBase = {
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    cursor: readOnly ? "default" : "pointer",
    padding: 0,
    transition: "transform 0.12s, box-shadow 0.12s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Preset swatches */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {PRESETS.map((c) => {
          const active = current.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              title={c}
              disabled={readOnly}
              onClick={() => commit(c)}
              style={{
                ...swatchBase,
                background: c,
                border: active ? "2px solid #6B5CE7" : "1px solid rgba(0,0,0,0.15)",
                boxShadow: active ? "0 0 0 2px rgba(107,92,231,0.25)" : "none",
                transform: active ? "scale(1.08)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Native well + hex field + clear */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="color"
          value={normalizeHex(current) || "#000000"}
          onChange={onNative}
          disabled={readOnly}
          aria-label="Pick a color"
          style={{
            width: "38px",
            height: "32px",
            padding: 0,
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: "6px",
            background: "transparent",
            cursor: readOnly ? "default" : "pointer",
          }}
        />
        <input
          {...elementProps}
          type="text"
          value={current}
          onChange={onHexChange}
          placeholder="#000000"
          disabled={readOnly}
          spellCheck={false}
          style={{
            flex: 1,
            maxWidth: "140px",
            height: "32px",
            padding: "0 10px",
            fontSize: "13px",
            fontFamily: "monospace",
            border: "1px solid #D9D9E0",
            borderRadius: "6px",
            outline: "none",
            color: "#1A1733",
            background: "#fff",
          }}
        />
        {current && !readOnly && (
          <button
            type="button"
            onClick={() => commit(null)}
            title="Clear color"
            style={{
              background: "transparent",
              border: "1px solid #E2E2E8",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#888",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default ColorInput;
