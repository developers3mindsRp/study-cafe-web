import Image from "next/image";

export default function HeroSection_blog() {
  return (
    <div className="min-h-screen  container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="container  mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>

   

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Course Start Time */}
          <p className=" bg-[#F9F9FB] w-[379px] p-2 text-[#454545] font-[400px] font-Outfit font-[16px]">
            <strong>Starts at Thursday November 27, 2025 – 18:00</strong>
          </p>

          {/* Title */}
          <h1 className="text-[30px] font-medium text-gray-900 leading-snug">
            Debt Mutual Funds for Monthly Income: How It Works?
          </h1>

          {/* Description */}
          <p className="text-[#929292] text-[16px] leading-relaxed">
          For many investors, especially retirees or those seeking regular cash flow, generating steady monthly income from investments is a key financial goal. While fixed deposits, government savings schemes, or annuities are traditional options, debt funds have increasingly become a popular alternative. They offer the potential for stable returns, liquidity, and tax efficiency — all while providing the flexibility to structure monthly income through specific strategies.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF]">
            <span>Meetu Kumari</span>
            <span>Nov 18,2025</span>
           
          </div>

 

          {/* Banner Image */}
          <div className="rounded overflow-hidden shadow">
            <Image
              src="/images/b4.png"
              alt="Banner"
              width={1200}
              height={600}
              className="w-full"
            />
          </div>


        </div>

        {/* SIDEBAR */}

    
   
    </div>
  );
}
