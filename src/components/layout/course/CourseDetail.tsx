import { CourseBatch, CoursePublicDetail } from "@/types/models.types";
import { useState } from "react";
interface CourseOverviewProps {
  course?: CoursePublicDetail | null;
  batches?: CourseBatch[];
}

export default function CourseSection({
  course,
}: CourseOverviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqItems: { q: string; a: string }[] = [];
  if (course?.faqs) {
    try {
      const tempFaqs = JSON.parse(course.faqs) as { q: string; a: string }[];
      tempFaqs.forEach((faq: any) => {
        faqItems.push({ q: faq.question, a: faq.answer });
      });
    } catch {
      // Keep empty FAQ list if payload is not valid JSON.
    }
  }

  const primaryAuthor =
    course?.authors?.[0] ??
    (course?.author_name
      ? {
          user_id: course.author_user_id ?? 0,
          sort_order: 0,
          name: course.author_name,
          role: course.author_role ?? null,
          bio: course.author_bio ?? null,
          image_url: course.author_image ?? null,
        }
      : null);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Alumni Logos */}
      <div className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8 ">
        <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
          Our Alumni at Leading Companies
        </h2>

        <div className="container mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 place-items-center">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="h-[70px] sm:h-[80px] w-full max-w-[140px]
                     border p-3 sm:p-4 rounded-[10px]
                     flex items-center justify-center
                     shadow-sm bg-white"
              >
                <img
                  src={`/images/brand_${num}.svg`}
                  alt={`brand_${num}`}
                  className="h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="container mx-auto px-4 mt-10">
        <h2
          className="
            text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto
          "
        >
          About Authors
        </h2>

        <div className=" rounded p-2 md:p-3   bg-[#F9F9FB]">
          <div className="flex flex-row items-center gap-6 md:gap-4 ml-6">
            <img
              src={primaryAuthor?.image_url || "/images/author.png"}
              width={54}
              height={54}
              alt={primaryAuthor?.name || "Author"}
              className="rounded-full object-cover"
            />

            <div className="text-left">
              <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">
                {primaryAuthor?.name || "Author Name"}
              </h3>
              <h3 className="text-[#09339B] text-[16px] md:text-[20px]">
                {primaryAuthor?.role || "Author Role"}
              </h3>
            </div>
          </div>

          <hr className="m-4 border border-[#AFAFAF]" />
          <p className="text-[#6C6C6C] text-[14px] md:text-[17px] mt-1 leading-[32px] m-6 font-light">
            {primaryAuthor?.bio ||
              "Author profile will be updated soon."}
          </p>
        </div>
      </div>

      <div className="w-full bg-white  container mx-auto px-4 py-1">
        {/* FAQ Section */}
        <div className=" mx-auto md:px-4 md:mt-2">
          <h2
            className="
            text-[20px] md:text-[30px] font-semibold mb-6 md:mb-6
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto
          "
          >
            FAQ's
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                {/* Question Button */}
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className={`
                    w-full flex justify-between items-center p-4 transition
                    ${
                      openIndex === index
                        ? "bg-[#09339B] text-white" // Active
                        : "bg-white text-[#09339B]"
                    }   // Inactive
                  `}
                >
                  <span className="font-medium text-[20px] text-left">
                    {index + 1}. {item.q}
                  </span>

                  {/* Arrow Icon */}
                  <svg
                    className={`
        w-5 h-5 transition-transform 
        ${openIndex === index ? "rotate-180 text-white" : "rotate-0 text-[#09339B]"}
      `}
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
                  </svg>
                </button>

                {/* Answer */}
                {openIndex === index && (
                  <div className="px-4 pb-4 text-[16px] text-[#6C6C6C] leading-[28px] border-t p-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
