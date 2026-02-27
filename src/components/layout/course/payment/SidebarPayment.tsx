import { useState } from "react";
import { X } from "lucide-react";

export default function PriceCard() {
  const [coupon, setCoupon] = useState("STUDY50");
  const [applied, setApplied] = useState(true);
  const [openCoupon, setOpenCoupon] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* ===== IF COUPON OPEN ===== */}
      {openCoupon ? (
        <div className="bg-[#F9F9FB] rounded-xl  p-6 ">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setOpenCoupon(false)}
              className="w-8 h-8 rounded-[10px] bg-white border  flex items-center justify-center"
            >
              <img src="/images/arrow-left-b.png" alt="" />
            </button>
            <h3 className="font-medium text-[20px]">Offers for you</h3>
          </div>
          <div className="border-t border-[#AFAFAF] mb-6"></div>

          {/* Coupon 1 */}
          <div className=" pb-4 mb-4">
            <p className="font-semibold text-sm mb-1">GET 30% OFF</p>
            <div className="flex items-center justify-between ">
              <h3>USE CODE :</h3>
              <div className="border border-dotted border-black rounded-lg p-2 flex gap-4 bg-[#F2F2F2]">
                <span className="font-medium">STUDY30</span>
                <div className="bg-white flex gap-2 px-1 rounded-md">
                  <button className="text-sm text-gray-500 bg-white">
                    Copy Code
                  </button>
                  <img src="/images/copy.png" alt="" className="w-4 h-4 mt-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black mb-4"></div>

          {/* Coupon 2 */}
          <div className=" pb-4 mb-4">
            <p className="font-semibold text-sm mb-1">GET 25% OFF</p>
            <div className="flex items-center justify-between  rounded-lg p-2">
              <h3>USE CODE :</h3>
              <div className="border border-dotted border-black rounded-lg p-2 flex gap-4 bg-[#F2F2F2]">
                <span className="font-medium">LEARN25</span>
                <div className="bg-white flex gap-2 px-1 rounded-md">
                  <button className="text-sm text-gray-500 bg-white">
                    Copy Code
                  </button>
                  <img src="/images/copy.png" alt="" className="w-4 h-4 mt-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black mb-4"></div>

          {/* Apply manually */}
          <div className="mt-4">
            <p className="text-sm mb-2">Apply Coupon</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="border rounded-lg p-2 flex-1"
              />
              <button className="bg-[#09339B] text-white px-4 rounded-lg">
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===== NORMAL PRICE CARD ===== */
        <div className="bg-[#F9F9FB] rounded-xl  p-6 ">
          {/* Price */}
          <div className="text-center">
            <p className="text-[30px] md:text-[40px] font-semibold text-[#1A1A1A]">
              <span className="line-through text-gray-400 text-[20px] md:text-[30px] mr-2">
                ₹2,000
              </span>
              ₹699
            </p>
            <p className="text-[#929292] text-[16px] mt-3">
              Hurry up, few days left at this price!
            </p>
          </div>

          <div className="border-t border-[#AFAFAF] mt-6"></div>

          {/* Summary */}
          <div className="mt-6 space-y-2 text-sm">
            <h2 className="text-[20px] text-[#252525] font-medium mb-4">
              Summary
            </h2>
            <div className="flex justify-between">
              <span>Amount</span>
              <span>₹699</span>
            </div>
            <div className="flex justify-between">
                <span>STUDY30</span>
              <span className="text-green-600">-₹180</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="">₹519</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹125.82</span>
            </div>
          </div>

          <div className="border-t border-[#AFAFAF] mt-4"></div>

          <div className="pt-3 flex justify-between font-semibold text-[17px]">
            <span className="text-[20px] text-[#252525] font-medium">
              Grand Total
            </span>
            <span>₹531.82</span>
          </div>

          <div className="border-t border-[#AFAFAF] mt-4"></div>

          {/* Apply Coupon Button */}
          <div
            onClick={() => setOpenCoupon(true)}
            className="mt-4 p-3 bg-[#EAEAEA] rounded-[10px] text-[#09339B] font-medium
                       flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img src="/images/coupon.png" alt="" />
              <span>Apply Coupon</span>
            </div>
            <img src="/images/left-arrow.png" alt="" />
          </div>
            {/* Coupon */}
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">
                Coupon Code
              </label>

              <div className="relative mt-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full border rounded-lg py-2 px-3 pr-24 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />

                {/* Applied Badge */}
                {applied && (
                  <div className="absolute right-24 md:right-44 top-1/2 -translate-y-1/2 bg-[#D8E3FF] text-[#09339B] px-2 py-1 rounded-md text-xs font-medium">
                    Applied
                  </div>
                )}

                {/* Close Button */}
                {applied && (
                  <button
                    onClick={() => setApplied(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


          <div className="border-t border-[#AFAFAF] mt-4"></div>

          {/* Buy */}
          <button className="w-full bg-[#09339B] text-white rounded-lg py-3 mt-5 font-medium text-[16px]">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
