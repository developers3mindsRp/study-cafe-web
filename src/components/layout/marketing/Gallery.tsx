import Image from "next/image";
import type { ResolvedMarketingPage } from "@/lib/marketing/types";

interface Props {
  data: ResolvedMarketingPage;
}

const Gallery_marketing = ({ data }: Props) => {
  const images = data.galleryImages;
  if (!images.length) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-center text-[30px] md:text-[40px] mb-8 uppercase">Photo Gallery</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {images.map((src, index) => (
          <div key={index} className="min-w-[200px] flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={`Gallery ${index + 1}`}
              width={240}
              height={160}
              className="w-[240px] h-[160px] object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery_marketing;
