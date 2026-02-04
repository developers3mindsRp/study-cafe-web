import Image from "next/image";

export default function SidebarBlog() {
  return (
          <div className="space-y-5 sticky top-24">
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
  );
}
