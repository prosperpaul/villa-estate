"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";

// "Plate" numbering, like an architectural monograph: Plate 01, Plate 02...
const plate = (i: number) => `Plate ${String(i + 1).padStart(2, "0")}`;

export default function PropertyGallery({
  images,
  name,
  videoHref,
}: {
  images: string[];
  name: string;
  videoHref?: string; // anchor to the video tour section, when there is one
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = images.filter(Boolean);
  const [main, second, third] = photos;

  const step = useCallback(
    (d: number) => setLightbox((p) => (p === null ? null : (p + d + photos.length) % photos.length)),
    [photos.length],
  );

  // Keyboard: Esc closes, arrows move between plates
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step]);

  if (!main) {
    return <div className="eyebrow flex h-64 items-center justify-center rounded-lg border border-border bg-sand">No photographs yet</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Main focal plate */}
        <Plate src={main} alt={`${name}, ${plate(0)}`} label={photos.length > 1 ? `${plate(0)} of ${String(photos.length).padStart(2, "0")}` : plate(0)} onClick={() => setLightbox(0)} priority
          className={`h-[320px] sm:h-[440px] lg:h-[520px] ${second ? "md:col-span-7" : "md:col-span-12"}`} sizes="(min-width:768px) 58vw, 100vw" />

        {/* Secondary vertical duo */}
        {second && (
          <div className="hidden grid-rows-2 gap-3 md:col-span-5 md:grid">
            <Plate src={second} alt={`${name}, ${plate(1)}`} label={plate(1)} onClick={() => setLightbox(1)}
              className={third ? "" : "row-span-2"} sizes="42vw" />
            {third && (
              <Plate src={third} alt={`${name}, ${plate(2)}`} label={plate(2)} onClick={() => setLightbox(2)} sizes="42vw" />
            )}
          </div>
        )}
      </div>

      {/* "All plates" sits under the mosaic so it works on mobile too */}
      {(photos.length > 1 || videoHref) && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {videoHref && (
            <a href={videoHref} className="btn btn-secondary !px-4 !py-2 text-[12px]">
              <Icon name="video" className="h-4 w-4" />
              Watch video tour
            </a>
          )}
          {photos.length > 1 && (
          <button type="button" onClick={() => setLightbox(0)} className="btn btn-secondary !px-4 !py-2 text-[12px]">
            <Icon name="photos" className="h-4 w-4" />
            All {photos.length} plates
          </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} photographs`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-fg/90 p-6"
            onClick={() => setLightbox(null)}
          >
            <LightboxBtn label="Close" className="right-6 top-6" onClick={() => setLightbox(null)} path="M6 6l12 12M6 18L18 6" />
            {photos.length > 1 && (
              <>
                <LightboxBtn label="Previous plate" className="left-6 top-1/2 -translate-y-1/2" onClick={() => step(-1)} path="M15 6l-6 6 6 6" />
                <LightboxBtn label="Next plate" className="right-6 top-1/2 -translate-y-1/2" onClick={() => step(1)} path="M9 6l6 6-6 6" />
              </>
            )}
            <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <Image src={photos[lightbox]} alt={`${name}, ${plate(lightbox)}`} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-bg/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-bg">
              {plate(lightbox)} of {String(photos.length).padStart(2, "0")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Plate({
  src, alt, label, onClick, className = "", sizes, priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={`group relative overflow-hidden rounded-lg border border-border bg-sand ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      <span className="absolute bottom-3 left-3 rounded bg-bg/95 px-2 py-0.5 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em] text-fg">
        {label}
      </span>
    </button>
  );
}

function LightboxBtn({ label, className, onClick, path }: { label: string; className: string; onClick: () => void; path: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation(); // don't let the backdrop click close the lightbox
        onClick();
      }}
      className={`absolute inline-flex h-11 w-11 items-center justify-center rounded-full border border-bg/30 text-bg transition-colors hover:bg-bg/15 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d={path} />
      </svg>
    </button>
  );
}
