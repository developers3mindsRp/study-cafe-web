
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FileText,
  CalendarDays,
  Clock3,
  Landmark,
  BookOpen,
  Download,
} from "lucide-react";

type JudgementCardProps = {
  title: string;
  image:string;
  appealNumber: string;
  judgementDate: string;
  assessmentYear: string;
  court: string;
  access:any;
  onReadMore?: () => void;
  onDownload?: () => void;
};

export default function JudgementCard({
  title,
  image,
  appealNumber,
  judgementDate,
  assessmentYear,
  court,
  onReadMore,
  onDownload,
  access, 
}: JudgementCardProps) {

const router = useRouter();
  const details = [
  {
    icon: FileText,
    label: "Appeal Number",
    value: appealNumber,
  },
  {
    icon: CalendarDays,
    label: "Date of Judgement/Order",
    value: judgementDate,
  },
  {
    icon: Clock3,
    label: "Related Assessment Year",
    value: assessmentYear,
  },
  {
    icon: Landmark,
    label: "Court",
    value: court,
  },
].filter(
  (item) =>
    item.value !== null &&
    item.value !== undefined &&
    String(item.value).trim() !== ""
);


  useEffect(() => {
    const handleRouteComplete = () => {
      window.scrollTo({
        top: 500, // or your offset value
        behavior: "smooth",
      });
    };
  
    router.events.on("routeChangeComplete", handleRouteComplete);
  
    return () => {
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [router.events]);
const canRead = access?.can_read_full;
const canDownload = access?.can_download;
const hasAccess = canRead || canDownload;


// console.log(access?.can_download,"item?.access?.can_download")



  return (
    <div className="rounded-2xl bg-white  shadow-md border border-gray-100 overflow-hidden">
       <img src={image} alt={title} className="w-full"/>
        <div className="p-4 ">
          {/* Title */}
        
          <h2 className="text-[22px] leading-8 font-semibold text-gray-900 min-h-[95px]">
            {title}
          </h2>

          {/* Information Box */}
          {/* <div className="mt-5 rounded-xl border border-gray-200 bg-[#F8F9FC] p-4">
            <div className="space-y-4">
              {details.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-[34px_1fr_auto_1.4fr]  gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Icon className="h-4 w-4 text-[#1B4DBB]" />
                    </div>

                    <span className="text-sm text-gray-600">{item.label}</span>

                    <span className="font-medium text-gray-500">:</span>

                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div> */}

          {/* Buttons */}
        <div className="mt-5">
           
              <div className="flex gap-3">
               
                  <button
                    onClick={onReadMore}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A43B8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08399f]"
                  >
                    Read More
                    <BookOpen size={18} />
                  </button>
           

             
                  <button
                    onClick={onDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0A43B8] bg-white px-4 py-3 text-sm font-semibold text-[#0A43B8] transition hover:bg-blue-50"
                  >
                    Download Judgment
                    <Download size={18} />
                  </button>
               
              </div>
            
          </div>
        </div>
    </div>
   
  );
}