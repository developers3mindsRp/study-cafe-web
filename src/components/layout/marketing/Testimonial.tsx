"use client";

import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

function youtubeEmbed(url: string, autoplay = true): string | null {
  if (!url?.trim()) return null;
  let id = "";
  if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1]?.split(/[?&#]/)[0] ?? "";
  } else if (url.includes("youtube.com")) {
    const m = url.match(/[?&]v=([^&]+)/);
    id = m?.[1] ?? "";
  }
  if (!id) return null;
  const params = autoplay ? "?autoplay=1&mute=1&playsinline=1&rel=0" : "";
  return `https://www.youtube.com/embed/${id}${params}`;
}

const Testimonials_marketing = ({ data }: Props) => {
  const videos = data.videoTestimonials;
  if (!videos.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-center text-[30px] md:text-[40px] mb-8 uppercase">Testimonials</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {videos.map((item, index) => {
          const embed = youtubeEmbed(item.url, true);
          return (
            <div
              key={index}
              className="min-w-[280px] md:min-w-[360px] flex-shrink-0 relative rounded-lg overflow-hidden aspect-video bg-black"
            >
              {embed ? (
                <iframe
                  src={embed}
                  title={`Testimonial ${index + 1}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials_marketing;
