"use client";
import { useState } from "react";
import Image from "next/image";
type CertifyModalProps = {
  onClose?: () => void
}

export default function Certificate({ onClose }: CertifyModalProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

                {/* Certificate Card */}
                <div className="bg-white shadow rounded p-5 space-y-3">
                    <h3 className="text-[#09339B] text-center text-[20px]">Course Certificate</h3>
                  <p className="text-[16px] text-[#929292] text-center">Download your certificate of completion of this course</p>
          
                  <Image
                    src="/images/certificate.svg"
                    alt="Certificate"
                    width={500}
                    height={300}
                    className="rounded"
                  />
                </div>

            <div className="flex justify-center gap-3 pt-3 ">
            <button
              type="submit"
              className="px-4 py-2 bg-[#09339B] text-white rounded"
            >
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Close
            </button>
          </div>


      </div>
    </div>
  );
}
