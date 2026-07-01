"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [primary, ...rest] = images;
  const sideImages = rest.slice(0, 4);
  while (sideImages.length < 4) sideImages.push(primary);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] min-h-[460px] max-h-[640px] w-full">
        <button
          onClick={() => setLightbox(0)}
          className="photo relative col-span-2 row-span-2 overflow-hidden rounded-l-2xl bg-surface-2"
        >
          <Image src={primary} alt={`${name} — primary view`} fill priority sizes="50vw" className="object-cover" />
        </button>
        {sideImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i + 1)}
            className={`photo relative overflow-hidden bg-surface-2 ${
              i === 1 ? "rounded-tr-2xl" : i === 3 ? "rounded-br-2xl" : ""
            }`}
          >
            <Image src={src} alt={`${name} — view ${i + 2}`} fill sizes="25vw" className="object-cover" />
            {i === 3 && (
              <span className="absolute right-4 bottom-4 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-fg shadow-soft">
                + {Math.max(0, images.length - 5)} photos
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              aria-label="Close"
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={() => setLightbox(null)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <button
              aria-label="Prev"
              className="absolute left-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p === null ? null : (p - 1 + images.length) % images.length));
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              aria-label="Next"
              className="absolute right-6 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p === null ? null : (p + 1) % images.length));
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <div className="relative h-[85vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <Image src={images[lightbox]} alt={`${name} — image ${lightbox + 1}`} fill className="object-contain" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm text-white tnum">
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
