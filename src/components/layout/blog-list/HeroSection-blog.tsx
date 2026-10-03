import Link from "next/link";
import Image from "next/image";
import { resolveBlogImageSrc } from "./blogImage";
import { isUnoptimizedImageSrc } from "@/utils/mediaUrl";
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
  toc?: any;
  /** Article-specific tags — rendered as clickable links to /blogs?search=Tag */
  tags?: { id: number; name: string }[];
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
  toc,
  tags,
}: HeroSectionBlogProps) => {
  const bannerSrc = resolveBlogImageSrc(image) || "/images/s-court.png";

  // The article's LCP element on mobile. It was a plain <img> of the original upload —
  // editors upload phone screenshots, so 200 KB–2 MB PNG/JPEGs were shipped to show it
  // ~350px wide. next/image serves a resized WebP (a 2 MB PNG comes back as ~50 KB).
  // `priority` preloads it from <head>. It is rendered twice (mobile slot / desktop
  // slot); both share one `sizes`, so the browser picks one URL and fetches it once.
  const heroBanner = () => (
    <Image
      src={bannerSrc}
      alt={title}
      width={1200}
      height={600}
      unoptimized={isUnoptimizedImageSrc(bannerSrc)}
      priority
      sizes="(max-width: 1023px) calc(100vw - 64px), 60vw"
      className="w-full h-auto object-cover"
      referrerPolicy="no-referrer"
    />
  );

  const handleCopy = (e: React.ClipboardEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    // console.log(window.location.href,"router")
  
    const currentUrl = `${window.location.href}`;
  
    e.clipboardData.setData(
      "text/plain",
      `${title}
Read more at: ${currentUrl}`
    );
  };
  return (
    <section className="space-y-6 container mx-auto px-4 bg-[#F5FAFF] md:bg-white pb-4">
      {/* Title */}
      <h1 onCopy={handleCopy} className="text-[20px] md:text-[24px] xl:text-[28px] font-medium text-gray-900 leading-snug pt-4">
        {subtitle ? (
          <>
            {title}: <br className="hidden xl:block" /> 
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

      <p className="text-[#3a3c3e] text-[16px] md:text-[17px] leading-[27px] md:leading-[32px] font-bold ">{subtitle}</p>
      {para1 ? <p className="text-[#3a3c3e] text-[17px] leading-[32px] font-normal">{para1}</p> : null}
      {para2 ? <p className="text-[#3a3c3e] text-[17px] leading-[32px] font-normal">{para2}</p> : null}

      {/* Author + Date */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 md:text-[16px] text-[#6a6969]  "
        suppressHydrationWarning
      >
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <img src="/images/user-black.svg" alt="author" width={20} height={20} className=" " />
            {author}
          </span>

          <span className="flex items-center gap-2 whitespace-nowrap" suppressHydrationWarning>
            <img src="/images/calendar-black.svg" alt="date" width={20} height={20} />
            {date}
          </span>
        </div>

        <span className="whitespace-nowrap" suppressHydrationWarning>
          Last update on {update}
        </span>
      </div>

      {/* Tags */}
      {/* {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[13px] font-medium text-[#6a6969] shrink-0">Tags:</span>
          {tags.map((t) => (
            <Link
              key={t.id}
              href={{ pathname: "/blogs", query: { search: t.name } }}
              className="inline-block rounded-full border border-[#AFAFAF] px-3 py-0.5 text-[13px] text-[#252525] hover:border-[#09339B] hover:text-[#09339B] transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>
      )} */}

      {/* Desktop Banner Image (only on md+) */}

      <TableOfContents toc={toc} />
      <div className="hidden md:block rounded-[10px] overflow-hidden shadow ">{heroBanner()}</div>
    </section>
  );
};

export default HeroSection_blog;
