import { useState } from "react";
import CourseCard from "../../CourseCard";
import Image from "next/image";
import { useRouter } from "next/navigation";


import { Calendar, Search } from "lucide-react";


export default function Commission() {

  const router = useRouter();
  const ordersData = [
  {
    id: 1,
    orderId: "202520210",
    date: "14 Feb 2026",
    name: "Sneha Gupta",
    email: "sneha@gmail.com",
    phone: "+91 701234543",
    course: "Income Tax Course",
    amount: 3499,
    commission: 350,
  },
  {
    id: 2,
    orderId: "202520211",
    date: "15 Feb 2026",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    course: "Microsoft Excel Course",
    amount: 2999,
    commission: 300,
  },
];



// const membershipData = [
//   {
//     id: 1,
//     orderNumber: "Order- 202520210",
//     name: "Sneha Gupta",
//     description: "Courses focusing on generative AI and automation tools for business.",
   
//     url: "https://studycafe.io/?ref=alexm",
//   },
//   {
//     id: 2,
//     orderNumber: "Order- 202520211",
//     name: "Deepak Joshi",
//     description: "Courses focusing on generative AI and automation tools for business.",
//     originalPrice: 3999,
//     discountedPrice: 29999,
//     url: "https://studycafe.io/?ref=alexm",
//   },
//   {
//     id: 3,
//     orderNumber: "Order- 202520212",
//     name: "Alex Johnson",
//     description: "Courses focusing on generative AI and automation tools for business.",
//     originalPrice: 3999,
//     discountedPrice: 29999,
//     url: "https://studycafe.io/?ref=alexm",
//   },
//   {
//     id: 4,
//     orderNumber: "Order- 202520213",
//     name: "Sarah Williams",
//     description: "Courses focusing on generative AI and automation tools for business.",
//     originalPrice: 3999,
//     discountedPrice: 29999,
//     url: "https://studycafe.io/?ref=alexm",
//   },
// ];




  // Calculate which blogs to show for current step
  const startIndex = 0;
  const endIndex = 4;
  // const visibleBCourses = courses.slice(startIndex, endIndex);
    const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] =useState("");

  const handleSearch = () => {
    console.log(fromDate, toDate);
  };

  return (
    <section className="md:p-6 max-w-6xl mx-auto  bg-white px-6">
      <div className="text-[16px] text-[#09339B] mb-3 cursor-pointer" onClick={() => router.back()}>
         ← Back to Affiliate Dashboard
      </div>
      <h2 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-1">
       Commission Orders
      </h2>
      <p className="text-[#252525] text-[16px] md:text-[26px] mb-6">
        Search your affiliate commission orders by date or month.
      </p>

      <div className="border border-[#B4C6FF] rounded-xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-6 md:items-end">

          {/* From */}
          <div className="flex-1">
            <label className="text-[16px]">
              From <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              {/* <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              /> */}
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09339B]"
              />
            </div>
          </div>

          {/* To */}
          <div className="flex-1">
            <label className="text-[16px] ">
              To <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
          
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09339B]"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-[#09339B] text-white px-8 py-2 rounded-xl hover:bg-[#0F2E75] transition text-[20px] mx-auto"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>
  


 

 

 

      {/* All courses---------- */}
      <div className="py-4">
        <div className="flex flex-col md:flex-row  mt-4 px-2">
          <h2 className="font-regular text-[20px] mb-2">2 Orders Found</h2>
          <div className="md:ml-auto flex  gap-4">
            <button className="md:ml-auto text-[#09339B] hover:text-[#0F2E75] border border-[#09339B] px-4 md:px-4 py-1 rounded-lg font-medium">
              Download Excel
            </button>
            <button className="md:ml-auto text-[#09339B] hover:text-[#0F2E75] border border-[#09339B] px-4 md:px-4 py-1 rounded-lg font-medium">
              Download PDF
            </button>
         </div>
        </div>

     {ordersData.map((order) => (
       <div
         key={order.id}
         className="grid grid-cols-1 gap-3 mt-4 border hover:border-[#9FBBFF] shadow-md rounded-lg p-4 px-6 mx-2 "
       >
         <div className="flex justify-between md:text-[20px] ">
           <p className="font-bold">Order - {order.orderId}</p>
           <p>{order.date}</p>
         </div>

         <p className="font-regular">{order.name}</p>

         <p className="text-sm text-gray-600 flex flex-wrap gap-4">
           <span>{order.email}</span>
           <span>{order.phone}</span>
         </p>

         <div className="border-t border-[#AFAFAF]"></div>

         <div className="flex  justify-between items-start">
           <div className="flex flex-col">
             <p className="font-medium mt-4">{order.course}</p>
             <p className="mt-1">Amount: <span className="font-semibold">₹{order.amount}</span> </p>
        </div>

         
 

             <p className="bg-[#C5FFD4] px-3 py-1 rounded-lg text-green-700 font-medium mt-6">
               ₹{order.commission} Commission
             </p>
         
         </div>
       </div>
))}


      </div>

    </section>
  );
}
