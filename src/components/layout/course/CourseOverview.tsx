import { useState } from "react";
import type { CoursePublicDetail, CourseBatch } from "@/types/models.types";
import { getApiServerOrigin } from "@/config/env";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";

interface CourseOverviewProps {
  course?: CoursePublicDetail | null;
  batches?: CourseBatch[];
}

// Fallback static data used when the course has no structured fields yet
const FALLBACK_FEATURES = [
  "GST Provisions related to GSTR-9 and GSTR-9C Filing",
  "How to show impact of Reversals in GST annual Return",
  "GST Annual return, recent changes as per GST notification",
  "Linkage between GSTR-1, GSTR-3B, GSTR-9 and GSTR-9C",
  "GST annual return workflow, table wise changes and comparison with last year",
  "Practical Aspects will be discussed",
  "Compulsory and Optional Tables",
];

const FALLBACK_DESCRIPTION = `In our continuous endeavour to empower more and more finance professionals,
this certification course has been designed for you. Detailed 2 days course has been designed where daily
more than 2 hrs sessions have been organized. Recording of the Video is Valid for 1 Year. This course
contains Videos along with study material and files. Live training of GSTR-9 & GSTR-9C will be given.`;

const FALLBACK_BONUSES = [
  {
    title:
      "Ready Made Editable Microsoft Excel Templates to work 10X Faster in your Office",
    image: "/images/excel.png",
    worth: "₹4,000",
  },
  {
    title: "Ready Made AI Tools Prompts to work 10X Faster in your Office",
    image: "/images/service.png",
    worth: "₹4,000",
  },
  {
    title:
      "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
    image: "/images/powerpoint.png",
    worth: "₹2,000",
  },
  {
    title:
      "Ready Made Microsoft Excel Short Cut E-Book for MS Office to Work 10X Faster",
    image: "/images/excel.png",
    worth: "₹2,000",
  },
];

