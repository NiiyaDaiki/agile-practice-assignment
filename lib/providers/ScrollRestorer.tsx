"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "scroll-store";

export default function ScrollRestorer() {
  const pathname = usePathname();
  const search = useSearchParams();
  const key = pathname + search.toString();

  // restore scroll position for the current route
  useLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const store = JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>;
        const y = store[key]?.y;
        if (typeof y === "number") {
          window.scrollTo(0, y);
        }
      }
    } catch {
      // ignore restore errors
    }
  }, [key]);

  // save scroll position before navigation and restore after
  useEffect(() => {
    const nav = window.navigation as any;
    if (nav?.addEventListener) {
      const onNavigate = (event: any) => {
        const fromKey = location.pathname + location.search;
        try {
          const raw = sessionStorage.getItem(STORAGE_KEY);
          const store = raw ? (JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>) : {};
          const prev = store[fromKey];
          const entry = { x: prev?.x ?? {}, y: window.scrollY };
          store[fromKey] = entry;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch {
          // ignore save error
        }

        const restore = () => {
          try {
            const toKey = location.pathname + location.search;
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
              const store = JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>;
              const y = store[toKey]?.y;
              if (typeof y === "number") {
                window.scrollTo(0, y);
              }
            }
          } catch {
            // ignore restore errors
          }
        };

        if (event.transition) {
          event.transition.finished.finally(() => requestAnimationFrame(restore));
        } else {
          requestAnimationFrame(restore);
        }
      };
      nav.addEventListener("navigate", onNavigate);
      return () => nav.removeEventListener("navigate", onNavigate);
    }

    // fallback when Navigation API is unavailable
    return () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw ? (JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>) : {};
        const prev = store[key];
        const entry = { x: prev?.x ?? {}, y: window.scrollY };
        store[key] = entry;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore save errors
      }
    };
  }, [key]);

  return null;
}
