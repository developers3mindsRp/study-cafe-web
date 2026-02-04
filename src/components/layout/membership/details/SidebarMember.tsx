import { useState } from "react";
import { X } from "lucide-react";

export default function MemberPrice() {
  const [coupon, setCoupon] = useState("STUDY50");
  const [applied, setApplied] = useState(true);



  return (
    <div className="w-full max-w-sm bg-[#F9F9FB] rounded-xl shadow-lg p-6 border mx-auto h-auto">
      
      {/* Price */}
      <div className="text-center">
        <p className="text-[28px] font-semibold text-[#1A1A1A]">
    
          ₹7,999
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Lifetime
        </p>
      </div>

      {/* Coupon */}
      <div className="mt-6">
        <label className="text-sm font-semibold text-gray-700">Coupon Code</label>

        <div className="relative mt-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          {applied && (
            <button
              onClick={() => setApplied(false)}
              className="absolute right-3 top-2.5 text-gray-500"
              
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setApplied(true)}
          className={`w-full py-2 mt-3 border rounded-lg font-medium ${
            applied
              ? "border-blue-500 text-[#09339B]"
              : "bg-[#09339B] text-white"
          }`}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <h3 className="text-[16px] font-semibold text-gray-800 mb-2">Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Amount</span>
            <span>₹7,999</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">-₹599</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span>₹7,400</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹159</span>
          </div>
        </div>

        <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-[17px]">
          <span>Grand Total</span>
          <span>₹7,559</span>
        </div>
      </div>

      {/* Buy Button */}
      <button className="w-full bg-[#09339B] hover:bg-white  text-white hover:text-[#09339B] border border-[#09339B] rounded-lg py-3 mt-5 font-medium text-[16px]">
        Buy Membership
      </button>
    </div>
  );
}