/** Resolve a potentially relative backend path to a full URL. */
function resolveImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const fromEnv = resolveApiAssetUrl(path);
  if (fromEnv !== path.trim()) return fromEnv;
  const serverRoot = getApiServerOrigin();
  return `${serverRoot}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Parse a JSON or newline-separated text field into a string array. */
function parseListField(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    /* not JSON */
  }
  return raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Format a scheduled_at date as "Day N – HH:MM" */
function formatSessionTime(scheduledAt?: string | null): string | null {
  if (!scheduledAt) return null;
  try {
    const d = new Date(scheduledAt);
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return null;
  }
}

export default function CourseOverview({
  course,
  batches = [],
}: CourseOverviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // --- Features ---
  const features = parseListField(course?.learn_outcomes);
  const displayFeatures = features.length > 0 ? features : FALLBACK_FEATURES;

  const description = course?.description ?? FALLBACK_DESCRIPTION;

  let bonuses = FALLBACK_BONUSES;
  if (course?.includes_info) {
    try {
      const parsed = JSON.parse(course.includes_info);
      if (Array.isArray(parsed) && parsed.length > 0) bonuses = parsed;
    } catch {
      /* use fallback */
    }
  }

  const contentItems: { title: string; duration: string; bullets: string[] }[] =
    [];

  // ── Curriculum rendering rule ──────────────────────────────────────────────
  // For each day:
  //   - if it has `sections[]` (subsections) → bullets are the subsection TITLES ONLY.
  //   - else fall back to `points[]` or the day-level description.
  if (course?.curriculum) {
    try {
      const parsed = JSON.parse(course.curriculum);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          const sections = Array.isArray(item.sections) ? item.sections : [];

          let bullets: string[];
          if (sections.length > 0) {
            bullets = sections
              .map((sec: any) => String(sec?.title ?? "").trim())
              .filter(Boolean);
          } else if (Array.isArray(item.points)) {
            bullets = item.points.map(String).filter(Boolean);
          } else if (typeof item.description === "string") {
            bullets = item.description
              .split(/\r?\n+/)
              .map((line: string) => line.replace(/<[^>]*>/g, "").trim())
              .filter(Boolean);
          } else {
            bullets = [];
          }

          contentItems.push({
            title: item.title ?? "",
            duration:
              item.duration ?? (item.minutes ? `${item.minutes} min` : ""),
            bullets,
          });
        });
      }
    } catch {
      /* ignore */
    }
  }

  // Fallback: derive content from live session rows (grouped by day, subsection titles as bullets)
  if (contentItems.length === 0 && batches.length > 0) {
    const byDay = new Map<
      number,
      { title: string; bullets: string[]; time: string }
    >();
    batches.forEach((batch) => {
      batch.sessions.forEach((session) => {
        const day = session.day_number || 1;
        const dayBucket =
          byDay.get(day) ?? {
            title: session.title || `Day ${day}`,
            bullets: [],
            time: formatSessionTime(session.scheduled_at) ?? "",
          };
        if (!byDay.has(day)) byDay.set(day, dayBucket);
        const subtitle = (session.section_title ?? "").trim();
        if (subtitle && !dayBucket.bullets.includes(subtitle)) {
          dayBucket.bullets.push(subtitle);
        }
      });
    });
    Array.from(byDay.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([, v]) => {
        contentItems.push({
          title: v.title,
          duration: v.time,
          bullets: v.bullets,
        });
      });
  }

  // Fallback static content if nothing from API
  const FALLBACK_CONTENT = [
    {
      title: "Day1: What is the Duration of the Course?",
      duration: "2 Hrs",
      bullets: [
        "GST Provisions related to GSTR-9 and GSTR-9C filing",
        "GST Annual return, recent changes as per GST notification",
        "GST annual return workflow, table wise changes and comparison with last year",
        "Compulsory and Optional Tables",
      ],
    },
    {
      title: "Day2: Discussion on GSTR-9C",
      duration: "2 Hrs",
      bullets: [
        "GST Provisions related to GSTR-9 and GSTR-9C filing",
        "GST Annual return, recent changes as per GST notification",
        "GST annual return workflow, table wise changes and comparison with last year",
        "Compulsory and Optional Tables",
      ],
    },
  ];
  const displayContent =
    contentItems.length > 0 ? contentItems : FALLBACK_CONTENT;

  return (
    <section className="container px-4 mx-auto">
      {/* Course Key Features */}
      {
        displayFeatures &&
        <>
         <h2 className="md:hidden container scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-2 md:mb-4 px-4 py-3 text-white bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto"
          >
          Course Key Features
        </h2>

        <div
          className="grid md:grid-cols-2 gap-6 mb-6 md:mb-12 mt-8 "
          id="features"
        >
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-[#09B285] bg-[#E9FCF0] p-4"
            >
              <img src="/images/tick1.png" alt="" width="45" height="45" />
              <p
                className="text-[14px] text-black font-medium"
                dangerouslySetInnerHTML={{ __html: feature }}
              />
            </div>
          ))}
        </div>
        </>
      }
     

      {/* Course Description */}

      {
        description &&
        <>
          <h2
          className="container scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4 px-4 py-3 text-white bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto"
          id="description"
          >
            Course Description
          </h2>
          <div className="bg-white rounded-lg p-3 md:p-6 text-[#3a3c3e] text-[16px] leading-[32px] mb-6 md:mb-12 font-normal shadow-[0px_2px_6px_2px_rgba(60,64,67,0.15)]">
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="prose max-w-none"
              />

              {/* Bonuses */}
              <div className="p-0 sm:p-8 mt-8 md:mt-6">
                <button className="flex items-center justify-center gap-2 mb-3 bg-[rgb(255_198_80)] mx-auto px-4 py-2 rounded-[10px]">
                  <img src="/images/gift.svg" alt="" className="w-5 h-5" />
                  <span className="text-sm font-normal text-black">
                    Exclusive Bonuses
                  </span>
                </button>
                <h3 className="text-center text-[18px] sm:text-[28px] lg:text-[32px] font-bold text-[#252525] mt-2">
                  Register Fast to unlock bonuses worth ₹
                  {bonuses
                    .map((bonus: any) => Number(bonus.worth))
                    .reduce((a: number, b: number) => a + b, 0)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-10 px-4 sm:px-8 xl:px-32 mt-8 sm:mt-12">
                  {bonuses.map((bonus: any, index: number) => (
                    <div
                      key={index}
                      className="relative bg-[#FEF9F1] border border-[#F59F0A] rounded-lg p-4 sm:p-6 text-center shadow-sm"
                    >
                      <span className="absolute -top-4 left-4 text-[14px] sm:text-[16px] font-semibold bg-black text-[#FFCC33] px-3 py-1 rounded-[10px]">
                        Bonus {index + 1}
                      </span>
                      <div className="flex items-center gap-3 mt-4">
                        <img
                          src={resolveImageUrl(bonus.image)}
                          alt=""
                          className="w-[36px] h-[36px] sm:w-[43px] sm:h-[43px]"
                        />
                        <h4
                          className="text-sm sm:text-base font-semibold text-left"
                          dangerouslySetInnerHTML={{ __html: bonus.title }}
                        />
                      </div>
                      <span className="relative top-10 mt-6 text-[16px] sm:text-[18px] font-bold text-green-600 bg-green-100 px-3 py-2 rounded-[10px]">
                        Worth ₹{bonus.worth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[25px] text-[#252525] font-semibold">
                  How I will get the course:
                </h2>
                <p className="text-[17px] text-[#3a3c3e] leading-[32px] mt-4">
                  This is an online Certification course so there will not be any
                  physical delivery of the lectures. After the purchase of this
                  Certification course, you can see this course under my account
                  option under purchased courses. All the videos, study materials, PDF
                  files and PPTs, will be uploaded there for quick access by
                  participants. This Certification Course&apos;s Recording is valid
                  for 1 Year.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-[25px] text-[#252525] font-semibold">
                  Who is Eligible to Join this Certification Course:
                </h2>
                <p className="text-[17px] text-[#3a3c3e] leading-[32px] mt-4">
                  There is no bound on the eligibility from our side for this
                  Certification Course. Any person who wants to learn and master in
                  Taxation can join this course. However, it will be more beneficial
                  for the below-mentioned persons:
                </p>
                {course?.requirements ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: course.requirements }}
                    className="mt-8 prose max-w-none"
                  />
                ) : (
                  <ul className="list-disc pl-4 mt-8">
                    <li>Commerce Graduates/CA/CS/CMA/Law students</li>
                    <li>Tax professionals whether in JOB or Practice</li>
                    <li>Qualified CA/CS/CMA/LLB</li>
                    <li>
                      Semi-qualified CA/CS/CMA working in CA Firms or in Industry
                    </li>
                    <li>
                      Any other person not covered above can join the course if
                      interested.
                    </li>
                  </ul>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-12 md:mb-12">
                <div className="bg-[#F9F9FB] p-4 md:p-8">
                  <img src="/images/duration.png" alt="" />
                  <h2 className="font-bold text-[20px] text-black mb-4 mt-4">
                    Course Duration
                  </h2>
                  <p className="leading-relaxed">
                    The course duration is 2 Days and around 4+ hours.
                  </p>
                </div>
                <div className="bg-[#F9F9FB] p-4 md:p-8">
                  <img src="/images/view.png" alt="" />
                  <h2 className="font-bold text-[20px] text-black mb-4 mt-4">
                    Views Limitation
                  </h2>
                  <p className="leading-relaxed">
                    This is a fully online course with 1-year unlimited access,
                    available anytime and anywhere.
                  </p>
                </div>
                <div className="bg-[#F9F9FB] p-4 md:p-8">
                  <img src="/images/time.png" alt="" />
                  <h2 className="font-bold text-[20px] text-black mb-4 mt-4">
                    Course Timing
                  </h2>
                  <p className="leading-relaxed">Timing: 6:00 pm to 8:00 pm</p>
                </div>
              </div>
            </div>
        </>
      }
      

    

      {/* Course Content */}

    {
      displayContent &&
      <>
            <h2
              className="container scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4 px-4 py-3 text-white bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto"
              id="content"
            >
              Course Content
            </h2>
             <div className="w-full md:mt-10 space-y-3 text-left container px-4">
                {displayContent.map((item, index) => (
                  <div key={index} className="shadow-md rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className={`w-full flex justify-between items-center py-2 p-1 md:p-4 transition px-4 md:px-6 text-left ${
                        openIndex === index
                          ? "bg-[#09339B] text-white"
                          : "bg-white text-[#09339B]"
                      }`}
                    >
                      <span className="font-medium text-[14px] md:text-[20px]">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 md:gap-32">
                        {item.duration && (
                          <span className="font-medium text-[14px] md:text-[20px] whitespace-nowrap">
                            {item.duration}
                          </span>
                        )}
                        <svg
                          className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {openIndex === index && item.bullets.length > 0 && (
                      <div className="px-4 pb-4 text-[16px] text-gray-600 leading-relaxed border-t bg-white">
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {item.bullets.map((text, i) => (
                            <li key={i}>{text}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

      </>
    }
      
     

      {/* Certificate */}
      <h2
        className="container mt-8 scroll-mt-28 text-[20px] md:text-[30px] font-semibold mb-6 md:mb-4 px-4 py-3 text-white bg-gradient-to-r from-[#253D8E] to-transparent md:bg-none md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto"
        id="certificate"
      >
        Certificate
      </h2>
      <p className="text-center text-[16px] md:text-[20px] mb-4 md:mb-10 font-medium text-black">
        Certificate to be provided to all the participants.
      </p>
      <img src="/images/certificatee.svg" alt="" className="mx-auto" />
    </section>
  );
}
