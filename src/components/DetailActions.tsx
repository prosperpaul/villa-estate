"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/useFavorites";
import Icon from "./Icon";

// Share + Save buttons for the residence masthead.
export default function DetailActions({ slug, name }: { slug: string; name: string }) {
  const { has, toggle, hydrated } = useFavorites();
  const saved = hydrated && has(slug);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      // Phones: open the native share sheet
      if (navigator.share) return await navigator.share({ title: name, url });
      // Desktop: copy the link and confirm inline
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled the share sheet, nothing to do */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={share} className="btn btn-secondary !px-4 !py-2 text-[12px]">
        <Icon name={copied ? "check" : "share"} className="h-4 w-4" />
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      </button>
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className={`btn btn-secondary !px-4 !py-2 text-[12px] ${saved ? "!border-brand !text-brand" : ""}`}
      >
        <Icon name="heart" filled={saved} className="h-4 w-4" />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
