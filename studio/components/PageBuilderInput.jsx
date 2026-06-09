import React, { useState, useCallback } from "react";
import { insert, PatchEvent, ArrayOfObjectsInputMember } from "sanity";
import { randomKey } from "@sanity/util/content";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── SVG layout thumbnails ────────────────────────────────────────────────────

function IconHero() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="url(#hg)" />
      <rect x="12" y="36" width="36" height="5" rx="2" fill="white" fillOpacity=".8" />
      <rect x="12" y="44" width="24" height="3" rx="1.5" fill="white" fillOpacity=".5" />
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="88" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B5CE7" /><stop offset="1" stopColor="#3B3479" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconText() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#F4F4F7" />
      <rect x="16" y="14" width="56" height="6" rx="2" fill="#1A1733" fillOpacity=".8" />
      <rect x="16" y="25" width="56" height="3" rx="1.5" fill="#1A1733" fillOpacity=".25" />
      <rect x="16" y="32" width="48" height="3" rx="1.5" fill="#1A1733" fillOpacity=".25" />
      <rect x="16" y="39" width="52" height="3" rx="1.5" fill="#1A1733" fillOpacity=".25" />
      <rect x="16" y="46" width="40" height="3" rx="1.5" fill="#1A1733" fillOpacity=".25" />
    </svg>
  );
}

function IconMedia() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#DDE1F0" />
      <circle cx="36" cy="28" r="7" fill="#6B5CE7" fillOpacity=".35" />
      <path d="M32 28L40 24V32L32 28Z" fill="#6B5CE7" fillOpacity=".7" />
      <rect x="8" y="50" width="72" height="3" rx="1.5" fill="#1A1733" fillOpacity=".15" />
    </svg>
  );
}

function IconSplit() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#F4F4F7" />
      <rect x="6" y="8" width="36" height="44" rx="3" fill="#DDE1F0" />
      <rect x="46" y="8" width="36" height="44" rx="3" fill="#DDE1F0" />
      <circle cx="24" cy="28" r="6" fill="#6B5CE7" fillOpacity=".3" />
      <circle cx="64" cy="28" r="6" fill="#6B5CE7" fillOpacity=".3" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#F4F4F7" />
      <rect x="6" y="6" width="37" height="22" rx="3" fill="#DDE1F0" />
      <rect x="47" y="6" width="35" height="22" rx="3" fill="#DDE1F0" />
      <rect x="6" y="32" width="37" height="22" rx="3" fill="#DDE1F0" />
      <rect x="47" y="32" width="35" height="22" rx="3" fill="#DDE1F0" />
    </svg>
  );
}

function IconMetrics() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#F4F4F7" />
      <rect x="8" y="12" width="22" height="36" rx="3" fill="#EEF0FA" />
      <rect x="34" y="12" width="22" height="36" rx="3" fill="#EEF0FA" />
      <rect x="60" y="12" width="22" height="36" rx="3" fill="#EEF0FA" />
      <rect x="13" y="19" width="12" height="8" rx="2" fill="#6B5CE7" fillOpacity=".5" />
      <rect x="39" y="19" width="12" height="8" rx="2" fill="#6B5CE7" fillOpacity=".5" />
      <rect x="65" y="19" width="12" height="8" rx="2" fill="#6B5CE7" fillOpacity=".5" />
      <rect x="13" y="32" width="12" height="3" rx="1.5" fill="#1A1733" fillOpacity=".2" />
      <rect x="39" y="32" width="12" height="3" rx="1.5" fill="#1A1733" fillOpacity=".2" />
      <rect x="65" y="32" width="12" height="3" rx="1.5" fill="#1A1733" fillOpacity=".2" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#F4F4F7" />
      <text x="10" y="48" fontSize="52" fill="#6B5CE7" fillOpacity=".2" fontFamily="Georgia,serif" fontWeight="bold">&quot;</text>
      <rect x="26" y="20" width="50" height="5" rx="2" fill="#1A1733" fillOpacity=".5" />
      <rect x="26" y="30" width="42" height="4" rx="2" fill="#1A1733" fillOpacity=".3" />
      <rect x="26" y="40" width="30" height="3" rx="1.5" fill="#6B5CE7" fillOpacity=".4" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg viewBox="0 0 88 60" fill="none" width="88" height="60">
      <rect width="88" height="60" rx="4" fill="#1A1733" />
      <rect x="6" y="6" width="76" height="48" rx="3" fill="#2D1A4A" fillOpacity=".6" />
      <circle cx="44" cy="30" r="12" fill="white" fillOpacity=".1" />
      <path d="M40 24L52 30L40 36V24Z" fill="white" fillOpacity=".8" />
    </svg>
  );
}

