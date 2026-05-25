import { resolveBlogImageSrc } from "./blogImage";
import TableOfContents from "./TableOfContent";
type HeroSectionBlogProps = {
  title: string;
  subtitle?: string;
  description?: string;
  para1?: string;
  para2?: string;
  author: string;
  date: string;
  update: string;
  image: string;
  toc?:any;
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
  toc
}: HeroSectionBlogProps) => {
  const bannerSrc = resolveBlogImageSrc(image) || "/images/s-court.png";

  const heroBanner = () => (
    // eslint-disable-next-line @next/next/no-img-element -- resolved CMS/API URLs; reliable in SSR + CSR
    <img
      src={bannerSrc}
      alt={title}
      width={1200}
      height={600}
      className="w-full h-auto object-cover"
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );

  return (
    <section className="space-y-6 container mx-auto px-4 bg-[#F5FAFF] md:bg-white pb-4">
      {/* Title */}
      <h1 className="text-[20px] md:text-[24px] xl:text-[28px] font-medium text-gray-900 leading-snug pt-4">
        {subtitle ? (
          <>
            {title}: <br className="hidden xl:block" /> {subtitle}
          </>
        ) : (
          title
        )}
      </h1>

      {/* Banner Image (mobile first) */}
      <div className="order-first md:order-none rounded-[10px] overflow-hidden block md:hidden">{heroBanner()}</div>

      {/* Description */}
      {description ? (
        <p className="text-[#3a3c3e] text-[16px] md:text-[17px] leading-[27px] md:leading-[32px] font-normal ">
          {description}
        </p>
      ) : null}
      {para1 ? <p className="text-[#3a3c3e] text-[17px] leading-[32px] font-normal">{para1}</p> : null}
      {para2 ? <p className="text-[#3a3c3e] text-[17px] leading-[32px] font-normal">{para2}</p> : null}

      {/* Author + Date */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 md:text-[16px] text-[#6a6969]  "
        suppressHydrationWarning
      >
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <img src="/images/user.svg" alt="author" width={20} height={20} />
            {author}
          </span>

          <span className="flex items-center gap-2 whitespace-nowrap" suppressHydrationWarning>
            <img src="/images/calendar.svg" alt="date" width={20} height={20} />
            {date}
          </span>
        </div>

        <span className="whitespace-nowrap" suppressHydrationWarning>
          Last update on {update}
        </span>
      </div>

      {/* Desktop Banner Image (only on md+) */}

      <TableOfContents toc={toc} />
      <div className="hidden md:block rounded-[10px] overflow-hidden shadow ">{heroBanner()}</div>
    </section>
  );
};

export default HeroSection_blog;
