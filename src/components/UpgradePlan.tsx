export default function UpgradePlan() {
    return (
        <section className="container mx-auto px-4 py-10">

            {/* Header */}
            <h1 className="text-[36px] font-semibold">Upgrade My Plan</h1>
            <p className="text-[18px] text-[#6B7280] mt-2">
                Unlock premium features and expand your learning potential.
            </p>

            {/* Main Card */}
            <div className="border border-[#9FBBFF] rounded-xl p-6 mt-6 bg-white">

                <div className="grid md:grid-cols-[2fr_1fr] gap-6">


                    {/* LEFT SIDE */}
                    <div className="space-y-4">

                        {/* Current Plan */}
                        <div className="flex justify-between items-center bg-[#F9FAFC] border border-[#E2E8F0] rounded-lg p-4">

                            <div>
                                <p className="text-xs text-gray-400">CURRENT PLAN</p>
                                <h3 className="text-lg font-semibold mb-2">Advanced</h3>
                                <p className="text-sm text-gray-500">(Bought at ₹4,799)</p>
                                <p className="text-sm text-[#334155] mt-1">
                                    Thursday, Oct 11, 2025
                                </p>
                            </div>

                            <div className="text-right md:px-12">
                                <p className="text-xs text-[#64748B] mb-2">EXPIRES ON</p>
                                <p className="text-sm text-[#334155]">
                                    Thursday, Oct 11, 2035
                                </p>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg p-4">

                            {/* Top Row */}
                            <div className="flex items-center gap-2">
                                <img src="/images/limit.svg" alt="limit icon" className="w-5 h-5" />
                                <h2 className="text-[16px] font-medium text-[#991B1B]">
                                    Upgrade Limitation
                                </h2>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-[#991B1B] mt-2">
                                You can only upgrade your membership to Premium Plan as you are an Advanced Member.
                            </p>
                        </div>

                        {/* Credit */}
                        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex justify-between items-center">

                            {/* Left Content */}
                            <div className="flex items-center gap-3">

                                {/* Icon */}
                                <img
                                    src="/images/pro-data.svg"
                                    alt="pro data"
                                    className="w-10 h-10"
                                />

                                {/* Text */}
                                <div>
                                    <p className="text-sm text-[#64748B]">
                                        Pro Data Credit of Previous Plan
                                    </p>
                                    <p className="text-[18px] font-semibold text-[#1F53BD]">
                                        ₹4,694
                                    </p>
                                </div>
                            </div>

                            {/* Badge */}
                            <span className="bg-green-100 text-[#16A34A] text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                                APPLIED
                            </span>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="bg-[#F9FAFC] border border-[#E2E8F0] rounded-lg p-5 space-y-4 ">

                        {/* Dropdown */}
                        <div>
                            <p className="text-sm font-medium mb-1 text-[#334155]">Select Membership</p>
                            <select className="w-full border border-gray-300 rounded-lg p-2 text-sm ">
                                <option>Premium Membership @ Rs 29999</option>
                            </select>
                        </div>

                        {/* Payment Summary */}
                        <div>
                            <p className="text-sm font-semibold mb-2">PAYMENT SUMMARY</p>

                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Premium Plan (24 Months)</span>
                                <span className="line-through">₹29,999</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-green-600 mt-1">

                                {/* Left side (icon + text) */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/images/credit-data.svg"
                                        alt="credit"
                                        className="w-4 h-4"
                                    />
                                    <span>Pro Rata Credit</span>
                                </div>

                                {/* Right side (amount) */}
                                <span>₹4,694</span>
                            </div>


                            <div className="border-t my-3"></div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Final Payable</span>
                                <span className="text-xl font-bold text-[#1F53BD] ">
                                    ₹25,305
                                </span>
                            </div>

                            <p className="text-xs text-gray-400 text-right mt-2">
                                Inclusive of all taxes
                            </p>
                        </div>

                        {/* Buttons */}
                        <button className="w-full bg-[#09339B] text-white py-2 rounded-lg hover:bg-blue-800 transition">
                            Pay Now →
                        </button>

                        <button className="w-full border border-[#09339B] py-2 rounded-lg text-[#09339B] hover:bg-[#09339B] hover:text-white transition flex items-center justify-center gap-2">

                            <img
                                src="/images/contact-us.svg"
                                alt="contact"
                                className="w-4 h-4"
                            />

                            Contact Us
                        </button>

                    </div>

                </div>
            </div>
        </section>
    );
}
