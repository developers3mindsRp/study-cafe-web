"use client";
import { useState, useEffect } from "react";
import CertificateLayout from "./ui/CertificateLayout";
import CertificateArtwork from "./ui/CertificateArtwork";
import { getCertificateByCourseId } from "@/services/courses.service";
import { useCertificateDownload } from "@/hooks/useCertificateDownload";
import { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH } from "@/lib/certificateImage";

type CertifyModalProps = {
  onClose?: () => void;
  onDownload?: () => void | Promise<void>;
  courseId?:string;
};
type CertificateData = {
  courseTitle: string;
  studentName: string;
  completionDate: string;
  certificateNumber?: string | null;
};

export default function Certificate({ onClose, onDownload, courseId }: CertifyModalProps) {

const { captureRef, download, isDownloading } = useCertificateDownload();
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
const handleDownload = () => {
  void download("certificate.png");
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full md:max-w-[80%] rounded-xl shadow-lg p-2 md:p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* Certificate Card */}
        <div className="bg-white   space-y-3">
            <div className="flex justify-between px-6 mb-2 items-start">
                <div>
                    <h3 className="flex items-center gap-2 text-[#09339B] text-[20px] font-semibold">
                    <img
                      src="/images/award.png"
                      alt="Certificate Icon"
                      className="w-6 h-6"
                    />
                    Course Certificate
                  </h3>

                          <p className="text-[16px] text-[#929292] text-center">Download your certificate of completion of this course</p>
              </div>
            

              <div className="flex justify-center gap-3 pt-3 ">
                <button
                  type="button"
                  disabled={isDownloading}
                  className="px-4 py-2 bg-[#09339B] text-white rounded disabled:opacity-60"
                  // onClick={() => {
                  //   void onDownload?.();
                  // }}
                  onClick={handleDownload}
                >
                  {isDownloading ? "Preparing…" : "Download"}
                </button>

                {/* <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button> */}
              </div>
            </div>
          
                  {/* <Image
                    src="/images/certificate.svg"
                    alt="Certificate"
                    width={500}
                    height={300}
                    className="rounded"
                  /> */}
                  {/* <CertificateLayout name="Sushma" course="AI" date="25/01/2016"/> */}
                  <div className="pb-6">
                   {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : certificateData ? (
                    <CertificateLayout
                      name={certificateData.studentName}
                      course={certificateData.courseTitle}
                      date={certificateData.completionDate}
                      serial={certificateData.certificateNumber}
                    />
                  ) : (
                    <p className="text-center text-red-500">Certificate not available</p>
                  )}
                  </div>
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

      {/*
        Off-screen capture host at the certificate's true 822x583 size. The visible block above is
        the scaled preview; capturing it produced a 0.42-scale PNG clipped to 285px tall on phones.
        Never hide this with display:none or visibility:hidden — a hidden subtree has no layout and
        rasterizes blank.
      */}
      {certificateData && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            width: CERTIFICATE_WIDTH,
            height: CERTIFICATE_HEIGHT,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          {/* captureRef goes on this INNER, unpositioned div — see useCertificateDownload. */}
          <div ref={captureRef}>
            <CertificateArtwork
              name={certificateData.studentName}
              course={certificateData.courseTitle}
              date={certificateData.completionDate}
              serial={certificateData.certificateNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
}
