import Image from "next/image";

export default function CourseSection() {
  return (

   <div className="lg:col-span-2 space-y-6">
        <div className="w-full bg-white py-10 container mx-auto px-4">
      {/* Alumni Logos */}
      <div className=" mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6">
          Our Alumni at Leading Companies
        </h2>
<div className="flex flex-wrap items-center gap-6">
  {[1, 2, 3, 4, 5, 6].map((num) => {
    return (
      <div
        key={num}
        className="h-[80px] w-[125px] border p-2 rounded flex items-center justify-center shadow-sm"
      >
        <img
          src={`/images/brand_${num}.svg`}
          alt={`brand_${num}`}
          className="h-full object-contain"
        />
      </div>
    );
  })}
</div>

      </div>

      {/* FAQ Section */}
      <div className=" mx-auto px-4 mt-10">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>

        <div className="space-y-4">
          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              1. Who can join this Course?
            </summary>
            <p className="mt-2 text-gray-700">
              ⭐ Commerce Graduates/CA/CS/CMA/Law students ⭐ Tax professionals in
              job or practice ⭐ Qualified CA/CS/CMA/LLB ⭐ Semi-qualified
              CA/CS/CMA working in CA firms ⭐ Anyone interested
            </p>
          </details>

          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              2. What is the Duration of the Course?
            </summary>
            <p className="mt-2 text-gray-700">
              The duration varies depending on module selection.
            </p>
          </details>

          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              3. Whether Course Material will be Provided?
            </summary>
            <p className="mt-2 text-gray-700">
              Yes, complete study material is provided.
            </p>
          </details>

          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              4. Whether Course Recording will be Provided?
            </summary>
            <p className="mt-2 text-gray-700">
              Yes, recordings are provided for 1 year.
            </p>
          </details>

          <details className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              5. How Can we Join this Course?
            </summary>
            <p className="mt-2 text-gray-700">
              You can join directly through our course registration portal.
            </p>
          </details>
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

        <div className="border rounded p-5 flex items-start gap-4 shadow">
          <Image
            src="/images/author.svg"
            width={104}
            height={104}
            alt="Author"
            className="rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[20px] text-[#252525]">Pratibha Goyal</h3>
            
           <h3 className="text-[#929292] mb-2">   CA : Business  </h3>
           <p className="text-[#929292] text-[16px] mt-1">
             CA Pratibha Goyal is Chartered Accountant qualified in 2016, is a Member of The Institute of Chartered Accountants of India having wide experience in the field of Auditing, Taxation, ROC, GST and Secretarial matters etc. She has written over a thousand articles & has made several videos on topics related to Auditing & Taxation. As a Speaker she has delivered various sessions on various branches of NIRC of ICAI.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
}
