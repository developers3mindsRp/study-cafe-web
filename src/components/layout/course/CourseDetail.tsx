import { CourseBatch, CoursePublicDetail } from "@/types/models.types";
import { useState } from "react";

export interface AlumniLogo {
  name?: string;
  logo_url?: string;
  link?: string;
}

interface CourseOverviewProps {
  course?: CoursePublicDetail | null;
  batches?: CourseBatch[];
  alumniLogos?: AlumniLogo[];
}

export default function CourseSection({
  course,
  alumniLogos = [],
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

  const termsConditions = course?.terms_conditions
  ? JSON.parse(course.terms_conditions)
  : [];
  // const requirements = course?.requirements
  // ? JSON.parse(course.requirements)
  // : [];

   const requirements = course?.requirements;

  const featuredinlogos = course?.featured_in_logos



  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Alumni Logos */}
      {alumniLogos.length > 0 && (
        <div className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8">
          <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
            Our Alumni at Leading Companies
          </h2>

          <div className="container mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 place-items-center">
              {alumniLogos.map((logo, idx) => {
                const card = (
                  <div
                    key={idx}
                    className=" w-full max-w-full
                         border p-3 sm:p-4 rounded-[10px]
                         flex items-center justify-center
                         shadow-sm bg-white"
                  >
                    {logo.logo_url ? (
                      <img
                        src={logo.logo_url}
                        alt={logo.name || `Company ${idx + 1}`}
                       className="h-12 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 text-center">{logo.name}</span>
                    )}
                  </div>
                );
                return logo.link ? (
                  <a key={idx} href={logo.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    {card}
                  </a>
                ) : card;
              })}
            </div>
          </div>
        </div>
      )}

   

      {/* Author Section */}

      {
        primaryAuthor?.name && 
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
            <div className="w-[100px] h-[100px] rounded-full relative overflow-hidden">
              {
                primaryAuthor?.image_url ?
                <img
                  src={primaryAuthor?.image_url || ""}
                 
                  alt={primaryAuthor?.name || "Author"}
                  className="absolute w-full h-full left-0 top-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = ""; }}
                />
                :
                <img
                  src="/images/defultuser.png"
                 
                  alt={primaryAuthor?.name || "Author"}
                  className="absolute w-full h-full left-0 top-0"
                  
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = ""; }}
                />

              }
            </div>
            
            

            <div className="text-left">
              <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">
                {primaryAuthor?.name}
              </h3>
              <h3 className="text-[#09339B] text-[16px] md:text-[20px]">
                {primaryAuthor?.role}
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
      }
      

      {faqItems.length > 0 && (
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
                    ${openIndex === index
                        ? "bg-[#09339B] text-white" // Active
                        : "bg-white text-[#09339B]"
                      }   // Inactive
                  `}
                  >
                    <span className="font-medium text-[20px] text-left">
                      {index + 1}. {item.q}
                    </span>

                    {/* Arrow Icon */}
         <div className="w-8 h-8 min-w-8 flex items-center justify-center">
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            openIndex === index ? "rotate-180" : "rotate-0"
          }`}
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
      </div>
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
      )}

 {featuredinlogos.length > 0 && (
        <div className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8">
          <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
            Featured In
          </h2>

          <div className="container mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 place-items-center">
              {featuredinlogos.map((logo:any, idx:any) => {
                const card = (
                  <div
                    key={idx}
                          className=" w-full max-w-full h-full
                              border p-3 sm:p-4 rounded-[10px]
                              flex items-center justify-center
                              shadow-sm bg-white"
                  >
                    {logo.logo_url ? (
                      <img
                        src={logo.logo_url}
                        alt={logo.name || `Company ${idx + 1}`}
                        className="h-auto max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 text-center">{logo.name}</span>
                    )}
                  </div>
                );
                return logo.link ? (
                  <a key={idx} href={logo.link} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                    {card}
                  </a>
                ) : card;
              })}
            </div>
          </div>
        </div>
      )}
       {termsConditions.length > 0 && (
          <div className=" container mx-auto px-4 py-10 ">
            <h2   className="
                text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
                px-4 py-3 text-white
              
                bg-gradient-to-r from-[#253D8E] to-transparent
                md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto
              ">
              Terms & Conditions
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              {termsConditions.map(
                (item: { title: string }, index: number) => (
                  <li key={index}  dangerouslySetInnerHTML={{ __html: item.title }}></li>
                )
              )}
            </ul>
          </div>
        )}

         {requirements && (
          <div className=" container mx-auto px-4 py-10 pt-2">
            <h2   className="
                text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
                px-4 py-3 text-white
              
                bg-gradient-to-r from-[#253D8E] to-transparent
                md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto
              ">
              Requirements
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              
               
                  <li>{requirements}</li>
               
            </ul>
          </div>
        )}
    </div>
  );
}
