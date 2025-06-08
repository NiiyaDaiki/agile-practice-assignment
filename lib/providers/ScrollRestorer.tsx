"use client";
import { useEffect, useLayoutEffect } from "react";

const STORAGE_KEY = "scroll-store";

export default function ScrollRestorer() {
  // restore vertical scroll on mount
  useLayoutEffect(() => {
    const key = location.pathname + location.search;
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
  }, []);

  // store vertical scroll before navigating away
  useEffect(() => {
    const nav = window.navigation;
    if (!nav) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNavigate = (_event: any) => {
      const fromKey = location.pathname + location.search;
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const store = raw
          ? (JSON.parse(raw) as Record<string, { y?: number; x?: Record<string, number> }>)
          : {};
        const entry = store[fromKey] ?? { x: {} };
        entry.y = window.scrollY;
        store[fromKey] = entry;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // ignore save errors
      }
    };

    nav.addEventListener("navigate", onNavigate);
    return () => nav.removeEventListener("navigate", onNavigate);
  }, []);

  return null;
}
