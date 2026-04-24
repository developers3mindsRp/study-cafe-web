import type { PageContent, SeoMetadata } from "@/types/models.types";

/**
 * Aligned with cra-studycafe-admin `ContactContent` + `types/contactPageContent.ts` (slug `contact`).
 * All fields are driven from `cms_pages` row: `content` = description HTML, rest in `meta`.
 */
export type ContactPageData = {
  pageTitle: string;
  heading: string;
  descriptionHtml: string;
  email: string;
  phone: string;
  address: string;
  submitButtonText: string;
  formHeading: string;
  emailCardTitle: string;
  phoneCardTitle: string;
  officeCardTitle: string;
  workingHoursTitle: string;
  workingHoursLine1: string;
  workingHoursLine2: string;
  marketingBlurb: string;
  marketingEmail: string;
  marketingCta: string;
  accountsBlurb: string;
  accountsEmail: string;
  accountsCta: string;
  followTitle: string;
  followDescription: string;
  socialLinkedin: string;
  socialX: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTelegram: string;
  socialYoutube: string;
  mapTitle: string;
  mapDescription: string;
};

const DEFAULTS: ContactPageData = {
  pageTitle: "Contact Us",
  heading: "Get In Touch",
  descriptionHtml:
    "<p>Have questions or feedback? Reach out to us. We'd love to hear from you.</p>",
  email: "info@studycafe.in",
  phone: "+91 1234567890",
  address: "Studycafe Private Limited, New Delhi, India",
  submitButtonText: "Send Message",
  formHeading: "Send us a message",
  emailCardTitle: "Email",
  phoneCardTitle: "Phone",
  officeCardTitle: "Office",
  workingHoursTitle: "Working hours",
  workingHoursLine1: "Monday to Saturday",
  workingHoursLine2: "10:00 AM to 06:00 PM",
  marketingBlurb: "Talk to a member of our marketing team",
  marketingEmail: "marketing@studycafe.in",
  marketingCta: "Contact marketing team",
  accountsBlurb: "Talk to a member of our accounts team",
  accountsEmail: "accounts@studycafe.in",
  accountsCta: "Contact accounting team",
  followTitle: "Follow us",
  followDescription: "Stay connected for the latest updates, tips, and educational content.",
  socialLinkedin: "https://www.linkedin.com/company/studycafe",
  socialX: "",
  socialInstagram: "",
  socialFacebook: "",
  socialTelegram: "",
  socialYoutube: "",
  mapTitle: "Find us on the map",
  mapDescription:
    "Visit our office for in-person consultations or to pick up your course materials.",
};

function pick(
  m: Record<string, unknown>,
  key: string,
  fallback: string,
  allowEmpty = false
): string {
  const v = m[key];
  if (typeof v !== "string") return fallback;
  if (!allowEmpty && v.trim() === "") return fallback;
  return v;
}

export function mergeContactPageFromCms(cmsRow: PageContent | null): ContactPageData {
  if (!cmsRow) return { ...DEFAULTS };
  const m = (cmsRow.meta || {}) as Record<string, unknown>;
  const d = DEFAULTS;
  return {
    pageTitle: cmsRow.title?.trim() || d.pageTitle,
    heading: pick(m, "heading", d.heading),
    descriptionHtml:
      typeof cmsRow.content === "string" && cmsRow.content.trim() ? cmsRow.content : d.descriptionHtml,
    email: pick(m, "email", d.email),
    phone: pick(m, "phone", d.phone),
    address: pick(m, "address", d.address),
    submitButtonText: pick(m, "submitButtonText", d.submitButtonText),
    formHeading: pick(m, "formHeading", d.formHeading),
    emailCardTitle: pick(m, "emailCardTitle", d.emailCardTitle),
    phoneCardTitle: pick(m, "phoneCardTitle", d.phoneCardTitle),
    officeCardTitle: pick(m, "officeCardTitle", d.officeCardTitle),
    workingHoursTitle: pick(m, "workingHoursTitle", d.workingHoursTitle),
    workingHoursLine1: pick(m, "workingHoursLine1", d.workingHoursLine1),
    workingHoursLine2: pick(m, "workingHoursLine2", d.workingHoursLine2),
    marketingBlurb: pick(m, "marketingBlurb", d.marketingBlurb),
    marketingEmail: pick(m, "marketingEmail", d.marketingEmail),
    marketingCta: pick(m, "marketingCta", d.marketingCta),
    accountsBlurb: pick(m, "accountsBlurb", d.accountsBlurb),
    accountsEmail: pick(m, "accountsEmail", d.accountsEmail),
    accountsCta: pick(m, "accountsCta", d.accountsCta),
    followTitle: pick(m, "followTitle", d.followTitle),
    followDescription: pick(m, "followDescription", d.followDescription),
    socialLinkedin: pick(m, "socialLinkedin", d.socialLinkedin, true),
    socialX: pick(m, "socialX", d.socialX, true),
    socialInstagram: pick(m, "socialInstagram", d.socialInstagram, true),
    socialFacebook: pick(m, "socialFacebook", d.socialFacebook, true),
    socialTelegram: pick(m, "socialTelegram", d.socialTelegram, true),
    socialYoutube: pick(m, "socialYoutube", d.socialYoutube, true),
    mapTitle: pick(m, "mapTitle", d.mapTitle),
    mapDescription: pick(m, "mapDescription", d.mapDescription),
  };
}

export function contactSeoOrFallback(
  seo: SeoMetadata | null,
  data: ContactPageData
): { title: string; description: string } {
  return {
    title: seo?.metaTitle?.trim() || `${data.pageTitle} | StudyCafe`,
    description: seo?.metaDescription?.trim() || data.descriptionHtml.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}
