"use client";
import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    const nav = window.navigation;
    if (!nav) return; // API 非対応ブラウザ

    const store = new Map<string, number>(); // pathname+search → scrollY

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNavigate = (event: any) => {
      // TODO: 型定義が存在しないため any を利用
      const fromKey = location.pathname + location.search;
      store.set(fromKey, window.scrollY);

      /* ---- View-Transition が無い遷移 ---- */
      if (!event.transition) {
        // 1 フレーム後に即復元
        requestAnimationFrame(() => {
          const toKey = location.pathname + location.search;
          window.scrollTo(0, store.get(toKey) ?? 0);
        });
        return;
      }

      /* ---- View-Transition あり ---- */
      event.transition.finished.finally(() => {
        const toKey = location.pathname + location.search;
        const y = store.get(toKey) ?? 0;
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
    };

    nav.addEventListener("navigate", onNavigate);
    return () => nav.removeEventListener("navigate", onNavigate);
  }, []);

  return null;
}
