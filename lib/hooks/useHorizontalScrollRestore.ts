import { useLayoutEffect } from "react";

const STORAGE_KEY = "scroll-store";

export default function useHorizontalScrollRestore<T extends HTMLElement>(
  key: string,
  ref: React.RefObject<T>
) {
  useLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const store = JSON.parse(raw) as Record<string, { x?: Record<string, number> }>;
      const routeKey = location.pathname + location.search;
      const left = store[routeKey]?.x?.[key];
      if (typeof left === "number" && ref.current) {
        ref.current.scrollLeft = left;
      }
    } catch {
      // ignore
    }
  }, [key, ref]);
}
