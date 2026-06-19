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

export default function MediaTestimonials({
  items,
  variant = "marketing",
}: Props) {
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);

  if (!items.length) return null;

  const isCourse = variant === "course";

  const headingClass = isCourse
    ? "text-[20px] md:text-[30px] font-semibold mb-6 md:mb-8 text-gray-900 text-center uppercase"
    : "text-[30px] md:text-[40px] font-semibold mb-6 md:mb-8 text-white text-center uppercase";

  return (
    <section
      className="pb-10"
    >
      <h2 className={headingClass}>Testimonials</h2>

      {/* Mobile Slider */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:hidden px-2 scrollbar-hide mb-12">
        {items.map((item) => {
          const isVideo =
            item.mediaType === "video" && !!item.videoUrl?.trim();

          const embed = isVideo
            ? youtubeEmbed(item.videoUrl || "")
            : null;

          return (
            <div
              key={item.id}
              className="w-[250px] snap-center flex-shrink-0 text-left"
            >
              <div className="mt-6 relative flex items-center justify-between">
                {/* IMAGE */}
                <img
                  src={item.mediaUrl}
                  alt={item.title || ""}
                  className="object-contain w-full h-[210px] rounded-lg"
                />

                {/* PLAY BUTTON ONLY FOR VIDEO */}
                {isVideo && embed && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <button
                      onClick={() => setActiveEmbed(embed)}
                      className="bg-black w-12 h-12 flex items-center justify-center rounded-full"
                    >
                      <span className="text-white text-[20px]">▶</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Marquee */}
      <div className="hidden md:block overflow-hidden relative">
        <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] w-max">
          {[...items, ...items].map((item, index) => {
            const isVideo =
              item.mediaType === "video" && !!item.videoUrl?.trim();

            const embed = isVideo
              ? youtubeEmbed(item.videoUrl || "")
              : null;

            return (
              <div
                key={index}
                className="md:min-w-[350px] xl:min-w-[460px] relative"
              >
                <div className="mt-6 relative flex items-center justify-between">
                  {/* IMAGE */}
                  <img
                    src={item.mediaUrl}
                    alt={item.title || ""}
                    className="object-cover w-full h-[280px] rounded-lg"
                  />

                  {/* PLAY BUTTON ONLY FOR VIDEO */}
                  {isVideo && embed && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                      <button
                        onClick={() => setActiveEmbed(embed)}
                        className="bg-black w-16 h-16 flex items-center justify-center rounded-full"
                      >
                        <span className="text-white text-[30px]">▶</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIDEO MODAL */}
      {activeEmbed && (
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
      )}

      {/* CUSTOM CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}