// ─── Block type registry ─────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { name: "pb_hero",    label: "Hero",        desc: "Full-bleed or split image hero", Icon: IconHero    },
  { name: "pb_text",    label: "Text",         desc: "Narrative text with layout",     Icon: IconText    },
  { name: "pb_media",   label: "Image",        desc: "Full-width single image",        Icon: IconMedia   },
  { name: "pb_split",   label: "Side by Side", desc: "Two images with ratio control",  Icon: IconSplit   },
  { name: "pb_grid",    label: "Grid",         desc: "Image gallery, 2–3 columns",     Icon: IconGrid    },
  { name: "pb_metrics", label: "Metrics",      desc: "Stats row with values + labels", Icon: IconMetrics },
  { name: "pb_quote",   label: "Pull Quote",   desc: "Large editorial pull quote",     Icon: IconQuote   },
  { name: "pb_video",   label: "Video",        desc: "YouTube or Vimeo embed",         Icon: IconVideo   },
];

const TYPE_LABEL = Object.fromEntries(BLOCK_TYPES.map((b) => [b.name, b.label]));

// ─── Visual block-type picker ─────────────────────────────────────────────────

function BlockTypePicker({ onSelect, onClose }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{
      background: "#FAFAFA", border: "1px solid #E2E2E8",
      borderRadius: "12px", padding: "20px", marginTop: "8px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>
          Choose a module
        </span>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#888", fontSize: "18px", lineHeight: 1, padding: "2px 6px", borderRadius: "4px",
        }}>×</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {BLOCK_TYPES.map(({ name, label, desc, Icon }) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === name ? "#fff" : "transparent",
              border: `1.5px solid ${hovered === name ? "#6B5CE7" : "#E2E2E8"}`,
              borderRadius: "10px", padding: "12px 10px 10px",
              cursor: "pointer", textAlign: "center", transition: "all 0.15s ease",
              boxShadow: hovered === name ? "0 4px 16px rgba(107,92,231,0.15)" : "none",
              transform: hovered === name ? "translateY(-1px)" : "none",
            }}
          >
            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "center" }}>
              <Icon />
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: hovered === name ? "#6B5CE7" : "#1A1733", marginBottom: "3px" }}>
              {label}
            </div>
            <div style={{ fontSize: "10px", color: "#888", lineHeight: 1.35 }}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Divider add-button ───────────────────────────────────────────────────────

function AddDivider({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", height: "32px", display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%", height: "1px",
        background: hov ? "#6B5CE7" : "#E2E2E8", transition: "background 0.15s",
      }} />
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        background: hov ? "#6B5CE7" : "#fff",
        border: `1.5px solid ${hov ? "#6B5CE7" : "#E2E2E8"}`,
        borderRadius: "50%", width: "22px", height: "22px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? "#fff" : "#888", fontSize: "16px", lineHeight: 1,
        transition: "all 0.15s",
        boxShadow: hov ? "0 2px 8px rgba(107,92,231,0.25)" : "none",
      }}>+</div>
    </div>
  );
}

// ─── Sortable item wrapper — renders one block card with drag handle ──────────

