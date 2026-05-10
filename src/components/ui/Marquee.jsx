"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // optional: remove if not needed

export default function Marquee({
  children,
  reverse = false,
  speed = 30,
  className,
}) {
  const marqueeRef = useRef(null);

  return (
    <div
      className={cn("relative overflow-hidden w-full select-none", className)}
      onMouseEnter={() =>
        (marqueeRef.current.style.animationPlayState = "paused")
      }
      onMouseLeave={() =>
        (marqueeRef.current.style.animationPlayState = "running")
      }
      onTouchStart={() =>
        (marqueeRef.current.style.animationPlayState = "paused")
      }
      onTouchEnd={() =>
        (marqueeRef.current.style.animationPlayState = "running")
      }
    >
      <div
        ref={marqueeRef}
        className={cn(
          "flex gap-12 whitespace-nowrap",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
