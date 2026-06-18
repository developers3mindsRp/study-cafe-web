import type { ContactPageData } from "@/lib/contact-page-data";

type Props = Pick<ContactPageData, "address" | "mapTitle" | "mapDescription">;

export default function MapSection({ address, mapTitle, mapDescription }: Props) {
  const q = address.trim() || "StudyCafe Nehru Place";

  return (
    <section className="bg-white px-4 py-4 mb-6">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-[30px] font-semibold text-[#09339B] md:text-[40px]">{mapTitle}</h2>
          <p className="mt-2 text-[18px] text-[#252525] md:text-[26px]">{mapDescription}</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#9FBBFF] shadow-sm">
          <iframe
            title="Office location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`}
            width="100%"
            height={320}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
