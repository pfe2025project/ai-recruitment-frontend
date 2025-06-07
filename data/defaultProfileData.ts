import { ProfileData } from '@/types/Profile';

export const defaultProfileData: ProfileData = {
  name: '',
  title: '',
  location: '',
  avatarUrl: '',
  about: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  jobPreferences: {
    isAvailable: false,
    jobType: '',
    preferredLocation: '',
    noticePeriod: '',
  },
  contact: {
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    github: '',
  },
  cvLastUpdated: '',
  cvFile: null,
  cvPdfUrl: '',
};
