"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import SmoothScroll from "./SmoothScroll";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) return children;

  return (
    <SmoothScroll>
      <Header />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
