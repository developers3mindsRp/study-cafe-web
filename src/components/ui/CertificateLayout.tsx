import React from "react";

type CertificateLayoutProps = {
  name?: string;
  course?: string;
  date?: string;
  serial?: string | null;
};

const CertificateLayout: React.FC<CertificateLayoutProps> = ({
  name,
  course,
  date,
  serial,
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-")
    : "";

  return (
    <div className="w-full overflow-x-hidden flex justify-center py-4 h-[285px] md:h-[unset]">
      {/* Responsive Scale */}
      <div
        className="
          origin-top
          scale-[0.42]
          sm:scale-[0.60]
          md:scale-100
        "
      >
        {/* Certificate */}
        <div className="relative w-[822px] h-[583px] bg-white overflow-hidden">
          {/* Background */}
          <img
            src="/images/bgcertificate.png"
            alt="certificate"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* ISO */}
          <div className="absolute left-[41px] top-[35px] z-20">
            <p className="text-[12px]">
              Certificate Serial No. <b>{serial ?? "—"}</b>
            </p>

            <img
              src="/images/ISOCertified.png"
              className="w-[70px] mx-auto mt-2"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-10 text-center">
            <img
              src="/images/studycafe_logo.svg"
              className="w-[100px]"
            />

            <h1 className="text-[35px] leading-[60px] font-medium text-[#1C232B]">
              CERTIFICATE
            </h1>

            <p className="text-[20px] text-[#1C232B]">
              OF APPRECIATION
            </p>

            <p className="text-[16px] text-[#808285] mt-1">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>

            <h2 className="text-[30px] font-medium text-black mt-4 capitalize">
              {name}
            </h2>

         <div className="w-2/3 h-[2px] mb-2 bg-[linear-gradient(90deg,#C67C2A_0%,#D19343_9%,#EDCF82_27%,#FAEA9F_36%,#EECE7B_45%,#E4B75D_54%,#DCA546_64%,#D79835_74%,#D4912C_85%,#D38F29_100%)]"></div>

            <p className="text-[16px]">
              For Successfully Attending
            </p>

            <h3 className="text-[18px] font-semibold mt-2 w-[80%]">
              {course}
            </h3>

            <p className="text-[16px] mt-2">
              Held Online, Conducted By Studycafe
            </p>

            {/* Footer */}
            <div className="w-[80%] flex justify-between items-end mt-4 px-8">
              {/* Date */}
              <div className="w-[28%] text-center">
                <p className="font-semibold text-black">
                  {formattedDate}
                </p>

                <div className="border-t border-black mt-2"></div>

                <p className="text-xs mt-2 text-black">
                  DATE
                </p>
              </div>

              {/* Badge */}
              <div className="w-[18%] flex justify-center">
                <img
                  src="/images/award_1.png"
                  className="w-[55px]"
                />
              </div>

              {/* Signature */}
              <div className="w-[28%] text-center">
                <img
                  src="/images/signature.png"
                  className="w-[120px] mx-auto"
                />

                <div className="border-t border-black mt-2"></div>

                <p className="font-semibold text-black">
                  DEEPAK GUPTA
                </p>

                <p className="text-xs text-black mt-1">
                  (FOUNDER)
                </p>
              </div>
            </div>

            {/* Contact */}
            <p className="w-[82%] text-[12px] text-center text-black mt-8 leading-5">
              Contact Us: Studycafe Private Limited, 1003, Modi Tower, 98,
              Nehru Place, New Delhi-110019
              <br />
              E: contact@studycafe.in | W: www.studycafe.in
              <br />
              Mo: +91 96250 80264
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateLayout;