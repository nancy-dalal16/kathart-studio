"use client";

import { usePathname } from "next/navigation";
import GlowCursor from "./GlowCursor";

export default function GlowCursorWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <GlowCursor />;
}
