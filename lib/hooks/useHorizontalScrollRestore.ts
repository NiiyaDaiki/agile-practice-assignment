import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "scroll-store";

export default function useHorizontalScrollRestore<T extends HTMLElement>(
  key: string,
  ref: React.RefObject<T | null>,
) {
  const pathname = usePathname();
  const search = useSearchParams();
  const searchStr = search.toString();
  const routeKey = pathname + (searchStr ? `?${searchStr}` : "");

  useLayoutEffect(() => {
    const element = ref?.current;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw && element) {
        const store = JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>;
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
  }, [key, ref, routeKey]);
}
