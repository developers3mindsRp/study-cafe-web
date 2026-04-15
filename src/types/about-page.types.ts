/** CMS-driven About page blocks (stored in cms_pages slug `about`: title, content, meta). */

/** Optional profile URLs for team/manager social badges (icons stay default assets). */
export interface PersonSocial {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  social?: PersonSocial;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface StatItem {
  title: string;
  value: string;
  icon: string;
}

export interface MissionCard {
  title: string;
  description: string;
  icon: string;
}

export interface LeaderPerson {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

export interface AboutPageData {
  pageTitle: string;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  description: {
    heading: string;
    bodyHtml: string;
    imageUrl: string;
  };
  stats: StatItem[];
  mission: {
    sectionTitle: string;
    body: string;
    cards: [MissionCard, MissionCard];
  };
  journey: {
    sectionTitle: string;
    milestones: Milestone[];
  };
  leadership: {
    title: string;
    subtitle: string;
    leaders: LeaderPerson[];
  };
  managers: {
    sectionTitle: string;
    members: TeamMember[];
  };
  team: {
    sectionTitle: string;
    members: TeamMember[];
  };
  awards: {
    sectionTitle: string;
    images: string[];
  };
  featuredIn: {
    sectionTitle: string;
    logos: string[];
  };
  gallery: {
    images: string[];
  };
  message: {
    getInTouchTitle: string;
    companyName: string;
    address: string;
    founderSectionTitle: string;
    founderMessage: string;
    founderName: string;
    founderRole: string;
    founderImage: string;
    cardBackgroundImage: string;
  };
}
