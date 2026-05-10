"use client";
import Script from "next/script";

export function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const saved = localStorage.getItem("theme");
              const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
              const theme = saved || (prefersLight ? "light" : "dark");
              document.documentElement.dataset.theme = theme;
              if (theme === "light") {
                document.documentElement.classList.add("light");
              } else {
                document.documentElement.classList.remove("light");
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}
