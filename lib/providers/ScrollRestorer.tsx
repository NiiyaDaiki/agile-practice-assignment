"use client";
import { useEffect } from "react";

const STORAGE_KEY = "scroll-store";

export default function ScrollRestorer() {
  useEffect(() => {
    const nav = window.navigation;
    if (!nav) return; // API 非対応ブラウザ

    const readStore = () => {
      try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<
          string,
          { y: number; x: Record<string, number> }
        >;
      } catch {
        return {};
      }
    };

    const writeStore = (data: Record<string, { y: number; x: Record<string, number> }>) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    let store = readStore();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNavigate = (event: any) => {
      // TODO: 型定義が存在しないため any を利用
      const fromKey = location.pathname + location.search;
      const x: Record<string, number> = {};
      document.querySelectorAll<HTMLElement>("[data-scroll-key]").forEach((el) => {
        const key = el.dataset.scrollKey;
        if (key) x[key] = el.scrollLeft;
      });
      store[fromKey] = { y: window.scrollY, x };
      writeStore(store);

      const restoreY = () => {
        const toKey = location.pathname + location.search;
        store = readStore();
        window.scrollTo(0, store[toKey]?.y ?? 0);
      };

      if (!event.transition) {
        requestAnimationFrame(restoreY);
        return;
      }

      event.transition.finished.finally(() => requestAnimationFrame(restoreY));
    };

    nav.addEventListener("navigate", onNavigate);
    return () => nav.removeEventListener("navigate", onNavigate);
  }, []);

  return null;
}
