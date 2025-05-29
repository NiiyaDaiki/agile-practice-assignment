"use client";
import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    const nav = window.navigation;
    if (!nav) return; // API 非対応ブラウザ

    const store = new Map<string, number>(); // pathname+search → scrollY

    // tslint:disable-next-line:@typescript-eslint/no-explicit-any
    // todo: 適切な型をつける
    const onNavigate = (event: any) => {
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
