"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CertificateLayout from "./ui/CertificateLayout";
import { getCertificateByCourseId } from "@/services/courses.service";
import * as htmlToImage from "html-to-image";

type CertifyModalProps = {
  onClose?: () => void;
  onDownload?: () => void | Promise<void>;
  courseId?:string;
};
type CertificateData = {
  courseTitle: string;
  studentName: string;
  completionDate: string;
};

export default function Certificate({ onClose, onDownload, courseId }: CertifyModalProps) {
  console.log(courseId,"courseId")
const certificateRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
 const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

useEffect(() => {
  if (!courseId) return;

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res:any = await getCertificateByCourseId(courseId);
      setCertificateData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchCertificate();
}, [courseId]);
const handleDownload = async () => {
  if (!certificateRef.current) return;

  try {
    const dataUrl = await htmlToImage.toPng(certificateRef.current, {
      cacheBust: true,
      pixelRatio: 2, // better quality
    });

    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Download failed:", error);
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-[70%] rounded-xl shadow-lg p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Certificate Card */}
        <div className="bg-white shadow rounded p-5 space-y-3">
          <h3 className="flex items-center justify-center gap-2 text-[#09339B] text-[20px] font-semibold">
            <img
              src="/images/award.png"
              alt="Certificate Icon"
              className="w-6 h-6"
            />
            Course Certificate
          </h3>

                  <p className="text-[16px] text-[#929292] text-center">Download your certificate of completion of this course</p>
          
                  {/* <Image
                    src="/images/certificate.svg"
                    alt="Certificate"
                    width={500}
                    height={300}
                    className="rounded"
                  /> */}
                  {/* <CertificateLayout name="Sushma" course="AI" date="25/01/2016"/> */}
                  <div ref={certificateRef}>
                   {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : certificateData ? (
                    <CertificateLayout
                      name={certificateData.studentName}
                      course={certificateData.courseTitle}
                      date={certificateData.completionDate}
                    />
                  ) : (
                    <p className="text-center text-red-500">Certificate not available</p>
                  )}
                  </div>
                </div>

            <div className="flex justify-center gap-3 pt-3 ">
            <button
              type="button"
              className="px-4 py-2 bg-[#09339B] text-white rounded"
              // onClick={() => {
              //   void onDownload?.();
              // }}
               onClick={handleDownload}
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

        {/* <div className="flex justify-center gap-3 pt-3 ">
          <button
            type="button"
            className="px-4 py-2 bg-[#09339B] text-white rounded"
            onClick={() => {
              void onDownload?.();
            }}
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
        </div> */}
      </div>
    </div>
  );
}
