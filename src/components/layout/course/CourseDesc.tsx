"use client";

import { useEffect, useMemo, useState } from "react";

interface CourseTabsProps {
  course: any;
  batches?: any[];
}

/** Parse a JSON or newline-separated text field into a string array. */
function parseListField(raw?: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean);
    }
  } catch {
    // Ignore JSON parse errors
  }

  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Format a scheduled_at date as HH:MM */
function formatSessionTime(scheduledAt?: string | null): string | null {
  if (!scheduledAt) return null;

  const date = new Date(scheduledAt);

  if (isNaN(date.getTime())) return null;

  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");

  return `${h}:${m}`;
}

export default function CourseTabs({
  course,
  batches = [],
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState("features");
  const [isSticky, setIsSticky] = useState(true);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);

    if (!element) return;

    const headerOffset = 140;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;

    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveTab(id);
  };

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    const sections = [
      "features",
      "description",
      "content",
      "certificate",
    ];

    sections.forEach((id) => {
      const section = document.getElementById(id);

      if (section) {
        sectionObserver.observe(section);
      }
    });

    let stopObserver: IntersectionObserver | null = null;

    const certificateSection =
      document.getElementById("certificate");

    if (certificateSection) {
      stopObserver = new IntersectionObserver(
        ([entry]) => {
          setIsSticky(entry.boundingClientRect.top > 0);
        },
        {
          threshold: 0,
        }
      );

      stopObserver.observe(certificateSection);
    }

    return () => {
      sectionObserver.disconnect();

      if (stopObserver) {
        stopObserver.disconnect();
      }
    };
  }, []);

  const contentItems = useMemo(() => {
    const items: {
      title: string;
      duration: string;
      bullets: string[];
    }[] = [];

    // Curriculum JSON (API returns parsed array or legacy JSON string)
    if (course?.curriculum) {
      try {
        const parsed: any[] = Array.isArray(course.curriculum)
          ? course.curriculum
          : JSON.parse(course.curriculum);

        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            const sections = Array.isArray(item.sections) ? item.sections : [];

            let bullets: string[] = [];
            if (sections.length > 0) {
              bullets = sections
                .map((section: any) => String(section?.title ?? "").trim())
                .filter(Boolean);
            } else if (Array.isArray(item.points)) {
              bullets = item.points.map(String).filter(Boolean);
            } else if (typeof item.description === "string") {
              bullets = item.description
                .split(/\r?\n+/)
                .map((line: string) => line.replace(/<[^>]*>/g, "").trim())
                .filter(Boolean);
            }

            items.push({
              title: item.title ?? "",
              duration: item.minutes ? `${item.minutes} min` : "",
              bullets,
            });
          });
        }
      } catch (error) {
        console.error("Curriculum parse error:", error);
      }
    }

    // Fallback from batches
    if (items.length === 0 && batches.length > 0) {
      const byDay = new Map<
        number,
        {
          title: string;
          bullets: string[];
          time: string;
        }
      >();

      batches.forEach((batch: any) => {
        batch?.sessions?.forEach((session: any) => {
          const day = session.day_number || 1;

          const bucket:
            {
              title: string;
              bullets: string[];
              time: string;
            } =
              byDay.get(day) ?? {
                title: session.title || `Day ${day}`,
                bullets: [],
                time: formatSessionTime(session.scheduled_at) ?? "",
              };

          if (!byDay.has(day)) {
            byDay.set(day, bucket);
          }

          const subtitle = (
            session.section_title || ""
          ).trim();

          if (
            subtitle &&
            !bucket.bullets.includes(subtitle)
          ) {
            bucket.bullets.push(subtitle);
          }
        });
      });

      Array.from(byDay.entries())
        .sort((a, b) => a[0] - b[0])
        .forEach(([, value]) => {
          items.push({
            title: value.title,
            duration: value.time,
            bullets: value.bullets,
          });
        });
    }

    return items;
  }, [course?.curriculum, batches]);

  const features = parseListField(course?.learn_outcomes);

  const hasFeatures = features.length > 0;
  const hasDescription = Boolean(course?.description);
  const hasContent = contentItems.length > 0;
// console.log(course?.certificate_enabled,"course")
  return (
    <>
      <div
        className={`${
          isSticky
            ? "hidden md:block md:sticky top-[90px] z-10"
            : ""
        } border-b bg-white mt-4`}
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {hasFeatures && (
              <button
                onClick={() => handleScroll("features")}
                className={`relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] transition-all ${
                  activeTab === "features"
                    ? "text-[#252525] font-semibold after:scale-x-100"
                    : "text-[#6C6C6C] after:scale-x-0"
                } after:content-[''] after:absolute after:left-0 after:-bottom-4 after:w-full after:h-[2px] after:bg-[#252525] after:origin-left after:transition-transform`}
              >
                Course Key Features
              </button>
            )}

            {hasDescription && (
              <button
                onClick={() => handleScroll("description")}
                className={`relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] transition-all ${
                  activeTab === "description"
                    ? "text-[#252525] font-semibold after:scale-x-100"
                    : "text-[#6C6C6C] after:scale-x-0"
                } after:content-[''] after:absolute after:left-0 after:-bottom-4 after:w-full after:h-[2px] after:bg-[#252525] after:origin-left after:transition-transform`}
              >
                Course Description
              </button>
            )}

            {hasContent && (
              <button
                onClick={() => handleScroll("content")}
                className={`relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] transition-all ${
                  activeTab === "content"
                    ? "text-[#252525] font-semibold after:scale-x-100"
                    : "text-[#6C6C6C] after:scale-x-0"
                } after:content-[''] after:absolute after:left-0 after:-bottom-4 after:w-full after:h-[2px] after:bg-[#252525] after:origin-left after:transition-transform`}
              >
                Course Content
              </button>
            )}
            {
              course?.certificate_enabled === true  &&
              <button
              onClick={() => handleScroll("certificate")}
              className={`relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] transition-all ${
                activeTab === "certificate"
                  ? "text-[#252525] font-semibold after:scale-x-100"
                  : "text-[#6C6C6C] after:scale-x-0"
              } after:content-[''] after:absolute after:left-0 after:-bottom-4 after:w-full after:h-[2px] after:bg-[#252525] after:origin-left after:transition-transform`}
            >
              Certificate
            </button>
            }

            
          </div>
        </div>
      </div>
    </>
  );
}