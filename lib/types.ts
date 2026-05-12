export type UserType = "fresher" | "intermediate" | "professional";
export type Plan = "free" | "fresher_pack" | "pro_monthly" | "professional_pack";
export type ResumeStatus = "draft" | "generating" | "generated" | "failed";

export interface ResumeContent {
  personal?: {
    full_name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary?: string;
    industry?: string;
    years_experience?: number;
  };
  experiences?: Array<{
    company: string;
    title: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
    location?: string;
    bullets?: string[];
    technologies?: string[];
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    technologies?: string[];
    url?: string;
    github?: string;
  }>;
  educations?: Array<{
    degree: string;
    institution: string;
    field?: string;
    start_year?: string;
    end_year?: string;
    gpa?: string;
  }>;
  skills?: {
    technical?: string[];
    tools?: string[];
    soft?: string[];
    languages?: string[];
  };
  certifications?: Array<{ name: string; provider?: string; year?: string }>;
  achievements?: string[];
}

export interface GeneratedResume {
  headline: string;        // Objective / Summary / Executive Summary
  sections: Array<{
    title: string;
    items: Array<{
      heading?: string;
      subheading?: string;
      meta?: string;
      bullets?: string[];
      tags?: string[];
      body?: string;
    }>;
  }>;
}
