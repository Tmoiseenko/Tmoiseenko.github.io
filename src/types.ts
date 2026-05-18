export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "cms" | "devops" | "other";
  level?: number; // 1-100
}

export interface PluralForms {
  one: string;
  few?: string;
  many?: string;
  other?: string;
}

export interface Competency {
  label: string;
  description: string;
}

export interface Experience {
  company: string;
  role: string;
  from: string;
  to: string;
  description: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  about?: string;
  location: string;
  email: string;
  avatar?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    telegram?: string;
    phone?: string;
  };
  skills: Skill[];
  competencies?: Competency[];
  projects: Project[];
  experience: Experience[];
}

export interface UiDictionary {
  localeCode: string;
  pageTitle: string;
  dataSourceLabel: string;
  nav: {
    about: string;
    projects: string;
    skills: string;
    experience: string;
  };
  language: {
    ru: string;
    en: string;
    uz: string;
  };
  hero: {
    availability: string;
    contact: string;
  };
  about: {
    title: string;
    accent: string;
    endTransmission: string;
    competenciesTitle: string;
  };
  projects: {
    title: string;
    accent: string;
  };
  skills: {
    title: string;
    accent: string;
  };
  experience: {
    title: string;
    accent: string;
    present: string;
    duration: {
      year: PluralForms;
      month: PluralForms;
    };
  };
  footer: {
    email: string;
    signature: string;
  };
}

