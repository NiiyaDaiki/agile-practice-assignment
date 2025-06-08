import { useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "scroll-store";

export default function useHorizontalScrollRestore<T extends HTMLElement>(
  key: string,
  ref: React.RefObject<T>,
) {
  const pathname = usePathname();
  const search = useSearchParams();
  const routeKey = pathname + search.toString();
  const keyRef = useRef(routeKey);

  useLayoutEffect(() => {
    keyRef.current = routeKey;
    const element = ref.current;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw && element) {
        const store = JSON.parse(raw) as Record<
          string,
          { y?: number; x?: Record<string, number> }
        >;
        const left = store[routeKey]?.x?.[key];
        if (typeof left === "number") {
          const original = element.style.scrollBehavior;
          element.style.scrollBehavior = "auto";
          element.scrollLeft = left;
          element.style.scrollBehavior = original;
        }
      }
    } catch {
      // ignore read error
    }
    return () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw
          ? (JSON.parse(raw) as Record<
              string,
              { y?: number; x?: Record<string, number> }
            >)
          : {};
        const currentKey = keyRef.current;
        const entry = store[currentKey] ?? {
          y: store[currentKey]?.y ?? 0,
          x: {},
        };
        entry.x = { ...(entry.x ?? {}), [key]: element?.scrollLeft ?? 0 };
        store[currentKey] = entry;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore write error
      }
    };
  }, [key, ref, routeKey]);
}
