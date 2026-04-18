import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useDashboardStats, useSubscriptionStatus } from "@/hooks/usePurchases";
import { useRouter } from "next/router";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface SidebarProps {
  onAvatarClick?: () => void;
}

export default function Sidebar({ onAvatarClick }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: stats } = useDashboardStats({ enabled: !!user });
  const { data: subscription } = useSubscriptionStatus({ enabled: !!user });

  const resolvedAvatar = resolveApiAssetUrl(user?.avatar) || "/images/profile.png";
  const [avatarSrc, setAvatarSrc] = useState(resolvedAvatar);

  useEffect(() => {
    setAvatarSrc(resolveApiAssetUrl(user?.avatar) || "/images/profile.png");
  }, [user?.avatar]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const badgeText = subscription?.hasActiveMembership
    ? subscription.membershipType || "Premium Member"
    : user?.role === "admin"
    ? "Admin"
    : "Free Member";

  const badgeBg = subscription?.hasActiveMembership ? "bg-green-600" : "bg-[#09339B]";

  const membershipType = subscription?.membershipType?.toLowerCase() ?? "";

  // A plan is "lifetime" if its slug contains lifetime/ultimate/forever keywords
  // OR if the expiry date is more than 50 years away (100-year lifetime plans)
  const LIFETIME_KEYWORDS = ["lifetime", "ultimate", "forever", "permanent", "unlimited"];
  const isLifetimeBySlug = LIFETIME_KEYWORDS.some((kw) => membershipType.includes(kw));
  const isLifetimeByDate = !!subscription?.expiresAt &&
    (new Date(subscription.expiresAt).getFullYear() - new Date().getFullYear()) >= 50;
  const isLifetime = isLifetimeBySlug || isLifetimeByDate;

  // Plan tier: higher number = higher plan. Lifetime is the top — no upgrade exists.
  const PLAN_TIER: Record<string, number> = { basic: 1, premium: 2, lifetime: 3, ultimate: 3 };
  const currentTier = isLifetime
    ? 3
    : Object.entries(PLAN_TIER).reduce((acc, [key, val]) => {
        return membershipType.includes(key) ? Math.max(acc, val) : acc;
      }, 0);
  // Show upgrade button: if no membership OR if on basic/premium (not lifetime/ultimate)
  const showUpgradeButton = !subscription?.hasActiveMembership || currentTier < 3;

  const daysRemaining = subscription?.expiresAt
    ? Math.max(0, Math.ceil((new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalDays =
    subscription?.startsAt && subscription?.expiresAt
      ? Math.max(1, Math.ceil((new Date(subscription.expiresAt).getTime() - new Date(subscription.startsAt).getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

  const subscriptionProgress = subscription?.hasActiveMembership
    ? Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100)
    : 0;

  return (
    <div className="sticky top-20 space-y-6">
      {/* PROFILE BOX */}
      <div className="relative flex flex-col items-start text-left mt-6 p-5 border border-[#9FBBFF] rounded-lg bg-white shadow-sm md:items-center md:text-center md:h-[440px] px-4">
        {/* Member Badge */}
        <p className={`${badgeBg} text-white capitalize font-medium px-2 py-1 rounded-lg absolute top-6 right-6 md:right-2 xl:right-6 text-[10px] xl:text-[12px]`}>
          {badgeText}
        </p>

        {/* Mobile: Image left + content right */}
        <div className="flex w-full gap-4 items-center md:flex-col md:items-center md:text-center">
          {/* Profile Image Wrapper */}
          <div className="relative w-32 h-32 xl:w-40 xl:h-40 flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={avatarSrc}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover w-full h-full"
                onError={() => setAvatarSrc("/images/profile.png")}
              />
            </div>

            {/* Camera button */}
            <button
              onClick={onAvatarClick}
              aria-label="Change profile photo"
              className="absolute -right-1 -bottom-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12.6973 3.5H11.3029C10.5883 3.5 10.231 3.5 9.91061 3.612C9.71493 3.68039 9.53107 3.77879 9.36562 3.90367C9.09468 4.10816 8.89649 4.40544 8.50012 5C8.29712 5.30452 7.99788 5.75337 7.87861 5.87871C7.58308 6.18927 7.19557 6.39666 6.77323 6.47029C6.60278 6.5 6.41979 6.5 6.05381 6.5C5.07373 6.5 4.5837 6.5 4.18301 6.61342C3.18068 6.89716 2.39728 7.68055 2.11354 8.68289C2.00012 9.08357 2.00012 9.57361 2.00012 10.5537V14.5C2.00012 17.3284 2.00012 18.7426 2.8788 19.6213C3.75748 20.5 5.1717 20.5 8.00012 20.5H16.0001C18.8285 20.5 20.2427 20.5 21.1214 19.6213C22.0001 18.7426 22.0001 17.3284 22.0001 14.5V10.5537C22.0001 9.57361 22.0001 9.08357 21.8867 8.68289C21.6029 7.68055 20.8195 6.89716 19.8172 6.61342C19.4165 6.5 18.9265 6.5 17.9464 6.5C17.5804 6.5 17.3974 6.5 17.227 6.47029C16.8046 6.39666 16.4171 6.18927 16.1216 5.87871C16.0023 5.75336 15.7031 5.30451 15.5001 5C15.1037 4.40544 14.9055 4.10816 14.6346 3.90367C14.4691 3.77879 14.2853 3.68039 14.0896 3.612C13.7692 3.5 13.4119 3.5 12.6973 3.5Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.0001 13C16.0001 15.2091 14.2092 17 12.0001 17C9.79098 17 8.00012 15.2091 8.00012 13C8.00012 10.7909 9.79098 9 12.0001 9C14.2092 9 16.0001 10.7909 16.0001 13Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.0002 9.5V9.51" stroke="#141B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right Content */}
          <div className="text-left md:text-center flex-1 md:flex md:flex-col md:items-center md:w-full mt-6">
            <h2 className="text-[22px] md:text-[26px] font-normal">{user?.name || "—"}</h2>

            <div className="mt-2 md:mt-10 space-y-4 md:self-start md:text-left">
              <div className="flex gap-1 md:gap-2 items-center">
                <img src="/images/mail.png" alt="" className="w-4 md:w-5 h-4 md:h-5" />
                <p className="text-[#AFAFAF] text-[14px] md:text-[16px] text-ellipsis overflow-hidden">
                  {user?.email || "—"}
                </p>
              </div>

              <div className="flex gap-1 md:gap-2 items-center">
                <img src="/images/phone.png" alt="" className="w-4 h-4 md:w-5 md:h-5" />
                <p className="text-[#AFAFAF] text-[14px] md:text-[16px]">
                  {user?.phone
                    ? user.phone.startsWith("+91")
                      ? "+91 " + user.phone.slice(3)
                      : user.phone
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full mt-4 flex gap-3 md:flex-col">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-[#09339B] text-[#09339B] px-4 py-2 rounded-md w-1/2 md:w-full hover:bg-[#f0f4ff] transition"
          >
            <img src="/images/logout.png" alt="Logout icon" className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* SUBSCRIPTION BOX */}
      <div className="p-5 border border-[#9FBBFF] rounded-lg bg-white shadow-sm">
        <h3 className="text-[20px] md:text-[26px] font-normal mb-2">Subscription Status</h3>

        {subscription?.hasActiveMembership ? (
          <>
            {/* <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              Active
            </span> */}
            <p className="text-[16px] text-gray-600 mt-2 font-medium capitalize">
              {subscription.membershipType || "Premium Membership"}
            </p>

            {/* Lifetime — no dates or progress bar needed */}
            {!isLifetime && (
              <div className="mt-3 text-[14px] text-[#454545] space-y-2">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span>{formatDate(subscription.startsAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expiry Date:</span>
                  <span>{formatDate(subscription.expiresAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days Remaining:</span>
                  <span className="font-medium">{daysRemaining}</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#09339B] rounded-full transition-all"
                    style={{ width: `${subscriptionProgress}%` }}
                  />
                </div>
                <p className="text-[13px] text-[#929292] text-right">
                  {Math.round(subscriptionProgress)}% elapsed
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-[14px] text-gray-500 mt-2">
            You don&apos;t have an active membership plan.
          </p>
        )}

        {showUpgradeButton && (
          <>
            <div className="border-b border-[#696969] w-full mt-6"></div>
            <Link href="/plans">
              <button className="mt-6 flex items-center justify-center gap-2 border border-[#09339B] text-[#09339B] px-4 py-2 rounded-md w-full hover:bg-[#f0f4ff] transition">
                <span className="font-medium">
                  {subscription?.hasActiveMembership ? "Upgrade Plan" : "Buy Membership"}
                </span>
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
