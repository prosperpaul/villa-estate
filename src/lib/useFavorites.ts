"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "vila-favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("favorites-changed"));
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavs(read());
    setHydrated(true);
    const onChange = () => setFavs(read());
    window.addEventListener("favorites-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("favorites-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    write(next);
    setFavs(next);
  }, []);

  const has = useCallback((slug: string) => favs.includes(slug), [favs]);

  return { favs, toggle, has, hydrated, count: favs.length };
}
