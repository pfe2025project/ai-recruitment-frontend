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

// Dummy data for demonstration purposes
export const dummyProfileData: ProfileData = {
  name: 'OUABBI Mohamed',
  title: 'Développeur Fullstack Senior',
  location: 'Paris, France',
  avatarUrl: '/images/cv.jpg', // Make sure you have this image in your public folder
  about: "Développeur Fullstack passionné avec plus de 8 ans d'expérience dans la création d'applications web robustes et évolutives. Expert en JavaScript, React, Node.js et bases de données NoSQL. Orienté solutions et toujours à la recherche de nouvelles technologies.",
  experiences: [
    {
      title: 'Développeur Fullstack Senior',
      company: 'Innovate Solutions',
      period: 'Jan 2022 - Présent',
      location: 'Paris, France',
      description: 'Développement et maintenance d\'applications web critiques utilisant React, Node.js et MongoDB. Mentoring d\'une équipe de 3 développeurs juniors. Implémentation de CI/CD et amélioration des performances.',
    },
    {
      title: 'Développeur Web',
      company: 'Creative Agency',
      period: 'Sept 2018 - Déc 2021',
      location: 'Lyon, France',
      description: 'Conception et développement de sites e-commerce sur mesure. Intégration API et optimisation SEO. Collaboration étroite avec les équipes de design et de marketing.',
    },
  ],
  education: [
    {
      degree: 'Master en Informatique',
      institution: 'Université Paris-Saclay',
      period: '2016 - 2018',
      location: 'Orsay, France',
      description: 'Spécialisation en Intelligence Artificielle et Systèmes Distribués.',
    },
    {
      degree: 'Licence en Sciences Informatiques',
      institution: 'Université Claude Bernard Lyon 1',
      period: '2013 - 2016',
      location: 'Lyon, France',
    },
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'Express.js',
    'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'CI/CD', 'Agile', 'GraphQL',
    'HTML', 'CSS', 'Tailwind CSS', 'Figma', 'Problem Solving', 'Leadership'
  ],
  languages: [
    { name: 'Français', level: 'Bilingue' },
    { name: 'Anglais', level: 'Avancé' },
    { name: 'Espagnol', level: 'Intermédiaire' },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect - Associate',
      issuingBody: 'Amazon Web Services',
      issueDate: 'Mars 2023',
      credentialUrl: 'https://www.credly.com/badges/some-aws-id/public_url',
    },
    {
      name: 'Professional Scrum Master I (PSM I)',
      issuingBody: 'Scrum.org',
      issueDate: 'Décembre 2021',
      credentialUrl: 'https://www.scrum.org/credentials/some-scrum-id',
    },
  ],
  jobPreferences: {
    isAvailable: true,
    jobType: 'Temps plein, Freelance',
    preferredLocation: 'Paris (Hybride ou remote), International (Remote)',
    noticePeriod: '1 mois',
  },
  contact: {
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    linkedin: 'https://www.linkedin.com/in/jeandupont',
    website: 'https://www.jeandupontdev.com',
    github: 'https://github.com/mohamedouabbi' // Added GitHub to dummy data
  },
  cvLastUpdated: '15/05/2024',
  cvPdfUrl: '/pdf/cv.pdf', // Example: pre-existing CV URL
};