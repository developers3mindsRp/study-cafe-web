import React from "react";

type CertificateLayoutProps = {
  name?: string;
  course?: string;
  date?: string;
};
const CertificateLayout: React.FC<CertificateLayoutProps> = ({
  name,
  course,
  date
}) => {
  return (
    <div className="w-full flex justify-center items-center p-0">
      <div className="relative w-[822px] h-[583px] bg-white ">
        {/* Background Image */}
        <img
          src="/images/bgcertificate.png"
          alt="certificate-bg"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

          <div className="absolute left-[41px] top-[35px]">
              <p className="text-[12px]">Certificate Serial No. <b>4987</b></p>
              <img src="/images/ISOCertified.png" className="w-[70px] m-[auto] mt-[8px]"/> 
          </div>
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-10">

         

          {/* Title */}
            <img src="/images/studycafe_logo.svg" className="w-full max-w-[100px] "/>
          <h1 className="text-[50px] leading-[65px] font-[500]  text-[#1C232B]">
            CERTIFICATE
          </h1>
          <p className="text-[20px]  text-[#1C232B]">OF APPRECIATION</p>

          <p className="text-[#808285] text-[16px] mt-0 mb-4">
            THIS CERTIFICATE IS PROUDLY PRESENTED TO
          </p>

          {/* Name */}
          <h2 className="text-4xl font-[500] text-[#000000] mt-6 capitalize">{name}</h2>

          {/* Divider */}
         <div className="w-2/3 h-[2px] my-4 bg-[linear-gradient(90deg,#C67C2A_0%,#D19343_9%,#EDCF82_27%,#FAEA9F_36%,#EECE7B_45%,#E4B75D_54%,#DCA546_64%,#D79835_74%,#D4912C_85%,#D38F29_100%)]"></div>

          {/* Course */}
          <p className="text-[#000000] text-[16px]">For Successfully Attending</p>
          <h3 className="text-[#000000] text-[18px] font-semibold mt-1 w-[80%]">{course}</h3>
          <p className=" mt-1 text-[#000000] text-[16px]">
            Held Online, Conducted By Studycafe
          </p>

          {/* Footer */}
          <div className=" w-[80%]  flex justify-between items-center  mt-6 px-10 text-sm text-gray-600 mb-6">
            <div className="text-center  w-[30%]">
              <p className="font-semibold  text-[#000000]">{date}</p>
              <div className="border-t border-[#404041]  mt-1 w-full mx-auto"></div>
              <p className="text-xs mt-1  text-[#000000]">DATE</p>
            </div>

            <div className="text-center font-semibold text-lg">
             <img src="/images/award_1.png" className="w-full max-w-[30%] m-auto"/>
            </div>

            <div className="text-center w-[30%]">
               <p className="font-semibold  text-[#000000] "><img src="/images/signature.png"/></p>
              <div className="border-t border-[#404041] mt-1 w-full mx-auto"></div>
                <p className="font-semibold  text-[#000000]">DEEPAK GUPTA</p>
              <p className="text-xs mt-1  text-[#000000]">(FOUNDER)</p>
            </div>
          </div>

          {/* Bottom Info */}
          <p className="pl-12 w-[80%] text-xs text-black text-left px-10 text-center">
            Contact Us: Studycafe Private Limited, 1003, Modi Tower, 98, Nehru
            Place, New Delhi-110019 | <br /> E: contact@studycafe.in | W:
            www.studycafe.in | Mo: +91 11 43710666
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateLayout;