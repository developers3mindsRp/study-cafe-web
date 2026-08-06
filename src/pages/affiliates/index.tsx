import { PublicLayout } from "@/components/layout";
import BannerSectionAffiliates from "@/components/layout/affiliates/BannerSection";
import Breadcrumbs from "@/components/Breadcrumb";
import React, { useState } from "react";
import type { FAQ } from "@/types/models.types";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_FAQS: FAQ[] = [
  { id: '1', question: "Is Studycafe a Legal Company?", answer: "Yes, it is legal company. You can find Studycafe Private Limited on the official website of the Ministry of Corporate Affairs, and you can check the registration details on the same." },
  {id: '2', question: "What are the Application Criteria?", answer:"There are no requirements to apply with us. It does not necessitate any prior knowledge or educational qualification. You only need your phone or Laptop to find out the information."},
  {id: '3', question: "Are there any fees to join the Studycafe affiliate program?",answer:"No there is no Fees to Join Studycafe affiliate program."},
  {id: '4', question: "How can I track my affiliate earnings and performance?",answer:"Our state-of-the-art tracking system ensures that you receive credit for all the traffic and conversions generated through your affiliate efforts. You can monitor your performance in real-time in My Account page under earning section and see how your efforts translate into earnings."},
  {id: '5', question: "How Much Revenue we will Earn through Studycafe Affiliate Program?",answer:"Every time someone clicks on your affiliate link and makes a purchase on Studycafe through your link, you earn a commission. The more successful referrals you make, the higher your earnings potential. Studycafe offers competitive commission rates, allowing you to earn from 25% to 50% on each sale."},
  {id:'6',question:"When and how do affiliates get paid from Studycafe Affiliate Program?", answer:"Studycafe pays out commissions on a regular basis, ensuring that you receive your earnings promptly and hassle-free. This extra income can be a valuable addition to your financial resources. Once your consolidated earning reaches Rs. 1000 we will make the payout." }
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Join the Program",
    description:
      "Sign up on our website in a couple of minutes. There is no fee, no prior experience and no educational qualification required.",
  },
  {
    step: "02",
    title: "Share Your Links",
    description:
      "Get ready-to-use course links, banners and text links from the My Account section and share them on social media, blogs or your website.",
  },
  {
    step: "03",
    title: "Earn Commissions",
    description:
      "Every purchase made through your link earns you up to 40% commission, tracked in real time and paid out once you cross ₹ 1,000.",
  },
];

