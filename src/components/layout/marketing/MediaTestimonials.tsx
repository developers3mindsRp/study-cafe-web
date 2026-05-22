"use client";

import { useState } from "react";
import Image from "next/image";
import type { MediaTestimonial } from "@/types/models.types";

interface Props {
  items: MediaTestimonial[];
  variant?: "marketing" | "course";
}

function youtubeEmbed(url: string): string | null {
  if (!url?.trim()) return null;
  let id = "";
  if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1]?.split(/[?&#]/)[0] ?? "";
  } else if (url.includes("youtube.com")) {
    const m = url.match(/[?&]v=([^&]+)/);
    id = m?.[1] ?? url.split("/embed/")[1]?.split(/[?&#]/)[0] ?? "";
  }
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&playsinline=1&rel=0`;
}

function TestimonialCard({
  item,
  onPlay,
}: {
  item: MediaTestimonial;
  onPlay: (embed: string) => void;
}) {
  const isVideo = item.mediaType === "video" && !!item.videoUrl?.trim();
  const embed = isVideo ? youtubeEmbed(item.videoUrl!) : null;

  return (
    <div className="relative h-[280px] md:h-[320px] min-w-[220px] md:min-w-[260px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#1a1a1a]">
      <img
        src={item.mediaUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-90"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex h-full items-center justify-center p-3">
        <div className="relative h-[92%] max-h-[280px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img
            src={item.mediaUrl}
            alt={item.title || "Testimonial"}
            className="w-full h-full object-cover"
          />
          <Image
            src="/images/studycafe_logo.svg"
            alt="StudyCafe"
            width={72}
            height={20}
            className="absolute top-2 right-2 h-4 w-auto opacity-95"
          />
          {isVideo && embed ? (
            <button
              type="button"
              onClick={() => onPlay(embed)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/35"
              aria-label="Play testimonial video"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/75 text-white shadow-lg">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MediaTestimonials({ items, variant = "marketing" }: Props) {
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);

  if (!items.length) return null;

  const isCourse = variant === "course";
  const headingClass = isCourse
    ? "text-[20px] md:text-[30px] font-semibold mb-6 md:mb-8 text-gray-900"
    : "text-[30px] md:text-[40px] font-semibold mb-6 md:mb-8 text-white";

  return (
    <section className={isCourse ? "container mx-auto px-4 py-6 md:py-12" : "container mx-auto px-4 py-8"}>
      <h2 className={headingClass}>Testimonials</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <TestimonialCard item={item} onPlay={setActiveEmbed} />
          </div>
        ))}
      </div>

      {activeEmbed ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal
          onClick={() => setActiveEmbed(null)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveEmbed(null)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
            >
              Close
            </button>
            <iframe
              src={activeEmbed}
              title="Testimonial video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
