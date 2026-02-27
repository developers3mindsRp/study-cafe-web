import React from 'react'

const PaymentSuccess = () => {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-10 md:py-16">

      <div className="border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-8 md:py-12 rounded-[10px]">

        {/* Top Section */}
        <div className="text-center">
          <img src="/images/success.png" alt="" className="mx-auto w-20 md:w-auto" />

          <h1 className="text-2xl md:text-[40px] font-semibold mt-4">
            Payment Successful!
          </h1>

          <p className="text-sm md:text-[16px] text-[#929292] mt-2">
            Your payment has been processed successfully
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-4 md:p-6 bg-[#F9F9FB] w-full md:max-w-[650px] mx-auto space-y-4 mt-8 md:mt-12 rounded-lg">

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">
              Transaction ID
            </h1>
            <p className="text-sm md:text-base break-all">#4884DGYS8</p>
          </div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">
              Course
            </h1>
            <p className="text-sm md:text-base text-right md:text-left max-w-[65%] md:max-w-none">
              Certification Course On Practical Filing of GSTR-9 & GSTR-9C
            </p>
          </div>

          <div className="border-t border-[#E0E0E0]"></div>

          <div className="flex justify-between flex-wrap gap-2">
            <h1 className="text-[#AFAFAF] text-sm md:text-base">
              Amount Paid
            </h1>
            <p className="text-sm md:text-base font-semibold">
              ₹7,559
            </p>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-8 md:mt-10 text-center px-4">

          <p className="text-[#929292] text-sm md:text-[18px] leading-relaxed">
            You'll be redirected automatically in{" "}
            <span className="text-[#09339B] font-semibold">
              10 seconds.
            </span>
            <br />
            Please keep this screen open.
          </p>

          <button className="w-full sm:w-auto mt-6 bg-[#34C759] hover:bg-white px-8 md:px-16 py-3 text-white hover:text-[#34C759] border border-[#34C759] rounded-[10px] transition">
            Go to WhatsApp Group
          </button>

        </div>

      </div>

    </div>

  )
}

export default PaymentSuccess
