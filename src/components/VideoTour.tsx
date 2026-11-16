"use client";

import Image from "next/image";
import { useState } from "react";

// Work out how to play a link: YouTube/Vimeo get an iframe, anything else a <video>.
function toPlayer(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  return { kind: "video", src: url };
}

// Shows the cover photo with a play button; the player only loads on click.
export default function VideoTour({ url, poster, title }: { url: string; poster: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const player = toPlayer(url);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-fg">
      {playing ? (
        player.kind === "iframe" ? (
          <iframe
            src={player.src}
            title={`${title} video tour`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <video src={player.src} controls autoPlay className="absolute inset-0 h-full w-full" />
        )
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`Play ${title} video tour`}>
          {poster && <Image src={poster} alt="" fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover opacity-80" />}
          <span className="absolute inset-0 bg-gradient-to-t from-fg/70 via-fg/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-bg transition-colors group-hover:bg-brand-hover">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l12-7.5-12-7.5Z" />
              </svg>
            </span>
            <span className="rounded-full bg-bg/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg">
              Play walkthrough
            </span>
          </span>
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-bg">
            Full property walkthrough · {title}
          </span>
        </button>
      )}
    </div>
  );
}