const BENEFITS = [
  {
    title: "High-Quality Courses",
    description:
      "A vast library of courses covering in-demand topics, so you always promote content that genuinely converts.",
    icon: (
      <path d="M12 3 2 8l10 5 10-5-10-5Zm0 9v9m-6-6.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-5.5" />
    ),
  },
  {
    title: "Lucrative Commissions",
    description:
      "Earn up to 40% on every sale — one of the highest payouts in the online education affiliate space.",
    icon: (
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    title: "Diverse Marketing Material",
    description:
      "Customised linking tools, banners and course creatives that make promotion effortless.",
    icon: (
      <path d="M4 4h16v12H5.17L4 17.17V4Zm4 4h8M8 12h5" />
    ),
  },
  {
    title: "Real-Time Tracking",
    description:
      "A transparent dashboard shows clicks, conversions and earnings the moment they happen.",
    icon: (
      <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
    ),
  },
  {
    title: "Supportive Community",
    description:
      "Join a community of affiliates who share your passion for education. Connect, learn and grow together.",
    icon: (
      <path d="M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75" />
    ),
  },
  {
    title: "Zero Investment",
    description:
      "Completely free to join. No upfront cost, no monthly fee — you only need a phone or a laptop.",
    icon: (
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-10 2 2 4-4" />
    ),
  },
];

const COMMISSION_SLABS = [
  { plan: "Free Members", commission: "20%" },
  { plan: "Basic Members", commission: "25%" },
  { plan: "Premium Members", commission: "30%" },
  { plan: "Ultimate Members", commission: "40%", highlight: true },
];

const TOP_EARNERS = [
  {
    name: "Shabir Virk",
    role: "Finance Professional",
    image: "https://studycafe.in/wp-content/uploads/2023/11/Shabir-Virk.jpg",
    quote:
      "I was skeptical at first about affiliate marketing, but after signing up for Studycafe affiliate program, I was pleasantly surprised at how easy it was to get started and start earning money. My first month, I made over Rs. 40,000, and I've been making consistently over 50,000 per month ever since. I highly recommend Studycafe affiliate program to anyone looking to make a serious income online.",
  },
  {
    name: "Prabhat",
    role: "CA Final",
    image: "https://studycafe.in/wp-content/uploads/2023/11/Prabhat-Goyal.jpg",
    quote:
      "I am CA Final Student, but I've never made as much money as I have since joining Studycafe affiliate program. The team is incredibly supportive and helpful, and the affiliate program is very generous. I've made over Rs. 50,000 each month for the past few months, and I'm on track to make even more this month. If you're looking for an affiliate program that can help you achieve your financial goals, look no further than Studycafe affiliate program.",
  },
  {
    name: "Monika",
    role: "CA",
    image: "/images/userplaceholder.png",
    quote:
      "I was looking for a way to make money while I'm in working. I tried a few different affiliate programs, but they all required a lot of upfront investment. Then I joined Studycafe affiliate program. It's completely free to join, and I've been making over Rs. 50,000 per month without having to spend a dime. Studycafe affiliate program is the best way to make money online.",
  },
];

const FEATURED_IN = [
  {
    title:
      "Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals",
    href: "https://www.hindustantimes.com/brand-stories/studycafe-courses-unveils-premier-chatgpt-program-shaping-the-next-generation-of-students-and-professionals-101698658445763.html",
    image: "https://old.studycafe.in/wp-content/uploads/2023/10/ht-media_1.png",
  },
  {
    title:
      "Featured In Studycafe Courses Unveils Premier ChatGPT Program: Shaping the Next Generation of Students and Professionals",
    href: "https://www.lokmattimes.com/business/studycafe-courses-unveils-premier-chatgpt-program-shaping-the-next-generation-of-students-and/",
    image: "https://old.studycafe.in/wp-content/uploads/2023/10/Lt-media.png",
  },
  {
    title: "Featured In Studycafe Launches Practical GST Return Filing program",
    href: "https://aninews.in/news/business/business/studycafe-launches-practical-gst-return-filing-program20230113170807/",
    image: "https://old.studycafe.in/wp-content/uploads/2023/03/ANI.png",
  },
  {
    title: "Featured In Studycafe Launches Practical GST Return Filing program",
    href: "https://theprint.in/ani-press-releases/studycafe-launches-practical-gst-return-filing-program/1313085/",
    image: "https://old.studycafe.in/wp-content/uploads/2023/03/The-Print.png",
  },
  {
    title: "Featured In Studycafe Launches Practical GST Return Filing program",
    href: "https://www.zee5.com/articles/studycafe-launches-practical-gst-return-filing-program",
    image: "https://old.studycafe.in/wp-content/uploads/2023/08/Zee5_Official_logo.svg_.png",
  },
  {
    title: "Featured In Studycafe Launches Practical GST Return Filing program",
    href: "https://m.dailyhunt.in/news/india/english/ani+english-epaper-anieng/studycafe+launches+practical+gst+return+filing+program-newsid-n461748852?sm=Y",
    image: "https://old.studycafe.in/wp-content/uploads/2023/08/Dailyhunt.png",
  },
];

const FOUNDERS = [
  {
    name: "Deepak Gupta",
    role: "Co Founder",
    image: "https://assets.studycafe.in/uploads/2023/10/Deepak-Gupta-Profile-Pic_1.jpg",
    linkedin: "https://www.linkedin.com/in/deepak-gupta-33789936/",
    handle: "/deepak-gupta",
  },
  {
    name: "CA Pratibha Goyal",
    role: "Co Founder",
    image: "https://old.studycafe.in/wp-content/uploads/2023/10/CA-Pratibha-Goyal-Profile-Pic.png",
    linkedin: "https://www.linkedin.com/in/pratibha-goyal-269b27186/",
    handle: "/pratibha-goyal",
  },
];

const SOCIALS = [
  { href: "https://x.com/studycafe_in", icon: "/images/icons/x.svg", label: "Twitter" },
  { href: "https://www.instagram.com/studycafe.in/", icon: "/images/icons/insta.svg", label: "Instagram" },
  { href: "https://www.linkedin.com/company/studycafe/?originalSubdomain=in", icon: "/images/icons/linkedin.svg", label: "LinkedIn" },
  { href: "https://www.facebook.com/Studycafe.in", icon: "/images/icons/fb.svg", label: "Facebook" },
  { href: "https://www.youtube.com/@studycafeoriginal", icon: "/images/icons/yt.svg", label: "YouTube" },
  { href: "https://t.me/studycafe_in", icon: "/images/icons/telegram.svg", label: "Telegram" },
];

function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="text-[24px] font-semibold text-[#1A1A1A] md:text-[32px] xl:text-[38px]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[17px] xl:text-[18px] ${
            align === "center" ? "mx-auto max-w-3xl" : ""
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function Affiliates() {
  const faqs = FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PublicLayout>
      <div className="bg-[#E8F1FF]">
        <Breadcrumbs />
      </div>

      <BannerSectionAffiliates />

      {/* Intro */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading
          title="Unlock Earnings and Empower Education"
          subtitle="Online learning has become an integral part of personal and professional growth. Studycafe is committed to making quality education accessible to as many people as possible — and the Affiliate Program lets you be part of that mission while earning commissions of up to 40%."
        />
      </section>

      {/* How it works */}
      <section className="bg-[#F9F9FB] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How the Program Works"
            subtitle="Three simple steps between you and your first commission."
          />
          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-[14px] border border-[#E4E7EF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md md:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#09339B] text-[18px] font-semibold text-white">
                  {item.step}
                </span>
                <h3 className="mt-5 text-[18px] font-semibold text-[#252525] md:text-[20px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading
          title="Why Choose the Studycafe Affiliate Program"
          subtitle="Everything you need to build a reliable second income around education."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-[14px] border border-[#E4E7EF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#09339B]/30 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#09339B]/10">
                <svg
                  className="h-6 w-6 text-[#09339B]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-[18px] font-semibold text-[#252525] md:text-[20px]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission slab */}
      <section className="bg-[#F9F9FB] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Commission Slab by Membership Level"
            subtitle="Your commission rate grows with your Studycafe membership level."
          />

          {/* mobile cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:hidden">
            {COMMISSION_SLABS.map((slab) => (
              <div
                key={slab.plan}
                className={`flex items-center justify-between rounded-[12px] border bg-white p-5 shadow-sm ${
                  slab.highlight ? "border-[#09339B]" : "border-[#E4E7EF]"
                }`}
              >
                <div>
                  <p className="text-[16px] font-medium text-[#252525]">{slab.plan}</p>
                  {slab.highlight ? (
                    <span className="mt-1 inline-block rounded-full bg-[#09339B]/10 px-2 py-0.5 text-[12px] font-medium text-[#09339B]">
                      Highest payout
                    </span>
                  ) : null}
                </div>
                <p className="text-[24px] font-semibold text-[#09339B]">{slab.commission}</p>
              </div>
            ))}
          </div>

          {/* desktop table */}
          <div className="mt-10 hidden overflow-hidden rounded-[14px] border border-[#E4E7EF] bg-white shadow-sm md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#09339B] text-white">
                  <th className="px-6 py-4 text-left text-[16px] font-medium">Plan Name</th>
                  <th className="px-6 py-4 text-right text-[16px] font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {COMMISSION_SLABS.map((slab) => (
                  <tr
                    key={slab.plan}
                    className={`border-t border-[#E4E7EF] ${
                      slab.highlight ? "bg-[#09339B]/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-[16px] font-medium text-[#252525]">
                      {slab.plan}
                      {slab.highlight ? (
                        <span className="ml-3 inline-block rounded-full bg-[#09339B]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#09339B]">
                          Highest payout
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-right text-[20px] font-semibold text-[#09339B]">
                      {slab.commission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-[14px] text-[#6C6C6C]">
            Payouts are released once your consolidated earning reaches ₹ 1,000.
          </p>
        </div>
      </section>

      {/* What you can promote */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading
          title="What You Can Promote"
          subtitle="Pick from our full catalogue of courses and memberships — every purchase through your link counts."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <a
            href="https://studycafe.in/courses/"
            title="Online Courses"
            className="group rounded-[14px] border border-[#E4E7EF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#09339B]/30 hover:shadow-md"
          >
            <h3 className="text-[20px] font-semibold text-[#252525] md:text-[22px]">
              Online Courses
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
              Certification courses on GST, Income Tax, AI, Excel and more — trusted by thousands
              of finance professionals.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-[#09339B]">
              Explore Courses
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a
            href="https://studycafe.in/plans/"
            title="StudyCafe Membership"
            className="group rounded-[14px] border border-[#E4E7EF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#09339B]/30 hover:shadow-md"
          >
            <h3 className="text-[20px] font-semibold text-[#252525] md:text-[22px]">
              StudyCafe Membership
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
              Full-access memberships that unlock the entire library — our highest converting and
              highest paying product.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-[#09339B]">
              Explore Memberships
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </a>
        </div>
      </section>

      {/* Top selling course */}
      <section className="bg-[#F9F9FB] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Top Selling Courses"
            subtitle="Start with the courses our affiliates convert best."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/course/certification-course-on-ai-powered-ca-practice-automation"
              className="group block h-full"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E4E7EF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative">
                  <img
                    src="https://assets.studycafe.in/uploads/2026/07/1785226334038-qt4w8nis.jpeg"
                    alt="Certification Course on AI-Powered CA Practice Automation"
                    className="h-[200px] w-full object-cover md:h-[220px]"
                  />
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[14px] shadow">
                    <img src="/images/icons/star.svg" alt="" className="h-4 w-4" />
                    4.7
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-5 text-[14px] text-[#6a6969]">
                    <span className="flex items-center gap-1.5">
                      <img src="/images/clock-02.svg" alt="" width="18" height="18" />2 hr
                    </span>
                    <span className="flex items-center gap-1.5">
                      <img src="/images/eng-dark.svg" alt="" width="18" height="18" />
                      English
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-[17px] font-medium leading-snug text-[#252525] md:text-[19px]">
                    Certification Course on AI-Powered CA Practice Automation
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-[14px] text-[#6a6969]">
                    <img src="/images/user-dark.svg" alt="" width="18" height="18" />
                    592 students
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <div>
                      <span className="text-[15px] text-gray-400 line-through">₹ 1,999</span>
                      <span className="ml-2 text-[19px] font-semibold text-[#252525]">₹ 0</span>
                    </div>
                    <span className="rounded-md bg-[#09339B] px-4 py-2 text-[14px] text-white transition group-hover:bg-[#072a80]">
                      View Course
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Top earners */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading
          title="Meet Our Top Earners"
          subtitle="Real affiliates, real payouts — here is what they have to say."
        />
        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
          {TOP_EARNERS.map((earner) => (
            <figure
              key={earner.name}
              className="flex h-full flex-col rounded-[14px] border border-[#E4E7EF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md md:p-7"
            >
              <svg
                className="h-8 w-8 text-[#09339B]/20"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.17A2 2 0 0 1 7.17 9V6Zm11 0A5.17 5.17 0 0 0 13 11.17V18h6.83v-6.83h-3.66a2 2 0 0 1 2-2.17V6Z" />
              </svg>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
                {earner.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-[#E4E7EF] pt-5">
                <span className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-[#F9F9FB]">
                  <img
                    src={earner.image}
                    alt={earner.name}
                    className="absolute left-0 top-0 h-full w-full object-cover"
                  />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold text-[#252525]">
                    {earner.name}
                  </span>
                  <span className="block text-[14px] text-[#09339B]">{earner.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#09339B] to-[#2C56C7] px-6 py-10 text-center md:px-12 md:py-14">
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-white/10" />
          <h2 className="relative text-[24px] font-semibold text-white md:text-[32px] xl:text-[36px]">
            Become a StudyCafe Affiliate Partner
          </h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-[17px]">
            Free to join, no qualification needed. Start promoting today and turn your network into
            a steady income.
          </p>
          <div className="relative mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="https://studycafe.in/user/register.php"
              className="rounded-[10px] bg-white px-7 py-3.5 text-center text-[15px] font-medium text-[#09339B] transition hover:bg-[#EAF1FF] md:text-[16px]"
            >
              Register Now
            </a>
            <a
              href="https://studycafe.in/wp-login.php"
              className="rounded-[10px] border border-white px-7 py-3.5 text-center text-[15px] font-medium text-white transition hover:bg-white hover:text-[#09339B] md:text-[16px]"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* Featured in */}
      <section className="bg-[url('/images/alumini-bg.png')] bg-no-repeat bg-cover py-3 md:py-12 px-4 md:px-8 pb-8 md:pb-20 mb-8">
        <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-medium text-center mb-6 text-white px-2 mt-4">
          Featured In
        </h2>
        <div className="container mx-auto px-2 md:px-0">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-10">
            {FEATURED_IN.map((item) => (
              <div key={item.href} className="col-md-2">
                <div className="card user-card">
                  <div className="card-block">
                    <div className="bg-white p-[15px] rounded-[10px]">
                      <a target="_blank" title={item.title} href={item.href}>
                        <img src={item.image} className="img-radius" alt={item.title} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers. Find everything you need to know about the Studycafe Affiliate Program."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id ?? index}
                className={`mb-3 overflow-hidden rounded-[12px] border transition ${
                  isOpen ? "border-[#09339B]" : "border-[#E4E7EF]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-3 bg-white p-4 text-left md:p-5"
                >
                  <span className="flex-1 text-[16px] font-medium leading-[140%] text-black md:text-[18px]">
                    {index + 1}. {item.question}
                  </span>

                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 h-5 w-5 flex-shrink-0 text-[#09339B]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#E4E7EF] bg-white p-4 text-[15px] leading-relaxed text-[#3a3c3e] md:p-5 md:text-[16px]">
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Founders */}
      <section className="bg-[#F9F9FB] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading title="Founders" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className="rounded-[14px] border border-[#E4E7EF] bg-white p-6">
                <div className="flex items-center gap-5">
                  <div className="relative h-[90px] w-[90px] flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="absolute left-0 top-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#252525] md:text-[20px]">
                      {founder.name}
                    </h3>
                    <p className="text-[15px] text-[#09339B] md:text-[17px]">{founder.role}</p>
                  </div>
                </div>
                <hr className="my-5 border-[#E4E7EF]" />
                <a
                  className="flex items-center text-[15px] text-[#6C6C6C] transition hover:text-[#09339B] md:text-[16px]"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${founder.name} Linkedin`}
                  href={founder.linkedin}
                >
                  <img src="/images/icons/linkedin.svg" alt="LinkedIn" className="mr-2" />
                  {founder.handle}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with us */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 rounded-[14px] border border-[#E4E7EF] bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <h3 className="text-[20px] font-semibold text-[#252525] md:text-[24px]">
              Connect With Us
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
              <strong className="block text-[#252525]">Studycafe Private Limited</strong>
              1003, 10th Floor, Modi Tower 98, Nehruplace
              <br />
              Delhi, 110019 - India
            </p>
          </div>
          <div className="md:text-right">
            <strong className="block text-[16px] text-[#252525]">Social Profiles</strong>
            <div className="mt-4 flex flex-wrap gap-3 md:justify-end">
              {SOCIALS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7EF] transition hover:border-[#09339B] hover:bg-[#09339B]/5"
                >
                  <img src={social.icon} alt={social.label} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
