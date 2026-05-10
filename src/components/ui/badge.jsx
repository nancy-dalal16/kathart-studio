import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const base =
    "inline-flex items-center rounded-md px-2.5 py-2.5 text-sm font-medium";

  const styles =
    variant === "default"
      ? "bg-purple-600 text-white"
      : "border border-[#3e3966] text-foreground";

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}
