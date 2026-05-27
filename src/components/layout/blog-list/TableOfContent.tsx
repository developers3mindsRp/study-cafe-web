"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({
  toc,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map((item) =>
        document.getElementById(item.id)
      );

      const scrollPosition = window.scrollY + 120;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];

        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toc]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth",
      });
    }
  };

  if (!toc?.length) return null;

  return (
    <div className=" rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Table of Contents
      </h3>

      <ul className="space-y-2 list-decimal text-[#3a3c3e]  px-4">
        {toc.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 2 ? "ml-0" : ""}
              ${item.level === 3 ? "ml-4" : ""}
              ${item.level === 4 ? "ml-8" : ""}
            `}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left text-[16px]  transition-all duration-200 hover:text-black
             
              `}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}