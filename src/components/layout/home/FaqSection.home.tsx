import React, { useState } from "react";
import type { FAQ } from "@/types/models.types";

const FALLBACK_FAQS: FAQ[] = [
  { id: '1', question: "What is included in the membership plans?", answer: "Our membership plans include access to courses based on your tier, downloadable study materials, WhatsApp/Telegram group access for updates, certificates upon course completion, and priority support for Advanced and Premium members." },
  { id: '2', question: "Can I purchase individual courses without a membership?", answer: "Yes, individual courses can be purchased without a membership, but membership users get additional benefits and discounts." },
  { id: '3', question: "Are the courses self-paced or do they have fixed schedules?", answer: "Most of our courses are self-paced, while some advanced batches follow a fixed live schedule." },
  { id: '4', question: "Do I get a certificate after completing a course?", answer: "Yes, upon successful completion of the course, you will receive a verifiable certificate." },
  { id: '5', question: "What is your refund policy?", answer: "We offer a refund within 7 days of purchase if you haven't accessed more than 10% of the course." },
];

interface FAQSectionProps {
  faqs?: FAQ[];
}

export default function FAQSection({ faqs: faqsProp }: FAQSectionProps) {
  const faqs = faqsProp && faqsProp.length > 0 ? faqsProp : FALLBACK_FAQS;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className=" w-full  py-4 md:py-20 px-4 flex flex-col
      items-center text-center bg-[#FAFBFB] mb-4 md:mb-0">
      <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1A1A1A]">Frequently
        Asked Questions</h2>
      <p className="text-[16px] md:text-[24px] text-[#454545] max-w-xl mt-2">
        Got questions? We've got answers. Find everything you need to
        know about StudyCafe.
      </p>

      <div className="w-full  mt-10 space-y-3 text-left container px-4">
        {faqs.map((item, index) => (
          <div key={item.id ?? index} className="border border-[#AFAFAF] rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4 transition bg-white"
            >
              <span className="font-medium text-[20px] text-black text-left bg-white">{index + 1}. {item.question}</span>
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
            {openIndex === index && (
              <div className="px-4 p-4 text-[16px] text-gray-600 leading-relaxed border-t bg-white">
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.answer }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}