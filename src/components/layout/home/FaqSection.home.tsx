import React, { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      q: "What is included in the membership plans?",
      a: "Our membership plans include access to courses based on your tier, downloadable study materials, WhatsApp/Telegram group access for updates, certificates upon course completion, and priority support for Advanced and Premium members. Premium members also get lifetime access and 1-on-1 mentorship sessions.",
    },
    {
      q: "Can I purchase individual courses without a membership?",
      a: "Yes, individual courses can be purchased without a membership, but membership users get additional benefits and discounts.",
    },
    {
      q: "Are the courses self-paced or do they have fixed schedules?",
      a: "Most of our courses are self-paced, while some advancedbatches follow a fixed live schedule.",
    },
    {
      q: "Do I get a certificate after completing a course?",
      a: "Yes, upon successful completion of the course, you will receive a verifiable certificate.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a refund within 7 days of purchase if you haven't accessed more than 10% of the course.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<any>('');

  return (
    <section className=" w-full bg-white py-4 md:py-20 px-4 flex flex-col
      items-center text-center">
      <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1A1A1A]">Frequently
        Asked Questions</h2>
      <p className="text-[18px] md:text-[24px] text-[#454545] max-w-xl mt-2">
        Got questions? We've got answers. Find everything you need to
        know about StudyCafe.
      </p>

      <div className="w-full  mt-10 space-y-3 text-left container px-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            {/* Question Button */}
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4  transition"
            >
              <span className="font-medium text-[20px] text-black text-left">{index + 1}. {item.q}</span>

              {/* Arrow Icon */}
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-4 p-4 text-[16px] text-gray-600 leading-relaxed border-t bg-white">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}