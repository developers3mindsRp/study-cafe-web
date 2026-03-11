import CourseCard from "../../CourseCard";
import Image from "next/image";


export default function MembershipCourses() {
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
    <section className="md:p-6 max-w-6xl mx-auto border bg-white rounded-lg shadow-sm  border-[#9FBBFF] px-4 p-4">
      <h2 className="text-[26px] font-normal text-gray-800 mb-1">
        All Courses
      </h2>
      <p className="text-gray-500 text-[16px] mb-6">
        Continue your learning Journey
      </p>

      {/* Desktop Grid */}
             <div className=" sm:grid grid-cols-2 md:grid-cols-2 gap-8">
               {visibleBCourses.map((c) => (
                 <div
                   key={c.id}
                   className="bg-white shadow-md rounded-md overflow-hidden flex flex-col"
                 >
                   <div className="relative w-full h-[180px] md:h-[180px] lg:h-[250px]">
                     <Image src={c.img} alt={c.title} fill className="object-fit" />
                     <span className="absolute flex  gap-1 top-2 right-3 bg-white px-2 rounded-full text-[18px] font-normal shadow mt-4">
                       <img src="/images/icons/star.svg" alt="" className="w-4 h-4 mt-1"/> {c.rating}
                     </span>
                   </div>
   
                   <div className="p-4 flex flex-col flex-1">
                     <div className="flex flex-wrap items-center gap-4 text-[#AFAFAF] text-sm">
                       <span className="flex items-center gap-1">
                         <img src="/images/icons/clock-light.svg" alt="" width="20" height="20" />{c.hours}
                       </span>
                       <span className="flex items-center gap-1">
                         <img src="/images/icons/eng-light.svg" alt="" width="20" height="20" /> {c.lang}
                       </span>
                     </div>
   
                     <h3 className="text-[18px] md:text-[22px] font-normal text-[#252525] mt-2 mb-2 line-clamp-2">
                       {c.title}
                     </h3>
   
                     <div className="flex items-center gap-1 text-[#AFAFAF] text-sm">
                       <img src="/images/icons/user-light.svg" alt="" width="20" height="20" />{c.students} students
                     </div>
   
                     <div className="flex justify-between items-center mt-4">
          
                       <button
                         className="bg-white border border-[#09339B]  text-[#09339B] px-4 py-2 rounded-md text-sm md:text-base font-medium hover:bg-[#09339B] hover:text-white transition-colors duration-300"
                         onClick={() => (window.location.href = "/course/1")}
                       >
                         Start Learning
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

             <div className="flex justify-center mt-6 ">
              <button className="px-4 py-2 bg-[#09339B] text-white rounded-md text-sm md:text-base font-medium hover:bg-white hover:text-[#09339B] border border-[#09339B] transition-colors duration-300">
                View All
              </button>
             </div>
 
    </section>
  );
}
