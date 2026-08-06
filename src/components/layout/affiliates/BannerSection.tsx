import React from "react";

const HIGHLIGHTS = [
  { value: "Up to 40%", label: "Commission" },
  { value: "₹ 0", label: "Joining Fee" },
  { value: "Real Time", label: "Earning Tracking" },
  { value: "₹ 1,000", label: "Minimum Payout" },
];

const BannerSectionAffiliates = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F1FF] via-[#EFF5FF] to-[#F8FBFF]">
      {/* decorative blobs */}
      <span className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#09339B]/10 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-[#4C7DF0]/10 blur-3xl" />

      <div className="container relative mx-auto px-4 pt-6 pb-10 md:pt-12 md:pb-16 xl:pt-16 xl:pb-20">
        <div className="flex items-center justify-center">
          <p className="rounded-[10px] bg-white px-4 py-3 text-[14px] font-medium shadow-sm md:text-[16px]">
            The Leader in Online Learning
          </p>
        </div>

        <div className="mx-auto mt-5 max-w-4xl text-center md:mt-7">
          <h1 className="text-[30px] font-bold leading-[1.15] text-[#09339B] md:text-[42px] xl:text-[58px]">
            Studycafe Affiliate Program
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#252525] md:text-[18px] xl:text-[22px]">
            Share courses you believe in and earn{" "}
            <span className="font-semibold text-[#09339B]">up to 40% commission</span> on every
            sale. Free to join, no qualification required.
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center md:mt-9">
            <a
              href="https://studycafe.in/user/register.php"
              className="rounded-[10px] bg-[#09339B] px-7 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-[#072a80] md:text-[16px]"
            >
              Become an Affiliate
            </a>
            <a
              href="https://studycafe.in/wp-login.php"
              className="rounded-[10px] border border-[#09339B] bg-white px-7 py-3.5 text-center text-[15px] font-medium text-[#09339B] transition hover:bg-[#09339B] hover:text-white md:text-[16px]"
            >
              Affiliate Login
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-5">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.label}
              className="rounded-[12px] border border-white bg-white/70 px-3 py-4 text-center shadow-sm backdrop-blur md:px-4 md:py-5"
            >
              <p className="text-[20px] font-semibold text-[#09339B] md:text-[26px]">
                {item.value}
              </p>
              <p className="mt-1 text-[13px] text-[#6C6C6C] md:text-[15px]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSectionAffiliates;
