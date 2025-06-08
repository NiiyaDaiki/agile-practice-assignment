"use client";
import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "scroll-store";

export default function ScrollRestorer() {
  const pathname = usePathname();
  const search = useSearchParams();
  const key = pathname + search.toString();

  useLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const store = JSON.parse(raw) as Record<string, { y: number }>;
        const y = store[key]?.y;
        if (typeof y === "number") {
          window.scrollTo(0, y);
        }
      }
    } catch {
      // ignore restore errors
    }
    return () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw ? (JSON.parse(raw) as Record<string, { y: number }>) : {};
        store[key] = { y: window.scrollY };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore save errors
      }
    };
  }, [key]);

  return null;
}
