import type { GetStaticProps } from "next";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { PublicLayout } from "@/components/layout";
import BannerSectionAffiliates from "@/components/layout/affiliates/BannerSection";
import Breadcrumbs from "@/components/Breadcrumb";
import { getPageContent } from "@/services/platform.service";
import { AFFILIATE_CMS_SLUG, mergeAffiliatePageFromCms } from "@/lib/affiliate-page-data";
import type { AffiliatePageData } from "@/types/affiliate-page.types";

/* ── Static content (not editable from the admin panel) ───────────── */

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

const SOCIALS = [
  { href: "https://x.com/studycafe_in", icon: "/images/icons/x.svg", label: "Twitter" },
  { href: "https://www.instagram.com/studycafe.in/", icon: "/images/icons/insta.svg", label: "Instagram" },
  { href: "https://www.linkedin.com/company/studycafe/?originalSubdomain=in", icon: "/images/icons/linkedin.svg", label: "LinkedIn" },
  { href: "https://www.facebook.com/Studycafe.in", icon: "/images/icons/fb.svg", label: "Facebook" },
  { href: "https://www.youtube.com/@studycafeoriginal", icon: "/images/icons/yt.svg", label: "YouTube" },
  { href: "https://t.me/studycafe_in", icon: "/images/icons/telegram.svg", label: "Telegram" },
];

/** Benefit icon keys the admin panel can choose from. */
const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  courses: <path d="M12 3 2 8l10 5 10-5-10-5Zm0 9v9m-6-6.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-5.5" />,
  earnings: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  marketing: <path d="M4 4h16v12H5.17L4 17.17V4Zm4 4h8M8 12h5" />,
  tracking: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  community: (
    <path d="M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75" />
  ),
  free: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-10 2 2 4-4" />,
  support: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
  trophy: <path d="M8 21h8m-4-4v4m-6-17h12v4a6 6 0 1 1-12 0V4Zm0 2H4a3 3 0 0 0 3 3m11-3h2a3 3 0 0 1-3 3" />,
};

const FALLBACK_ICON = BENEFIT_ICONS.free;

