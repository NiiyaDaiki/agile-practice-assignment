"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "scroll-store";

export default function ScrollRestorer() {
  const pathname = usePathname();
  const search = useSearchParams();
  const searchStr = search.toString();
  const key = pathname + (searchStr ? `?${searchStr}` : "");
  const keyRef = useRef(key);

  // restore scroll position for the current route
  useLayoutEffect(() => {
    keyRef.current = key;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const store = JSON.parse(raw) as Record<string, { x?: Record<string, number> }>;
        const entry = store[key];
        if (entry?.x) {
          requestAnimationFrame(() => {
            document
              .querySelectorAll<HTMLElement>("[data-scroll-key]")
              .forEach((el) => {
                const k = el.dataset.scrollKey!;
                const left = entry.x?.[k];
                if (typeof left === "number") {
                  const behavior = el.style.scrollBehavior;
                  el.style.scrollBehavior = "auto";
                  el.scrollLeft = left;
                  el.style.scrollBehavior = behavior;
                }
              });
          });
        }
      }
    } catch {
      // ignore restore errors
    }
  }, [key]);

  // save scroll position before navigation and restore after
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = window.navigation as any;
    if (nav?.addEventListener) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onNavigate = (event: any) => {
        const fromUrl = nav.currentEntry?.url ?? location.href;
        const from = new URL(fromUrl);
        const fromKey = from.pathname + from.search;
        const capture = () => {
          const x: Record<string, number> = {};
          document
            .querySelectorAll<HTMLElement>("[data-scroll-key]")
            .forEach((el) => {
              const k = el.dataset.scrollKey;
              if (k) x[k] = el.scrollLeft;
            });
          try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            const store = raw
              ? (JSON.parse(raw) as Record<string, { x?: Record<string, number> }>)
              : {};
            const prev = store[fromKey];
            const entry = {
              x: { ...(prev?.x ?? {}), ...x },
            };
            store[fromKey] = entry;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
          } catch {
            // ignore save error
          }
        };

        capture();

        const restore = () => {
          try {
            const toUrl = event.destination?.url ?? location.href;
            const to = new URL(toUrl);
            const toKey = to.pathname + to.search;
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
              const store = JSON.parse(raw) as Record<string, { x?: Record<string, number> }>;
              const entry = store[toKey];
              if (entry?.x) {
                document
                  .querySelectorAll<HTMLElement>("[data-scroll-key]")
                  .forEach((el) => {
                    const k = el.dataset.scrollKey!;
                    const left = entry.x?.[k];
                    if (typeof left === "number") {
                      const behavior = el.style.scrollBehavior;
                      el.style.scrollBehavior = "auto";
                      el.scrollLeft = left;
                      el.style.scrollBehavior = behavior;
                    }
                  });
              }
            }
          } catch {
            // ignore restore errors
          }
        };

        if (event.transition) {
          event.transition.finished.finally(() =>
            requestAnimationFrame(restore),
          );
        } else {
          requestAnimationFrame(restore);
        }
      };
      nav.addEventListener("navigate", onNavigate);
      return () => nav.removeEventListener("navigate", onNavigate);
    }

    // fallback when Navigation API is unavailable
    return () => {
      const x: Record<string, number> = {};
      document
        .querySelectorAll<HTMLElement>("[data-scroll-key]")
        .forEach((el) => {
          const k = el.dataset.scrollKey;
          if (k) x[k] = el.scrollLeft;
        });
      try {
        const currentKey = keyRef.current;
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw
          ? (JSON.parse(raw) as Record<string, { x?: Record<string, number> }>)
          : {};
        const prev = store[currentKey];
        const entry = { x: { ...(prev?.x ?? {}), ...x } };
        store[currentKey] = entry;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore save errors
      }
    };
  }, [key]);

  return null;
}
