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
  category: "frontend" | "backend" | "tools" | "other";
  level?: number; // 1-100
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
