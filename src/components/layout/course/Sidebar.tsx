import Image from "next/image";

export default function SidebarCourseCard() {
  return (
    <div className="space-y-5 sticky top-24">
      
      {/* Pricing Card */}
      <div className="bg-white shadow rounded p-5 space-y-4">
        <p className="text-center text-[30px]">
          <span className="line-through text-[#929292] font-medium">₹2,000</span>{" "}
          <span className="text-3xl text-black font-bold">₹699</span>
        </p>

        <p className="text-[#929292] text-center ">
          Hurry up, few days left at this price!
        </p>

        <button
          className="w-full bg-[#09339B] text-white py-3 rounded font-semibold"
          onClick={() => (window.location.href = "/payment-screen")}
        >
          Buy Now
        </button>

        <button className="w-full border border-[#09339B] text-[#09339B] py-3 rounded font-semibold">
          View Membership
        </button>

        <div className="pt-3 space-y-2">
          <p className="font-medium">This course includes:</p>

          <div className="flex items-center gap-2 text-[#696969]">
            <img src="/images/icon-video.png" alt="" />
            Recording is available for 1 year
          </div>

          <div className="flex items-center gap-2 text-[#696969]">
             <img src="/images/icon-certiificate.png" alt="" />
            StudyCafe certificate of completion
          </div>

          <div className="flex items-center gap-2 text-[#696969]">
            <img src="/images/icon-laptop.png" alt="" />
            Access on laptop or mobile
          </div>
        </div>
      </div>

      {/* Certificate Card */}
      <div className="bg-white shadow rounded p-5 space-y-3">
        <p className="font-medium">Certificate to be provided to all the participants.</p>

        <Image
          src="/images/certificate.svg"
          alt="Certificate"
          width={500}
          height={300}
          className="rounded"
        />
      </div>

      {/* Contact Box */}
      <div className="rounded p-5 space-y-4">
        <p className="font-medium">In case of any Query Call us or WhatsApp</p>

        <div className="w-full bg-[#09339B] text-white py-3 rounded font-semibold flex justify-center gap-4">
          <img src="/images/call.png" alt="" width="20" height="20" />
          <a href="tel:+919625080264">+91 9625080264</a>
        </div>

        <div className="w-full border border-[#34C759] text-[#34C759] py-3 rounded font-semibold flex justify-center gap-4">
          <img src="/images/whatsapp.png" alt="" width="25" height="20" />
          <a href="https://wa.me/919625080264">WhatsApp</a>
        </div>
      </div>

    </div>
  );
}
