import { useLayoutEffect } from "react";

const STORAGE_KEY = "scroll-store";

export default function useHorizontalScrollRestore<T extends HTMLElement>(
  key: string,
  ref: React.RefObject<T>
) {
  useLayoutEffect(() => {
    const routeKey = location.pathname + location.search;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const store = JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>;
        const left = store[routeKey]?.x?.[key];
        if (typeof left === "number" && ref.current) {
          const original = ref.current.style.scrollBehavior;
          ref.current.style.scrollBehavior = "auto";
          ref.current.scrollLeft = left;
          ref.current.style.scrollBehavior = original;
        }
      }
    } catch {
      // ignore read error
    }
    return () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw ? (JSON.parse(raw) as Record<string, { y: number; x: Record<string, number> }>) : {};
        const entry = store[routeKey] ?? { y: 0, x: {} };
        entry.y = window.scrollY;
        entry.x[key] = ref.current?.scrollLeft ?? 0;
        store[routeKey] = entry;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore write error
      }
    };
  }, [key, ref]);
}
