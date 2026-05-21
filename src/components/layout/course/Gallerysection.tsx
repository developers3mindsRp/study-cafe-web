import { resolveImageUrl } from '@/lib/parseCourseContent';

const DEFAULT_IMAGES = ['/images/g1.png', '/images/g2.png', '/images/g3.png', '/images/g4.png'];

type GalleryVariant = 'course' | 'marketing';

export default function Gallery({
  showHeading = true,
  images,
  variant = 'course',
  heading = 'Gallery',
}: {
  showHeading?: boolean;
  images?: string[];
  variant?: GalleryVariant;
  heading?: string;
}) {
  const items = images?.filter(Boolean).length ? images!.filter(Boolean) : DEFAULT_IMAGES;

  if (variant === 'marketing' && (!images || images.length === 0)) {
    return null;
  }

  if (variant === 'marketing') {
    return (
      <section className="py-8 md:py-12">
        {showHeading && (
          <h2 className="mb-6 text-center text-[30px] font-semibold uppercase text-white md:mb-8 md:text-[40px]">
            {heading}
          </h2>
        )}
        <div className="marquee-wrapper px-4">
          <div className="marquee gap-4 md:gap-6">
            {[...items, ...items].map((src, index) => (
              <div key={`${src}-${index}`} className="flex-shrink-0">
                <img
                  src={resolveImageUrl(src)}
                  alt=""
                  className="h-[200px] w-[280px] rounded-lg object-cover md:h-[240px] md:w-[320px]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4 bg-white py-4">
      {showHeading && (
        <h2
          className="mx-4 bg-gradient-to-r from-[#253D8E] to-transparent px-4 py-3 text-[20px] font-medium text-white md:container md:mx-auto md:bg-none md:px-8 md:py-0 md:text-[40px] md:text-gray-900"
        >
          {heading}
        </h2>
      )}

      <div className="marquee-wrapper mt-6 md:mt-10">
        <div className="marquee gap-6">
          {[...items, ...items].map((src, index) => (
            <div key={`${src}-${index}`} className="flex-shrink-0">
              <img
                src={resolveImageUrl(src)}
                alt=""
                className="h-[350px] w-[350px] rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
