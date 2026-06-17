"use client";
import { usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

export default function HomeLoader() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <PageLoader />;
}
