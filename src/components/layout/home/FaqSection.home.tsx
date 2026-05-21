import React, { useState } from "react";
import type { FAQ } from "@/types/models.types";
import { motion, AnimatePresence } from "framer-motion";

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

  const cleanHTML = (html: string) => {
    return html
      .replace(/<p>\s*<\/p>/g, "")          // empty <p>
      .replace(/<p><br\s*\/?><\/p>/g, "")   // <p><br></p>
      .replace(/(<br\s*\/?>\s*)+$/g, "");   // ending <br>
  };


  return (
    <section className=" w-full  py-4 md:py-20 px-4 flex flex-col
      items-center text-center bg-[#FAFBFB] mb-4 md:mb-0">
      <h2 className="text-[32px] xl:text-[40px] font-semibold text-[#1A1A1A]">Frequently
        Asked Questions</h2>
      <p className="text-[16px] xl:text-[24px] text-[#454545] max-w-xl mt-3">
        Got questions? We've got answers. Find everything you need to
        know about StudyCafe.
      </p>

      <div className="w-full mt-10 space-y-3 text-left container px-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.id ?? index}
              className="border border-[#AFAFAF] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-start gap-3 p-4 bg-white"
              >
                <span className="flex-1 font-medium md:text-[18px] xl:text-[20px] text-black text-left leading-[140%]">
                  {index + 1}. {item.question}
                </span>

                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 xl:text-[16px] text-[#3a3c3e] leading-relaxed border-t bg-white">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: cleanHTML(item.answer) }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
