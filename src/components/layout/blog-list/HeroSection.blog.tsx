import Image from "next/image";

export default function HeroSection_blog() {
  return (
    <div className="min-h-screen  container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="container  mx-auto px-4 py-3 text-sm text-gray-500 bg-[#DDDDDD]">
        Home › Courses › <span className="text-blue-600">Certification Course On…</span>
      </div>

      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-10 mt-6">

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
        <div className="space-y-5">
          {/* Pricing Card */}
        

          {/* Certificate Card */}
          <div className="bg-white shadow rounded p-5 space-y-3">
            <p className="font-medium text-[20px]">Recent Posts</p>
            <Image
              src="/images/fund.png"
              alt="Certificate"
              width={500}
              height={300}
              className="rounded"
            />
            <p className="text-[20px]">Certificate to be provided to all the participants.</p>
          </div>

          <div className="bg-white shadow rounded p-5 space-y-3">
      
            <Image
              src="/images/car.png"
              alt="Certificate"
              width={500}
              height={300}
              className="rounded"
            />
            <p className="text-[20px]">Rich Wont Tell You Secret to Buy a Car for Free</p>
          </div>

          <div className="bg-white shadow rounded p-5 space-y-3">
           
            <Image
              src="/images/plant.png"
              alt="Certificate"
              width={500}
              height={300}
              className="rounded"
            />
            <p className="text-[20px]">A Simple Way to Build Rs.1 Crore: The 15-15-15 Rule Explained</p>
          </div>

          <div className="bg-white shadow rounded p-5 space-y-3">
            <h4 className="text-[20px] font-medium mb-4" >Tags</h4>
          <div className="flex gap-4 text-[18px]">
                <p>Mutual Funds</p>
            <p>Finance</p>
          </div>
          </div>

          {/* Contact Box */}
          <div className=" rounded p-5 space-y-4">
            <div className="bg-[#09339B] shadow rounded p-5 space-y-6 text-white text-center ">
                <h2 className="text-[20px] font-bold">StudyCafe Membership</h2>
                <p className="text-[18px] ">For More details about Membership Click Join Membership Button</p>
                <button className="pl-10 pr-10 p-2 bg-white text-[#09339B] text-[20px] rounded">View Membership</button>
            </div>
            <p className="font-medium text-[#929292] text-[16px]">Join Studycafe's WhatsApp Group or Telegram Channel for Latest Updates on Government Job, Sarkari Naukri, Private Jobs, Income Tax, GST, Companies Act, Judgements and CA, CS, ICWA, and MUCH MORE!"</p>
           



            <div className="block w-full  border border-[#34C759] text-[#34C759] py-3 rounded font-semibold flex justify-center gap-4">
               <img src="/images/whatsapp.png" alt="" width="25" height="20" className=""/>
            <a
              href="https://wa.me/919625080264" className=" ">
             Join WhatsApp Group
            </a>
            </div>

                       <div className="block w-full text-center border border-[#039BE5] text-[#039BE5] py-3 rounded font-semibold flex justify-center gap-4">
             <img src="/images/telegram.png" alt="" width="20" height="20"/>
            <a
              href="tel:+919625080264"
              className=""
            >
            Join Telegram Group
            </a>
           </div>

            <div className="block w-full  border border-[#252525] text-[#252525] py-3 rounded font-semibold flex justify-center gap-4">
               <img src="/images/google.png" alt="" width="25" height="20" className=""/>
            <a
              href="https://wa.me/919625080264" className=" ">
             Follow On Google News
            </a>
            </div>
          </div>
        </div>
      </div>
   
    </div>
  );
}
