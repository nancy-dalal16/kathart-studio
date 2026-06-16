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
              const theme = saved || "dark";
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
