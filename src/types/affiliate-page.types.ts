/**
 * Affiliate page CMS shape. Stored in cms_pages with slug='affiliates' (meta JSON).
 * Keep in sync with study-cafe-admin-panel/src/pages/cms/affiliatePageCms.ts.
 */

export interface AffiliateCta {
  label: string;
  href: string;
}

export interface AffiliateHighlight {
  value: string;
  label: string;
}

export interface AffiliateStep {
  step: string;
  title: string;
  description: string;
}

/** `icon` is a key from AFFILIATE_BENEFIT_ICONS; unknown keys fall back to a generic mark. */
export interface AffiliateBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface AffiliateSlab {
  plan: string;
  commission: string;
  highlight?: boolean;
  badge?: string;
}

export interface AffiliatePromoCard {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface AffiliateEarner {
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface AffiliateFaqItem {
  question: string;
  answer: string;
}

export interface AffiliatePageData {
  pageTitle: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: AffiliateCta;
    secondaryCta: AffiliateCta;
    highlights: AffiliateHighlight[];
  };
  intro: {
    title: string;
    subtitle: string;
  };
  howItWorks: {
    sectionTitle: string;
    subtitle: string;
    steps: AffiliateStep[];
  };
  benefits: {
    sectionTitle: string;
    subtitle: string;
    items: AffiliateBenefit[];
  };
  commission: {
    sectionTitle: string;
    subtitle: string;
    note: string;
    slabs: AffiliateSlab[];
  };
  promote: {
    sectionTitle: string;
    subtitle: string;
    cards: AffiliatePromoCard[];
  };
  earners: {
    sectionTitle: string;
    subtitle: string;
    items: AffiliateEarner[];
  };
  ctaBand: {
    title: string;
    subtitle: string;
    primaryCta: AffiliateCta;
    secondaryCta: AffiliateCta;
  };
  faq: {
    sectionTitle: string;
    subtitle: string;
    items: AffiliateFaqItem[];
  };
  contact: {
    sectionTitle: string;
    companyName: string;
    address: string;
  };
}
