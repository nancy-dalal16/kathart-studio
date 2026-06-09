import React, { useCallback } from "react";
import { useRouter, useRouterState } from "sanity/router";
import BehanceDashboard from "./BehanceDashboard";
import ProjectEditorView from "./ProjectEditorView";
import EditorErrorBoundary from "./EditorErrorBoundary";

// Tool root: shows the Behance grid, or a full-screen editor when a project
// is selected. All navigation stays inside this tool — no Sanity desk.

function newProjectId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ProjectWorkspace() {
  const router = useRouter();
  const state = useRouterState();
  const projectId = state?.projectId;

  const open = useCallback((id) => router.navigate({ projectId: id }), [router]);
  const back = useCallback(() => router.navigate({}), [router]);
  const create = useCallback(() => router.navigate({ projectId: newProjectId() }), [router]);

  if (projectId) {
    return (
      <EditorErrorBoundary key={projectId} onBack={back}>
        <ProjectEditorView documentId={projectId} onBack={back} />
      </EditorErrorBoundary>
    );
  }
  return <BehanceDashboard onOpen={open} onCreate={create} />;
}
