"use client";

const tabs = [
  { label: "Course Key Features", target: "features" },
  { label: "Course Description", target: "description" },
  { label: "Course Content", target: "content" },
  { label: "Certificate", target: "certificate" },
];

export default function CourseTabs() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-0  z-50  border-b ">
      <div className="container px-4 mx-auto flex gap-6 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.target}
            onClick={() => handleScroll(tab.target)}
            className=" text-[20px] font-normal text-[#6C6C6C] hover:text-[#252525] relative hover:font-semibold
              after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:w-full
                after:h-[2px]
                after:bg-[#252525]
                after:scale-x-0
                after:origin-left
                after:transition-transform
                hover:after:scale-x-100"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
