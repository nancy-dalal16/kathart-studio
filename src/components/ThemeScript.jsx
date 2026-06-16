"use client";
import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

const THEME_SCRIPT = `(function(){try{const saved=localStorage.getItem("theme");const theme=saved||"dark";document.documentElement.dataset.theme=theme;if(theme==="light"){document.documentElement.classList.add("light");}else{document.documentElement.classList.remove("light");}}catch(e){}})();`;

// Injects the theme bootstrap script into the SSR HTML stream outside the
// React tree — it executes before paint (no theme flash) without React 19's
// "Encountered a script tag while rendering React component" warning.
export default function ThemeScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
  });

  return null;
}
