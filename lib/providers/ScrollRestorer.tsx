"use client";
import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    const nav = window.navigation;
    if (!nav) return; // API 非対応ブラウザ

    const store = new Map<
      string,
      { y: number; x: Record<string, number> }
    >(); // pathname+search → scroll positions

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNavigate = (event: any) => {
      // TODO: 型定義が存在しないため any を利用
      const fromKey = location.pathname + location.search;
      const x: Record<string, number> = {};
      document
        .querySelectorAll<HTMLElement>("[data-scroll-key]")
        .forEach((el) => {
          const key = el.dataset.scrollKey;
          if (key) x[key] = el.scrollLeft;
        });
      store.set(fromKey, { y: window.scrollY, x });

      /* ---- View-Transition が無い遷移 ---- */
      if (!event.transition) {
        // 1 フレーム後に即復元
        requestAnimationFrame(() => {
          const toKey = location.pathname + location.search;
          const state = store.get(toKey);
          if (state) {
            window.scrollTo(0, state.y);
            Object.entries(state.x).forEach(([key, left]) => {
              const el = document.querySelector<HTMLElement>(
                `[data-scroll-key="${key}"]`
              );
              if (el) el.scrollLeft = left;
            });
          } else {
            window.scrollTo(0, 0);
          }
        });
        return;
      }

      /* ---- View-Transition あり ---- */
      event.transition.finished.finally(() => {
        const toKey = location.pathname + location.search;
        const state = store.get(toKey);
        const y = state?.y ?? 0;
        const xMap = state?.x ?? {};
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
          Object.entries(xMap).forEach(([key, left]) => {
            const el = document.querySelector<HTMLElement>(
              `[data-scroll-key="${key}"]`
            );
            if (el) el.scrollLeft = left;
          });
        });
      });
    };

    nav.addEventListener("navigate", onNavigate);
    return () => nav.removeEventListener("navigate", onNavigate);
  }, []);

  return null;
}