/* ── Shared bits ──────────────────────────────────────────────────── */

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
          className={`mt-3 text-[16px] leading-relaxed text-[#000] md:text-[17px] xl:text-[18px] ${
            align === "center" ? "mx-auto max-w-3xl" : ""
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

type AffiliatesPageProps = {
  affiliateData: AffiliatePageData;
};

export default function Affiliates({ affiliateData }: AffiliatesPageProps) {
  const { hero, intro, howItWorks, benefits, commission, promote, earners, ctaBand, faq, contact } =
    affiliateData;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PublicLayout>
      <div className="bg-[#E8F1FF]">
        <Breadcrumbs />
      </div>

      <BannerSectionAffiliates hero={hero} />

      {/* Intro */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading title={intro.title} subtitle={intro.subtitle} />
      </section>

      {/* How it works */}
      {howItWorks.steps.length > 0 ? (
        <section className="bg-[#F9F9FB] py-12 md:py-16">
          <div className="container mx-auto px-4">
            <SectionHeading title={howItWorks.sectionTitle} subtitle={howItWorks.subtitle} />
            <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
              {howItWorks.steps.map((item, i) => (
                <div
                  key={`${item.title}-${i}`}
                  className="relative rounded-[14px] border border-[#E4E7EF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md md:p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#09339B] text-[18px] font-semibold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold text-[#252525] md:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#000] md:text-[16px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Why choose */}
      {benefits.items.length > 0 ? (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <SectionHeading title={benefits.sectionTitle} subtitle={benefits.subtitle} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {benefits.items.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
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
                    {BENEFIT_ICONS[item.icon] ?? FALLBACK_ICON}
                  </svg>
                </span>
                <h3 className="mt-5 text-[18px] font-semibold text-[#252525] md:text-[20px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[#000] md:text-[16px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Commission slab */}
      {commission.slabs.length > 0 ? (
        <section className="bg-[#F9F9FB] py-12 md:py-16">
          <div className="container mx-auto px-4">
            <SectionHeading title={commission.sectionTitle} subtitle={commission.subtitle} />

            {/* mobile cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:hidden">
              {commission.slabs.map((slab, i) => (
                <div
                  key={`${slab.plan}-${i}`}
                  className={`flex items-center justify-between rounded-[12px] border bg-white p-5 shadow-sm ${
                    slab.highlight ? "border-[#09339B]" : "border-[#E4E7EF]"
                  }`}
                >
                  <div>
                    <p className="text-[16px] font-medium text-[#252525]">{slab.plan}</p>
                    {slab.highlight && slab.badge ? (
                      <span className="mt-1 inline-block rounded-full bg-[#09339B]/10 px-2 py-0.5 text-[12px] font-medium text-[#09339B]">
                        {slab.badge}
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
                  {commission.slabs.map((slab, i) => (
                    <tr
                      key={`${slab.plan}-${i}`}
                      className={`border-t border-[#E4E7EF] ${slab.highlight ? "bg-[#09339B]/5" : ""}`}
                    >
                      <td className="px-6 py-4 text-[16px] font-medium text-[#252525]">
                        {slab.plan}
                        {slab.highlight && slab.badge ? (
                          <span className="ml-3 inline-block rounded-full bg-[#09339B]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#09339B]">
                            {slab.badge}
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

            {commission.note ? (
              <p className="mt-4 text-center text-[14px] text-[#6C6C6C]">{commission.note}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* What you can promote */}
      {promote.cards.length > 0 ? (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <SectionHeading title={promote.sectionTitle} subtitle={promote.subtitle} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {promote.cards.map((card, i) => (
              <a
                key={`${card.title}-${i}`}
                href={card.href}
                title={card.title}
                className="group rounded-[14px] border border-[#E4E7EF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#09339B]/30 hover:shadow-md"
              >
                <h3 className="text-[20px] font-semibold text-[#252525] md:text-[22px]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[#000] md:text-[16px]">
                  {card.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-[#09339B]">
                  {card.ctaLabel}
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Top selling course — static */}
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
      {earners.items.length > 0 ? (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <SectionHeading title={earners.sectionTitle} subtitle={earners.subtitle} />
          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
            {earners.items.map((earner, i) => (
              <figure
                key={`${earner.name}-${i}`}
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
                <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-[#000] md:text-[16px]">
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
      ) : null}

      {/* CTA band */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#09339B] to-[#2C56C7] px-6 py-10 text-center md:px-12 md:py-14">
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-white/10" />
          <h2 className="relative text-[24px] font-semibold text-white md:text-[32px] xl:text-[36px]">
            {ctaBand.title}
          </h2>
          {ctaBand.subtitle ? (
            <p className="relative mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-[17px]">
              {ctaBand.subtitle}
            </p>
          ) : null}
          <div className="relative mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {ctaBand.primaryCta?.label ? (
              <a
                href={ctaBand.primaryCta.href}
                className="rounded-[10px] bg-white px-7 py-3.5 text-center text-[15px] font-medium text-[#09339B] transition hover:bg-[#EAF1FF] md:text-[16px]"
              >
                {ctaBand.primaryCta.label}
              </a>
            ) : null}
            {ctaBand.secondaryCta?.label ? (
              <a
                href={ctaBand.secondaryCta.href}
                className="rounded-[10px] border border-white px-7 py-3.5 text-center text-[15px] font-medium text-white transition hover:bg-white hover:text-[#09339B] md:text-[16px]"
              >
                {ctaBand.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Featured in — static */}
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
      {faq.items.length > 0 ? (
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <SectionHeading title={faq.sectionTitle} subtitle={faq.subtitle} />
          <div className="mx-auto mt-10 max-w-4xl">
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={`${item.question}-${index}`}
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
      ) : null}

      {/* Founders */}
     <section className="md:py-4">
        <div className="container mx-auto md:pt-4 md:pb-12 w-full px-4 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center items-center mt-8 md:mt-24">
                <h1 className="text-[30px] md:text-[40px] font-semibold text-[#252525] mb-4">Leadership &amp; Team</h1>
                <p className="text-[24px] text-[#454545]">The people behind Studycafe's success</p>
            </div>
            <div className="rounded-lg bg-white grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mx-auto">
                <div className="flex flex-col rounded-full mb-4">
                    <img
                        src="https://assets.studycafe.in/uploads/2026/07/1783925408148-ioe3g8c1.jpeg"
                        alt=""
                        className="md:w-[350px]"
                    />
                    <div className="flex justify-between pr-4 mt-2">
                        <h1 className="text-[18px] xl:text-[25px] font-medium text-[#454545]">CA Deepak Gupta</h1>
                        <a
                            href="https://www.linkedin.com/in/ca-deepak-gupta-/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="CA Deepak Gupta on LinkedIn"
                            ><img src="/images/linkedin.svg" alt="" className="w-4 h-4 xl:w-6 xl:h-6 mt-2 xl:mt-3"
                        /></a>
                    </div>
                    <span className="xl:text-[20px] text-[#454545]">Founder</span>
                </div>
                <div className="flex flex-col rounded-full mb-4">
                    <img
                        src="https://assets.studycafe.in/uploads/2026/07/1783925419742-knji9km9.jpeg"
                        alt=""
                        className="md:w-[350px]"
                    />
                    <div className="flex justify-between pr-4 mt-2">
                        <h1 className="text-[18px] xl:text-[25px] font-medium text-[#454545]">CA Pratibha Goyal</h1>
                        <a
                            href="https://www.linkedin.com/in/pratibha-goyal-269b27186/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="CA Pratibha Goyal on LinkedIn"
                            ><img src="/images/linkedin.svg" alt="" className="w-4 h-4 xl:w-6 xl:h-6 mt-2 xl:mt-3"
                        /></a>
                    </div>
                    <span className="xl:text-[20px] text-[#454545]">Co Founder</span>
                </div>
            </div>
        </div>
    </section>

      {/* Connect with us */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 rounded-[14px] border border-[#E4E7EF] bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <h3 className="text-[20px] font-semibold text-[#252525] md:text-[24px]">
              {contact.sectionTitle}
            </h3>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[#6C6C6C] md:text-[16px]">
              <strong className="block text-[#252525]">{contact.companyName}</strong>
              {contact.address}
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

export const getStaticProps: GetStaticProps<AffiliatesPageProps> = async () => {
  const cmsRow = await getPageContent(AFFILIATE_CMS_SLUG);

  return {
    props: {
      affiliateData: mergeAffiliatePageFromCms(cmsRow),
    },
    revalidate: 600,
  };
};
