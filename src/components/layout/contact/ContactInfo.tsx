import type { ContactPageData } from "@/lib/contact-page-data";

type Props = {
  data: ContactPageData;
};

const SOCIAL_ICONS: Array<{
  key: keyof ContactPageData;
  icon: string;
  label: string;
}> = [
  { key: "socialLinkedin", icon: "ln-b.svg", label: "LinkedIn" },
  { key: "socialX", icon: "x-b.svg", label: "X" },
  { key: "socialInstagram", icon: "insta-b.svg", label: "Instagram" },
  { key: "socialFacebook", icon: "fb-b.svg", label: "Facebook" },
  { key: "socialTelegram", icon: "telegram-b.svg", label: "Telegram" },
  { key: "socialYoutube", icon: "youtube-b.svg", label: "YouTube" },
];

export default function ContactInfo({ data }: Props) {
  const socials = SOCIAL_ICONS.map((s) => ({
    href: String(data[s.key] || "").trim(),
    icon: s.icon,
    label: s.label,
  })).filter((s) => s.href.length > 0);

  return (
    <div className="mb-10 text-center md:mt-10">
      <h1 className="p-4 text-[30px] font-semibold text-[#09339B] md:text-[42px] 2xl:text-[62px]">
        {data.heading}
      </h1>
      <div
        className="article-rich-text p-4 text-[18px] text-gray-600 xl:text-[24px]"
        dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:px-12 lg:grid-cols-4 xl:h-[320px]">
        <div className="flex flex-col justify-center rounded-xl border border-[#9FBBFF] bg-white p-8 text-center transition hover:shadow-md">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <img src="/images/email1.svg" alt="" className="h-16 w-16" />
          </div>
          <h3 className="mb-2 text-[20px] font-medium text-[#252525] xl:text-[30px]">
            {data.emailCardTitle}
          </h3>
          <a
            className="text-[16px] text-gray-600 hover:text-[#09339B]"
            href={`mailto:${encodeURIComponent(data.email)}`}
          >
            {data.email}
          </a>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-[#9FBBFF] bg-white p-8 text-center transition hover:shadow-md">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <img src="/images/phone1.svg" alt="" className="h-16 w-16" />
          </div>
          <h3 className="mb-2 text-[20px] font-medium text-[#252525] xl:text-[30px]">
            {data.phoneCardTitle}
          </h3>
          <a
            className="text-[16px] text-gray-600 hover:text-[#09339B]"
            href={`tel:${data.phone.replace(/\s/g, "")}`}
          >
            {data.phone}
          </a>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-[#9FBBFF] bg-white p-8 text-center transition hover:shadow-md">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <img src="/images/map.svg" alt="" className="h-16 w-16" />
          </div>
          <h3 className="mb-2 text-[20px] font-medium text-[#252525] xl:text-[30px]">
            {data.officeCardTitle}
          </h3>
          <p className="whitespace-pre-line text-[16px] text-gray-600">{data.address}</p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-[#9FBBFF] bg-white p-8 text-center transition hover:shadow-md">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <img src="/images/clock.svg" alt="" className="h-16 w-16" />
          </div>
          <h3 className="mb-2 text-[20px] font-medium text-[#252525] xl:text-[30px]">
            {data.workingHoursTitle}
          </h3>
          <p className="text-[16px] text-gray-600">{data.workingHoursLine1}</p>
          <p className="text-[16px] text-gray-600">{data.workingHoursLine2}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 bg-white px-4 sm:px-12 md:grid-cols-2 md:gap-4 md:px-8 xl:gap-6 xl:px-12">
        <div className="flex flex-col gap-4 rounded-lg border border-[#9FBBFF] p-5 md:flex-row md:items-center md:justify-between xl:p-6">
          <div>
            <p className="text-left text-[16px] font-medium text-[#252525] md:text-[18px]">
              {data.marketingBlurb}
            </p>
            <a
              className="text-left text-[14px] text-gray-600 md:text-[16px] hover:underline"
              href={`mailto:${encodeURIComponent(data.marketingEmail)}`}
            >
              {data.marketingEmail}
            </a>
          </div>
          <a
            href={`mailto:${encodeURIComponent(data.marketingEmail)}`}
            className="w-full rounded-lg border border-[#09339B] bg-[#F9F9FB] py-2 text-center text-[#09339B] transition hover:bg-[#09339B] hover:text-white md:w-auto md:px-5 xl:px-6 xl:py-3"
          >
            {data.marketingCta}
          </a>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-[#9FBBFF] p-5 md:flex-row md:items-center md:justify-between xl:p-6">
          <div>
            <p className="text-left text-[16px] font-medium text-[#252525] md:text-[18px]">
              {data.accountsBlurb}
            </p>
            <a
              className="text-left text-[14px] text-gray-600 md:text-[16px] hover:underline"
              href={`mailto:${encodeURIComponent(data.accountsEmail)}`}
            >
              {data.accountsEmail}
            </a>
          </div>
          <a
            href={`mailto:${encodeURIComponent(data.accountsEmail)}`}
            className="w-full rounded-lg border border-[#09339B] bg-[#F9F9FB] py-2 text-center text-[#09339B] transition hover:bg-[#09339B] hover:text-white md:w-auto md:px-5 xl:py-3 xl:px-6"
          >
            {data.accountsCta}
          </a>
        </div>
      </div>

      {(socials.length > 0 || data.followTitle.trim() || data.followDescription.trim()) && (
        <div className="mt-8 rounded-xl bg-white p-6 text-center shadow-sm md:p-8">
          <h3 className="mb-2 text-[26px] font-semibold text-[#09339B] md:text-[40px]">
            {data.followTitle}
          </h3>
          <p className="mb-6 text-[16px] text-[#454545] md:text-[24px]">{data.followDescription}</p>
          {socials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  <img src={`/images/${s.icon}`} className="h-8 w-8 md:h-12 md:w-12" alt="" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
