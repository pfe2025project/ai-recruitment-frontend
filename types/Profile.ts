// data/dummyProfileData.ts

export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description?: string;
}

export interface Skill {
  name: string;
  isExtracted?: boolean; // To indicate if it was extracted from CV
}

export interface Language {
  name: string;
  level: string;
}

export interface Certification {
  name: string;
  issuingBody: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface JobPreferences {
  isAvailable: boolean;
  jobType: string;
  preferredLocation: string;
  noticePeriod: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  github?: string; // Added GitHub
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  about: string;
  experiences: Experience[];
  education: Education[];
  skills: string[]; // Still string[] for simplicity in display, but for edit we might convert to Skill[]
  languages: Language[];
  certifications: Certification[];
  jobPreferences: JobPreferences;
  contact: ContactInfo;
  cvLastUpdated: string;
  cvFile?: File | null; // For direct file handling in the form
  cvPdfUrl?: string; // URL if already uploaded
}