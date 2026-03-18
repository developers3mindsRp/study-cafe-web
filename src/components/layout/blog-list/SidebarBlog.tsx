import Image from "next/image";
import Link from "next/link";

export default function SidebarBlog() {
  const recentPosts = [
  {
    image: "/images/s-court.png",
    title: "Supreme Court Sets Aside High Court’s Direction to CBDT on Software Changes in TDS Demand Cases",
  },
  {
    image: "/images/property.png",
    title: "ITAT Deletes Section 56 Addition on Joint Property Purchase Where Entire Payment Made by Spouse",
  },
  {
    image: "/images/plant.png",
    title: "A Simple Way to Build Rs.1 Crore: The 15-15-15 Rule Explained",
  },
];
  const AllPosts = [
  {
    image: "/images/court.png",
    title: "Supreme Court: Overtime Must Be Paid on Full Wages, Not Just Basic Pay",
  },
  {
    image: "/images/finance.png",
    title: "Finance Act 2025 Introduces Lower Tax Burden and Higher Exemption Under New Tax Regime",
  },
  {
    image: "/images/charity.png",
    title: "ITAT Upholds CIT(A)’s Deletion of Rs. 3.97 Crore Ad Hoc Expense Disallowance in Charitable Trust Case",
  },
];

  return (
          <div className="space-y-5 sticky top-24">
          {/* Pricing Card */}
        

{/* Recent Posts Section */}
<div className="bg-[#F9F9FB]   space-y-3">

  <p className="font-medium text-[20px] bg-gradient-to-r from-[#253D8E] to-transparent
      md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto mb-6 md:mb-0">
    Recent Posts
  </p>

  {/* Slider on Mobile / Normal on Desktop */}
        <div className="flex md:block gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">

          {recentPosts.map((post, idx) => (
            <div
              key={idx}
              className="snap-start min-w-[80%] md:min-w-full bg-white md:mb-8 md:p-0"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="rounded w-full"
              />

              <p className="text-[16px] font-bold mt-2 xl:text-[20px] line-clamp-2">
                {post.title}
              </p>
         <div className="hidden md:block border-b border-[#AFAFAF] p-2 w-full"></div>
            </div>
          ))}

        </div>

       </div>

          {/* #Advertisement--- */}
          <div className="bg-white space-y-3">
           
            <Image
              src="/images/bitsat.png"
              alt="Certificate"
              width={500}
              height={300}
              className="rounded"
            />

          </div>
        


          <div className="bg-[#F9F9FB]  md:px-5 space-y-3">
                   <p className="font-medium text-[20px] bg-gradient-to-r from-[#253D8E] to-transparent
      md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto mb-6 md:mb-0">All Posts</p>

          <div className="flex md:block gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">

          {AllPosts.map((post, idx) => (
            <div
              key={idx}
              className="snap-start min-w-[80%] md:min-w-full bg-white md:mb-8  md:p-0"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="rounded w-full"
              />

              

              <p className="text-[15px] font-bold mt-2 md:text-[20px] line-clamp-2">
                {post.title}
              </p>
             <div className="hidden md:block border-b border-[#AFAFAF] p-2 w-full"></div>
            </div>
          ))}

        </div>
           
    
          </div>

   

      <Link href="/blogs">
        <div className="flex justify-center mt-6">
          <button className="border border-[#09339B]  text-[#09339B] text-[20px] font-medium w-full p-2 rounded-[10px] hover:bg-[#09339B] hover:text-white">View All</button>
        </div></Link>

          <div className="bg-white shadow rounded p-3 md:p-5 space-y-3">
           
            <Image
              src="/images/bank-au.png"
              alt="Certificate"
              width={500}
              height={300}
              className="rounded"
            />
   
          </div>

          <div className="bg-white px-5 space-y-6 md:space-y-3">
            <h4 className="text-[20px] font-medium mb-4 bg-gradient-to-r from-[#253D8E] to-transparent
      md:bg-none text-white p-3 md:text-gray-900 md:px-0 md:py-0 mx-auto md:mx-0 md:w-auto  md:mb-0" >Tags</h4>
          <div className="flex gap-4 text-[18px]  ">
            <p className=" bg-white rounded-[14px] border border-black px-4 md:border-none">Mutual Funds</p>
            <p className=" bg-white rounded-[14px] border border-black px-4 md:border-none">Finance</p>
          </div>
      </div>
      
      <hr />

          {/* Contact Box */}
          <div className=" rounded xl:px-5 space-y-4">
            <div className="bg-[#09339B] shadow rounded p-5 space-y-3 md:space-y-6 text-white text-center ">
                <h2 className="text-[20px] font-bold">StudyCafe Membership</h2>
                <p className="xl:text-[18px] ">For More details about Membership Click Join Membership Button</p>
          <Link href="/plans">
            <button className="pl-10 pr-10 p-2 bg-white text-[#09339B] text-[20px] rounded mt-6">View Membership</button></Link>
            </div>
           
           




          </div>
        </div>
  );
}
