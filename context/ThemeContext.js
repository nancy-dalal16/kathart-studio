import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Read saved / system preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("kathart-theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = saved ?? system;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = useCallback(
    (_rect) => {
      const next = theme === "light" ? "dark" : "light";
      const html = document.documentElement;

      // Activate the CSS crossfade window — all colour properties
      // on every element transition simultaneously for 650 ms
      html.classList.add("theme-transitioning");
      html.setAttribute("data-theme", next);
      localStorage.setItem("kathart-theme", next);
      setTheme(next);

      setTimeout(() => html.classList.remove("theme-transitioning"), 700);
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
