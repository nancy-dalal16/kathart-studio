import React, { useMemo, useState, useCallback } from "react";
import {
  useDocumentForm,
  FormBuilder,
  createPatchChannel,
  useDocumentOperation,
  useClient,
  CopyPasteProvider,
  ChangeConnectorRoot,
  LoadingBlock,
} from "sanity";

const noop = () => {};

// Full-screen Behance-style editor: top action bar + the real Sanity form,
// hosted inside our own tool so the Sanity desk (list panes) never appears.

export default function ProjectEditorView({ documentId, onBack }) {
  const doc = useDocumentForm({ documentId, documentType: "project" });
  const patchChannel = useMemo(() => createPatchChannel(), []);
  const ops = useDocumentOperation(documentId, "project");
  const client = useClient({ apiVersion: "2024-06-01" });
  const [busy, setBusy] = useState(null); // 'publish' | 'delete' | null

  const { formState } = doc;
  const title = doc.value?.title || "Untitled project";
  const slug = doc.value?.slug?.current;

  const publish = useCallback(() => {
    if (ops.publish.disabled) return;
    setBusy("publish");
    ops.publish.execute();
    setTimeout(() => setBusy(null), 1200);
  }, [ops]);

  const remove = useCallback(async () => {
    if (busy) return;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy("delete");

    // Delete the published doc *and* its draft in one atomic transaction, then
    // wait for it to commit before navigating back so the dashboard re-fetches
    // fresh data (avoids the project reappearing due to an un-flushed delete).
    const baseId = documentId.replace(/^drafts\./, "");
    try {
      await client
        .transaction()
        .delete(baseId)
        .delete(`drafts.${baseId}`)
        .commit({ visibility: "sync" });
      onBack();
    } catch (err) {
      setBusy(null);
      // eslint-disable-next-line no-console
      console.error("Failed to delete project:", err);
      window.alert(
        `Could not delete this project.\n\n${err?.message || err}\n\n` +
          "It may be referenced by another document, or you may lack delete permission."
      );
    }
  }, [busy, client, documentId, title, onBack]);

  const publishDisabled = Boolean(ops.publish.disabled) || busy === "publish";
  const publishLabel =
    busy === "publish" ? "Published" : ops.publish.disabled ? "Up to date" : "Publish";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FBFBFD" }}>

      {/* ── Top action bar ── */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: "14px",
        padding: "12px 20px",
        background: "rgba(251,251,253,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #ECECF1",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button
          onClick={onBack}
          title="Back to projects"
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "transparent", border: "1px solid #E2E2E8",
            borderRadius: "100px", padding: "8px 14px",
            fontSize: "13px", fontWeight: 600, color: "#1A1733", cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F2F2F6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: "15px", lineHeight: 1 }}>‹</span> Projects
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: "14px", fontWeight: 700, color: "#1A1733",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {title}
          </div>
        </div>

        {slug && (
          <a
            href={`/api/draft-mode/enable?redirect=${encodeURIComponent(`/work/${slug}`)}`}
            target="_blank"
            rel="noreferrer"
            title="Open draft preview in new tab"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "transparent",
              borderTop: "1px solid #D0C8F8",
              borderRight: "1px solid #D0C8F8",
              borderBottom: "1px solid #D0C8F8",
              borderLeft: "1px solid #D0C8F8",
              borderRadius: "100px", padding: "8px 14px",
              fontSize: "13px", fontWeight: 600, color: "#6B5CE7",
              cursor: "pointer", textDecoration: "none",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F0FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>↗</span> Preview
          </a>
        )}

        <button
          onClick={remove}
          title="Delete project"
          disabled={busy === "delete"}
          style={{
            background: "transparent", border: "1px solid #F0D4D4",
            borderRadius: "100px", padding: "8px 14px",
            fontSize: "13px", fontWeight: 600, color: "#C0392B", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FCEFEF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          Delete
        </button>

        <button
          onClick={publish}
          disabled={publishDisabled}
          style={{
            background: publishDisabled ? "#D9D9E0" : "#6B5CE7",
            color: "#fff", border: "none", borderRadius: "100px",
            padding: "9px 22px", fontSize: "13px", fontWeight: 700,
            cursor: publishDisabled ? "default" : "pointer",
            boxShadow: publishDisabled ? "none" : "0 4px 14px rgba(107,92,231,0.32)",
            transition: "all 0.15s",
          }}
        >
          {publishLabel}
        </button>
      </div>

      {/* ── Form body ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 16px 80px" }}>
          {doc.ready && formState ? (
            <CopyPasteProvider>
              <ChangeConnectorRoot
                isReviewChangesOpen={false}
                onOpenReviewChanges={noop}
                onSetFocus={noop}
                style={{ height: "auto" }}
              >
              <FormBuilder
                __internal_patchChannel={patchChannel}
                id="kathart-project-form"
                schemaType={doc.schemaType}
                value={doc.value}
                presence={[]}
                validation={formState.validation}
                members={formState.members}
                groups={formState.groups}
                focusPath={formState.focusPath}
                focused={formState.focused}
                changed={formState.changed}
                collapsedPaths={doc.collapsedPaths}
                collapsedFieldSets={doc.collapsedFieldSets}
                openPath={doc.openPath}
                onChange={doc.onChange}
                onPathFocus={doc.onFocus}
                onPathBlur={doc.onBlur}
                onPathOpen={doc.onPathOpen}
                onFieldGroupSelect={doc.onSetActiveFieldGroup}
                onSetFieldSetCollapsed={doc.onSetCollapsedFieldSet}
                onSetPathCollapsed={doc.onSetCollapsedPath}
              />
              </ChangeConnectorRoot>
            </CopyPasteProvider>
          ) : (
            <LoadingBlock showText title="Loading project…" />
          )}
        </div>
      </div>
    </div>
  );
}
