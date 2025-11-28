"use client";
import React, { useState } from "react";
import ReviewForm from "./WriteReview";
export default function ReviewSection() {
      const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(true); // show the component when button is clicked
  };
  return (
    <section className="w-full   p-6 rounded-xl bg-white shadow-sm">
      
      {/* Write Review Button */}
      <div className="text-center mb-6 font-medium text-[20px]">
  <div>
      {!showForm && (
        <button
          className="w-full px-6 py-2 border border-[#09339B] text-[#09339B] rounded-lg hover:bg-blue-50 transition"
          onClick={() => setShowForm(true)}
        >
          Write a Review
        </button>
      )}

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Overall Rating */}
        <div className="col-span-1 flex flex-col items-center p-4 rounded-lg bg-gray-50">
          <h2 className="text-4xl font-semibold">4.0</h2>
          <div className="flex mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <img key={i} src="/images/star.png" className="w-5" />
            ))}
            <img src="/images/star.png" className="w-5" />
          </div>
          <p className="text-gray-500 mt-2 text-sm">Total 50 Ratings</p>
        </div>

        {/* Rating Bars */}
        <div className="col-span-2 space-y-3">
          {[
            { label: "5 Star", value: 50 },
            { label: "4 Star", value: 70 },
            { label: "3 Star", value: 10 },
            { label: "2 Star", value: 0 },
            { label: "1 Star", value: 0 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-16 text-sm text-gray-500">{item.label}</span>
              <div className="w-full bg-gray-200 h-2 rounded-lg">
                <div
                  className="h-2 bg-yellow-400 rounded-lg"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="w-10 text-sm text-gray-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-10 space-y-8">

        {[1, 2].map((_, index) => (
          <div key={index} className="flex gap-4">
            
            {/* Avatar */}
            <div className="w-12 h-12 bg-[#2F2A2A] text-white rounded-full flex items-center justify-center text-lg font-medium">
              M
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-[18px]">Maxin Will</h3>
              <p className="text-sm text-gray-500">Product Manager</p>

              {/* Rating + Time */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <img key={i} src="/images/star.png" className="w-4" />
                  ))}
                  <img src="/images/star.png" className="w-4" />
                </div>
                <span className="text-gray-400 text-sm">• 6 months ago</span>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 mt-3 text-[15px] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis 
                nostrud exercitation ullamco.
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
