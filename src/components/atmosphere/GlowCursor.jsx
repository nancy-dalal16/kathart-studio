"use client";
import { useEffect, useRef } from "react";

export default function GlowCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const d = dot.current;
    const r = ring.current;
    document.documentElement.classList.add("glow-cursor-on");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;
    let raf;

    const render = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        d.style.opacity = "1";
        r.style.opacity = "1";
      }
    };
    const leave = () => {
      visible = false;
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const over = (e) => {
      const interactive = e.target.closest(
        "a, button, [role='button'], input, textarea, label, [data-cursor='hover']"
      );
      r.classList.toggle("is-hover", !!interactive);
      d.classList.toggle("is-hover", !!interactive);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("glow-cursor-on");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="gc-ring" aria-hidden="true" />
      <div ref={dot} className="gc-dot" aria-hidden="true" />
    </>
  );
}
