import Image from "next/image";

type HeroSectionBlogProps = {
  title: string;
  subtitle?: string;
  description: string;
  para1?: string;
  para2?: string;
  author: string;
  date: string;
  update:string,
  image: string;
};

const HeroSection_blog = ({
  title,
  subtitle,
  description,
  para1,
  para2,
  author,
  date,
  update,
  image,
}: HeroSectionBlogProps) => {
  return (
    <section className="space-y-6 container mx-auto px-4 bg-[#F5FAFF] md:bg-white pb-4">

      {/* Title */}
      <h1 className="text-[20px] md:text-[30px] xl:text-[40px] font-medium text-gray-900 leading-snug pt-4">
        {title}: <br className="hidden md:block" /> {subtitle}
      </h1>

        {/* Banner Image (mobile first) */}
      <div className="order-first md:order-none rounded-[10px] overflow-hidden  block md:hidden">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={600}
          className="w-full"
        />
      </div>



      {/* Description */}
      <p className="text-[#6C6C6C] text-[16px] md:text-[17px] leading-[27px] md:leading-[32px] font-normal ">
        {description}
      </p>
      <p className="text-[#6C6C6C] text-[17px] leading-[32px] font-normal">
        {para1}
      </p>
      <p className="text-[#6C6C6C] text-[17px] leading-[32px] font-normal">
        {para2}
      </p>

      {/* Author + Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 md:text-[16px] text-[#AFAFAF]  ">

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <img src="/images/user.svg" alt="author" width={20} height={20} />
            {author}
          </span>

          <span className="flex items-center gap-2 whitespace-nowrap">
            <img src="/images/calendar.svg" alt="date" width={20} height={20} />
            {date}
          </span>
        </div>

        <span className="whitespace-nowrap">
          Last update on {update}
        </span>
      </div>


     {/* Desktop Banner Image (only on md+) */}
      <div className="hidden md:block rounded-[10px] overflow-hidden shadow ">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={600}
          className="w-full"
        />
      </div>

    </section>
  );
};

export default HeroSection_blog;
