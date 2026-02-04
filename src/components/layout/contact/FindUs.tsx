export default function MapSection() {
  return (
    <section className="bg-white py-14 px-4">
      <div className="container px-4 mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-[48px] md:text-[62px] font-semibold text-[#09339B]">
            Find Us on the Map
          </h2>
          <p className="text-[#252525] mt-2 text-[18px] md:text-[26px]">
            Visit our office for in-person consultations or pick up your course materials.
          </p>
        </div>

        {/* Map Container */}
        <div className="rounded-xl overflow-hidden border shadow-sm border-[#9FBBFF]">
          <iframe
            src="https://www.google.com/maps?q=StudyCafe+Nehru+Place&output=embed"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
}
