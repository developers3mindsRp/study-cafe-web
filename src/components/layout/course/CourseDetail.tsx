import Image from "next/image";
import { useState } from "react";
const faqs = [
  {
    q: " Who can join this Course?",
    a: "⭐ Commerce Graduates/CA/CS/CMA/Law students ⭐ Tax professionals in job or practice ⭐ Qualified CA/CS/CMA/LLB ⭐ Semi-qualified CA/CS/CMA working in CA firms ⭐ Anyone interested"
  },
  {
    q: " What is the Duration of the Course?",
    a: "The duration varies depending on module selection."
  },
  {
    q: " Whether Course Material will be Provided?",
    a: "Yes, complete study material is provided."
  },
  {
    q: " Whether Course Recording will be Provided?",
    a: "Yes, recordings are provided for 1 year."
  },
  {
    q: " How Can we Join this Course?",
    a: "You can join directly through our course registration portal."
  }
];

export default function CourseSection() {
 const [openIndex, setOpenIndex] = useState<number | null>(null);


  const toggleAccordion = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (

   <div className="lg:col-span-2 space-y-6">
      {/* Alumni Logos */}
      <div className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-10 sm:py-12 px-4 sm:px-8 pb-16 sm:pb-20 mb-8">
        <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2">
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
            <Image
              src="/images/author.png"
              width={54}
              height={54}
              alt="Author"
              className="rounded-full"
            />

            <div className="text-left">
              <h3 className="font-semibold text-[18px] md:text-[20px] text-[#252525]">
                Pratibha Goyal
              </h3>
              <h3 className="text-[#09339B] text-[16px] md:text-[20px]">
                CA : Business
              </h3>
            </div>
          </div>

          <hr className="m-4 border border-[#AFAFAF]" />
          <p className="text-[#6C6C6C] text-[14px] md:text-[17px] mt-1 leading-[32px] m-6 font-light">
            CA Pratibha Goyal is a Chartered Accountant qualified in 2016 and a fellow Member of The Institute of Chartered Accountants of India. She possesses extensive experience in the fields of Auditing, Taxation, ROC, GST, and Secretarial matters. Beyond her core practice, she has established herself as a prominent voice in the financial community, dedicated to simplifying complex regulatory concepts. She has authored over a thousand articles and produced numerous educational videos, serving as a vital resource for staying updated on the dynamic Indian tax landscape. As an active speaker, she has delivered insightful sessions at various branches of the NIRC of ICAI, contributing significantly to the continuous professional development of her peers and the financial literacy of the public.          </p>

        </div>

      </div>


      <div className="w-full bg-white  container mx-auto px-4">
        {/* FAQ Section */}
        <div className=" mx-auto md:px-4 mt-10">
          <h2 className="
            text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4
            px-4 py-3 text-white
           
            bg-gradient-to-r from-[#253D8E] to-transparent
            md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto  md:mx-0 md:w-auto
          ">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {/* Question Button */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className={`
      w-full flex justify-between items-center p-4 transition
      ${openIndex === index
                      ? "bg-[#09339B] text-white"    // Active
                      : "bg-white text-[#09339B]"}   // Inactive
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Answer */}
                {openIndex === index && (
                  <div className="px-4 pb-4 text-[16px] text-[#454545] leading-relaxed border-t ">
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
