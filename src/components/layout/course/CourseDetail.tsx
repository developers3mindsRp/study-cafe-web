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
        <div className="w-full bg-white py-10 container mx-auto px-4">
      {/* Alumni Logos */}
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
  {[1, 2, 3, 4, 5, 6].map((num) => (
    <div
      key={num}
      className="h-[80px] w-full border p-2 rounded flex items-center justify-center shadow-sm bg-white"
    >
      <img
        src={`/images/brand_${num}.svg`}
        alt={`brand_${num}`}
        className="h-full object-contain"
      />
    </div>
  ))}
</div>


      {/* FAQ Section */}
      <div className=" mx-auto md:px-4 mt-10">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
      <div className="space-y-4">
      {faqs.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            {/* Question Button */}
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4  transition"
            >
              <span className="font-medium text-[20px] text-[#252525] text-left">{index + 1}. {item.q}</span>

              {/* Arrow Icon */}
              <svg
                className={`w-5 h-5 transition-transform ${openIndex=== index ? "rotate-180" : "rotate-0"}`}
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
              <div className="px-4 pb-4 text-[16px] text-[#454545] leading-relaxed border-t bg-white">
                {item.a}
              </div>
            )}
          </div>
        ))} 
    </div>
      </div>

      {/* Terms */}
      <div className=" mx-auto px-4 mt-10">
        <h2 className="text-xl font-semibold mb-2">Terms and Conditions</h2>
        <ul className="text-gray-700 list-disc ml-6">
          <li>Course Recording will be Provided for 1 Year.</li>
          <li>No limitation on number of views.</li>
        </ul>
      </div>

      {/* Requirements */}
      <div className=" mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        <p className="text-gray-700">
          Required internet connection. Lectures can be viewed on Mobile or Laptop.
        </p>
      </div>

    {/* Author Section */}
    <div className="container mx-auto px-4 mt-10">
      <h2 className="text-xl font-semibold mb-4">About Authors</h2>

      <div className="border rounded p-2 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow">
        <Image
          src="/images/author.svg"
          width={104}
          height={104}
          alt="Author"
          className="rounded-full mx-auto md:mx-0"
        />

        <div className="text-center md:text-left ">
          <h3 className="font-semibold text-[20px] text-[#252525]">Pratibha Goyal</h3>
          <h3 className="text-[#929292] mb-2">CA : Business</h3>
          <p className="text-[#929292] text-[14px] md:text-[16px] mt-1 ">
            CA Pratibha Goyal is Chartered Accountant qualified in 2016, is a Member of The Institute of Chartered Accountants of India having wide experience in the field of Auditing, Taxation, ROC, GST and Secretarial matters etc. She has written over a thousand articles & has made several videos on topics related to Auditing & Taxation. As a Speaker she has delivered various sessions on various branches of NIRC of ICAI.
          </p>
        </div>
      </div>
    </div>

    </div>
  </div>

  );
}
