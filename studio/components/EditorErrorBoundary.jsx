import React from "react";

// If the in-tool form host (alpha useDocumentForm/FormBuilder API) ever throws,
// fall back gracefully instead of breaking the whole tool.
export default class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Project editor failed to render:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
          padding: "40px", textAlign: "center", background: "#FBFBFD",
        }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1733" }}>
            Could not open the editor
          </div>
          <div style={{ fontSize: "13px", color: "#8E8E9A", maxWidth: "420px" }}>
            Something went wrong loading the project form. You can go back to the
            dashboard and try again.
          </div>
          <button
            onClick={this.props.onBack}
            style={{
              background: "#6B5CE7", color: "#fff", border: "none",
              borderRadius: "100px", padding: "10px 22px",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
            }}
          >
            Back to Projects
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
