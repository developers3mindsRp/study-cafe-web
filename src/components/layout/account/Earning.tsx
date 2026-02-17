import CourseCard from "../../CourseCard";
import Image from "next/image";


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
  // Calculate which blogs to show for current step
  const startIndex = 0;
  const endIndex = 4;
  const visibleBCourses = courses.slice(startIndex, endIndex);

  return (
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm  border-[#9FBBFF]">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">
       Affiliate Dashboard
      </h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Manage your referral links and track your performance.
      </p>

      <div className="flex justify-between px-2">
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="text-[20px] text-[#AFAFAF]">Total Earning</h2>
            <h3 className="font-bold">₹1,000</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="text-[20px] text-[#AFAFAF]">Total Order</h2>
            <h3 className="font-bold">15</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="text-[20px] text-[#AFAFAF]">Estimated Value</h2>
            <h3 className="font-bold">₹400</h3>
        </div>
        <div className="border border-[#E5E7EB] px-4 p-2 rounded-lg">
            <h2 className="text-[20px] text-[#AFAFAF]">Total Commission</h2>
            <h3 className="font-bold">₹136</h3>
        </div>

      </div>

     
        <div className="px-2 mt-6">
                <button className=" px-4 py-2 bg-[#09339B] text-white rounded-lg text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300">
                View Full Report
            </button>
        </div>

<div>
        <div className="flex mt-4 px-2">
         <img src="/images/link.svg" alt="" /> <a href="" className="font-bold">Affiliate URLs</a>
      </div>

      <div className="flex justify-between mt-4">
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/home.svg" alt="" />
            <h2>Homepage</h2>
            <p>Direct traffic to our main landing page for general visitors.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
              <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2>Homepage</h2>
            <p>Direct traffic to our main landing page for general visitors.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
           <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
      </div>
</div>

<div>
        <div className="flex mt-4 px-2">
         <img src="/images/link.svg" alt="" /> <a href="" className="font-bold">Courses Categories</a>
      </div>

      <div className="grid grid-cols-2 mt-4">
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/home.svg" alt="" />
            <h2>AI Tools</h2>
            <p>Courses focusing on generative AI and automation tools for business.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
              <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2>Business Analytics</h2>
            <p>Data-driven decision making and visualization courses for business</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
           <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2>Business Analytics</h2>
            <p>Data-driven decision making and visualization courses.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
           <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
        <div className="border boder-[#E5E7EB] px-4 p-4 space-y-4 rounded-lg">
            <img src="/images/member-b.svg" alt="" />
            <h2>Business Analytics</h2>
            <p>Data-driven decision making and visualization courses.</p>
            <p className="bg-[#F3F4F6] p-2 text-[12px] text-[#4B5563] border rounded-md">https://studycafe.io/?ref=alexm</p>
           <div className="flex justify-center gap-2 px-4 py-2 w-full  text-[#1F4FBF] border border-[#1F4FBF] rounded-md">
            <img src="/images/copy-b.svg" alt="" /> <button className="">Copy URL</button>
           </div>
        </div>
      </div>
</div>


     


 
    </section>
  );
}
