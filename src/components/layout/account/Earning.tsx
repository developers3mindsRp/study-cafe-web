import CourseCard from "../../CourseCard";
import Image from "next/image";
"use client";
import { useRouter } from "next/navigation";



export default function Earning() {
const courses = [
  {
    id: 1,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f1.jpg",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 2,
    title: "Certification Course on How to Automate Your CA Practice",
    img: "/images/home/f2.png",
    hours: "2+ Hours",
    lang: "English",
    students: "957",
    oldPrice: "₹ 1,999",
    newPrice: "₹ 99",
    rating: "4.8",
  },
  {
    id: 3,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f3.png",
    hours: "4+ Hours",
    lang: "English",
    students: "1240",
    oldPrice: "₹ 2,000",
    newPrice: "₹ 699",
    rating: "4.8",
  },
  {
    id: 4,
    title: "Practical Filing of GSTR-9 & GSTR-9C Certification Course",
    img: "/images/home/f4.jpg",
    hours: "3+ Hours",
    lang: "English",
    students: "820",
    oldPrice: "₹ 1,499",
    newPrice: "₹ 499",
    rating: "4.8",
  },


];

const membershipData = [
  {
    id: 1,
    title: "Join Studycafe Lifetime Ultimate Membership Plan",
    description: "Courses focusing on generative AI and automation tools for business.",
    originalPrice: 3999,
    discountedPrice: 29999,
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 2,
    title: "Join Studycafe Lifetime Ultimate Membership Plan",
    description: "Courses focusing on generative AI and automation tools for business.",
    originalPrice: 3999,
    discountedPrice: 29999,
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 3,
    title: "Join Studycafe Lifetime Ultimate Membership Plan",
    description: "Courses focusing on generative AI and automation tools for business.",
    originalPrice: 3999,
    discountedPrice: 29999,
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 4,
    title: "Join Studycafe Lifetime Ultimate Membership Plan",
    description: "Courses focusing on generative AI and automation tools for business.",
    originalPrice: 3999,
    discountedPrice: 29999,
    url: "https://studycafe.io/?ref=alexm",
  },
];

const courseCategories = [
  {
    id: 1,
    title: "AI Tools",
    description:
      "Courses focusing on generative AI and automation tools for business.",
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 2,
    title: "Business Analytics",
    description:
      "Data-driven decision making and visualization courses for business.",
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 3,
    title: "GST Course",
    description:
      "Data-driven decision making and visualization courses.",
    url: "https://studycafe.io/?ref=alexm",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description:
      "Data-driven decision making and visualization courses.",
    url: "https://studycafe.io/?ref=alexm",
  },
];
const router = useRouter();


  // Calculate which blogs to show for current step
  const startIndex = 0;
  const endIndex = 4;
  const visibleBCourses = courses.slice(startIndex, endIndex);

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm  border-[#9FBBFF] p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">
       Affiliate Dashboard
      </h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Manage your referral links and track your performance.
      </p>

      <h2 className="text-[16px] font-bold mb-4">Overall Earning</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">

        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
          <h2 className="xl:text-[20px] text-[#AFAFAF]">Total Order</h2>
          <h3 className="font-bold">15</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
          <h2 className="xl:text-[20px] text-[#AFAFAF]">Order Value</h2>
          <h3 className="font-bold">₹400</h3>
        </div>
        {/* <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="text-[20px] text-[#AFAFAF]">Estimated Value</h2>
            <h3 className="font-bold">₹400</h3>
        </div> */}
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg ">
            <h2 className="xl:text-[20px] text-[#AFAFAF]">Total Commission</h2>
            <h3 className="font-bold">₹136</h3>
        </div>

      </div>

     
        <div className="px-2 mt-6">
                <button className=" px-4 py-2 bg-[#09339B] text-white rounded-lg text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300"
                onClick={() => router.push("/report")}>
                View Full Report
            </button>
        </div>

        {/* Affiliate Links----------------- */}
      <div>
        <div className="flex mt-4 px-2">
          <img src="/images/link.svg" alt="" /> <a href="" className="font-bold">Affiliate URLs</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/home.svg" alt="" />
            <h2 className="font-bold">Homepage</h2>
            <p className="line-clamp-2">Direct traffic to our main landing page for general visitors.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
            <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
              <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
            </div>
          </div>
          <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2 className="font-bold">Membership</h2>
            <p className="line-clamp-2">Direct traffic to our main landing page for general visitors.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
            <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
              <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
            </div>
          </div>
        </div>
      </div>

     {/* Course Categories */}
      <div>
        <div className="flex mt-4 px-2">
          <img src="/images/category.svg" alt="" /> <a href="" className="font-bold">Courses Categories</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {courseCategories.map((category) => (
            <div
              key={category.id}
              className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg"
            >
              <h2 className="text-[16px] font-bold">{category.title}</h2>
              <p className="line-clamp-2">{category.description}</p>

              <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all">
                {category.url}
              </p>

              <button
                onClick={() => navigator.clipboard.writeText(category.url)}
                className="flex justify-center items-center gap-2 px-4 py-2 w-full text-[#1F4FBF] border border-[#1F4FBF] rounded-md"
              >
                <img src="/images/copy-b.svg" alt="" />
                Copy URL
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* All courses---------- */}
      <div>
        <div className="flex mt-4 px-2">
          <img src="/images/all-course.svg" alt="" /> <a href="" className="font-bold">All Courses</a>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-4">
          {membershipData.map((item) => (
            <div
              key={item.id}
              className="border border-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg"
            >
              {/* Price Section (only if exists) */}
              {item.originalPrice && (
                <div className="flex flex-col">
                  <span className="line-through text-[#929292] font-medium">
                    ₹{item.originalPrice}
                  </span>
                  <span className="text-[#09339B] font-bold text-[16px]">
                    ₹{item.discountedPrice}
                  </span>
                </div>
              )}

              <h2 className="text-[16px] font-bold">{item.title}</h2>
              <p>{item.description}</p>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md break-all md:w-3/4">
                  {item.url}
                </p>

                <button
                  onClick={() => navigator.clipboard.writeText(item.url)}
                  className="flex justify-center items-center gap-2 xl:px-4 xl:py-2 text-[#1F4FBF] border border-[#1F4FBF] rounded-md md:w-1/4"
                >
                  <img src="/images/copy-b.svg" alt="" />
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-[#09339B] text-white px-12 py-2 rounded-md mt-4 mx-auto block text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300">
          View All
        </button>

      </div>

    </section>
  );
}