function SortableItem({ id, member, renderProps }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const typeLabel = TYPE_LABEL[member?.item?.value?._type] ?? (member?.item?.value?._type ?? "Block");

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        marginBottom: "4px",
      }}
    >
      <div style={{
        background: "#fff",
        border: `1.5px solid ${isDragging ? "#6B5CE7" : "#E2E2E8"}`,
        borderRadius: "10px", overflow: "hidden",
        boxShadow: isDragging ? "0 8px 24px rgba(107,92,231,0.18)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}>
        {/* Card header */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 12px 8px 8px",
          background: "#F7F7FA", borderBottom: "1px solid #EFEFF3",
        }}>
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            title="Drag to reorder"
            style={{ cursor: "grab", padding: "4px 3px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "3px" }}
          >
            {[0, 1].map((r) => (
              <div key={r} style={{ display: "flex", gap: "3px" }}>
                {[0, 1].map((c) => (
                  <div key={c} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#BBBBCC" }} />
                ))}
              </div>
            ))}
          </div>

          {/* Type badge */}
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#6B5CE7",
            background: "rgba(107,92,231,0.08)",
            borderRadius: "4px", padding: "2px 7px", flexShrink: 0,
          }}>
            {typeLabel}
          </span>

          <div style={{ flex: 1 }} />
        </div>

        {/* Sanity renders the item's fields here */}
        <div style={{ padding: "0" }}>
          <ArrayOfObjectsInputMember
            member={member}
            renderAnnotation={renderProps.renderAnnotation}
            renderBlock={renderProps.renderBlock}
            renderField={renderProps.renderField}
            renderInlineBlock={renderProps.renderInlineBlock}
            renderInput={renderProps.renderInput}
            renderItem={renderProps.renderItem}
            renderPreview={renderProps.renderPreview}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PageBuilderInput(props) {
  const {
    onChange, members = [], onMoveItem,
    renderAnnotation, renderBlock, renderField,
    renderInlineBlock, renderInput, renderItem, renderPreview,
  } = props;

  const [activePicker, setActivePicker] = useState(null); // null | 'empty' | 'bottom' | memberKey

  const renderProps = { renderAnnotation, renderBlock, renderField, renderInlineBlock, renderInput, renderItem, renderPreview };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const addBlock = useCallback(
    (typeName) => {
      const newItem = { _type: typeName, _key: randomKey(12) };
      onChange(PatchEvent.from(insert([newItem], "after", [-1])));
      setActivePicker(null);
    },
    [onChange]
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const itemMembers = members.filter((m) => m.kind === "item");
    const oldIndex = itemMembers.findIndex((m) => m.key === active.id);
    const newIndex = itemMembers.findIndex((m) => m.key === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && onMoveItem) {
      onMoveItem({ fromIndex: oldIndex, toIndex: newIndex });
    }
  }

  const itemMembers = members.filter((m) => m.kind === "item");
  const isEmpty = itemMembers.length === 0;

  return (
    <div style={{ fontFamily: "inherit", marginTop: "4px" }}>

      {/* ── Empty state ── */}
      {isEmpty && activePicker !== "empty" && (
        <div
          onClick={() => setActivePicker("empty")}
          style={{
            border: "2px dashed #E2E2E8", borderRadius: "12px",
            padding: "40px 20px", textAlign: "center", cursor: "pointer", background: "#FAFAFA",
          }}
        >
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "rgba(107,92,231,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", color: "#6B5CE7", fontSize: "22px",
          }}>+</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1733", marginBottom: "4px" }}>
            Add your first module
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Choose a content block — hero, image, text, video and more
          </div>
        </div>
      )}
      {activePicker === "empty" && (
        <BlockTypePicker onSelect={addBlock} onClose={() => setActivePicker(null)} />
      )}

      {/* ── Sortable block list ── */}
      {!isEmpty && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemMembers.map((m) => m.key)} strategy={verticalListSortingStrategy}>
            {itemMembers.map((member) => (
              <React.Fragment key={member.key}>
                <SortableItem id={member.key} member={member} renderProps={renderProps} />

                {/* Between-item add divider + picker */}
                {activePicker === member.key ? (
                  <BlockTypePicker onSelect={addBlock} onClose={() => setActivePicker(null)} />
                ) : (
                  <AddDivider onClick={() => setActivePicker(member.key)} />
                )}
              </React.Fragment>
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* ── Add more button (bottom) ── */}
      {!isEmpty && activePicker !== "bottom" && (
        <button
          onClick={() => setActivePicker("bottom")}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6B5CE7";
            e.currentTarget.style.color = "#6B5CE7";
            e.currentTarget.style.background = "rgba(107,92,231,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E2E2E8";
            e.currentTarget.style.color = "#888";
            e.currentTarget.style.background = "transparent";
          }}
          style={{
            width: "100%", background: "transparent",
            border: "1.5px dashed #E2E2E8", borderRadius: "8px",
            padding: "10px", cursor: "pointer", color: "#888",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em",
            transition: "all 0.15s", display: "flex",
            alignItems: "center", justifyContent: "center", gap: "6px",
            marginTop: "4px",
          }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
          Add Module
        </button>
      )}
      {activePicker === "bottom" && (
        <BlockTypePicker onSelect={addBlock} onClose={() => setActivePicker(null)} />
      )}
    </div>
  );
}
