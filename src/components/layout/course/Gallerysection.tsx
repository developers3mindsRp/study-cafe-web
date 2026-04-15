const DEFAULT_IMAGES = ['/images/g1.png', '/images/g2.png', '/images/g3.png', '/images/g4.png'];

export default function Gallery({
  showHeading = true,
  images,
}: {
  showHeading?: boolean;
  /** When set (e.g. from About CMS), replaces default gallery images. */
  images?: string[];
}) {
  const items = images && images.length > 0 ? images : DEFAULT_IMAGES;
  const testimonials = items.map((src) => ({ images: src }));

  return (
    <section className="bg-white py-4 mt-4">
      {showHeading && (
        <h2
          className="text-[20px] md:text-[40px] font-medium 
        text-white md:text-gray-900
        bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none 
        px-4 md:px-8 md:container md:mx-auto 
        py-3 md:py-0 mx-4 md:mx-0"
        >
          Gallery
        </h2>
      )}

      <div>
        <div className="marquee-wrapper mt-6 md:mt-10">
          <div className="marquee gap-6">
            {[...testimonials, ...testimonials].map((item, index) => (
              <div key={`${item.images}-${index}`} className="flex-shrink-0">
                <img
                  src={item.images}
                  alt=""
                  className="w-[350px] md:w-[350px] h-[350px] md:h-[350px] object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
