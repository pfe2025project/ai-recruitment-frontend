/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// app/jobs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/jobs/JobCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
// import CheckboxGroup from '@/components/ui/CheckboxGroup';
import {  FaSearch } from 'react-icons/fa'; // Added FaSearch for the main search bar

// Dummy Data for Job Listings (unchanged, but includes workMode, imageUrl, salary, skills)
// This is already in app/jobs/page.tsx, but make sure it has these fields.
// You might want to move this dummy data to a separate file (e.g., `data/dummyJobs.ts`)
// if your application grows larger, to avoid cluttering `page.tsx` files.

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  contractType: string;
  workMode: string;
  sector: string;
  description: string;
  imageUrl?: string;
  salary?: string;
  skills?: string[]; // Array of strings for tags
  requirements?: { // New section for structured requirements
    diploma?: string[];
    experience?: string;
    languages?: string[];
    other?: string[];
  };
  hasApplied?: boolean; // New: To simulate application status
  matchScore?: number; // New: For matching score (0-100)
}

const dummyJobs: Job[] = [
  {
    id: '1',
    title: 'Développeur Frontend React Senior',
    company: 'Tech Solutions Inc.',
    location: 'Paris, France (Remote possible)',
    postedDate: '2024-05-20',
    contractType: 'CDI',
    workMode: 'Remote',
    sector: 'IT',
    description: "Rejoignez notre équipe dynamique pour construire des interfaces utilisateur de nouvelle génération avec React et TypeScript. Vous serez responsable du développement de composants UI réutilisables, de l'intégration avec les API backend et de l'optimisation des performances des applications web. Nous recherchons un profil autonome, capable de prendre des initiatives et de contribuer activement à l'amélioration de nos pratiques de développement. Vous travaillerez en étroite collaboration avec les équipes produit et design pour livrer des expériences utilisateur exceptionnelles.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
    salary: '60 000 - 75 000 € / an',
    skills: ['React.js', 'TypeScript', 'Redux', 'Jest', 'GraphQL', 'Webpack', 'Figma', 'Agile', 'UX/UI', 'Git'],
    requirements: {
      diploma: ['Bac+5 Informatique', 'École d\'ingénieur'],
      experience: '5 ans et plus sur un poste similaire',
      languages: ['Français', 'Anglais (professionnel)'],
      other: ['Excellentes compétences en résolution de problèmes', 'Capacité à travailler en équipe', 'Passion pour les nouvelles technologies']
    },
    hasApplied: false,
    matchScore: 85, // Example score
  },
  {
    id: '2',
    title: 'Chef de Projet Digital',
    company: 'Creative Minds Agency',
    location: 'Lyon, France',
    postedDate: '2024-05-18',
    contractType: 'CDI',
    workMode: 'Hybrid',
    sector: 'Marketing',
    description: "Nous recherchons un chef de projet expérimenté pour gérer des projets web et marketing de A à Z. Vous serez le point central entre les clients et les équipes internes, assurant la livraison des projets dans les délais et budgets impartis. Votre rôle inclura la planification, l'exécution, le suivi et la clôture des projets, ainsi que la gestion des relations avec les parties prenantes.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1458/1458512.png',
    salary: '45 000 - 55 000 € / an',
    skills: ['Gestion de projet', 'Scrum', 'SEO', 'SEA', 'Google Analytics', 'Communication', 'Wordpress', 'Jira', 'Reporting'],
    requirements: {
      diploma: ['Bac+3/5 Marketing', 'École de commerce'],
      experience: '3 ans minimum en gestion de projet digital',
      languages: ['Français', 'Anglais (bon niveau)'],
      other: ['Excellentes capacités organisationnelles', 'Orientation client', 'Leadership']
    },
    hasApplied: true,
    matchScore: 70,
  },
  // ... (add requirements, hasApplied, matchScore to other dummy jobs as well)
  {
    id: '3',
    title: 'Data Scientist Junior',
    company: 'Data Insights Corp.',
    location: 'Bordeaux, France',
    postedDate: '2024-05-15',
    contractType: 'CDD',
    workMode: 'On site',
    sector: 'Data',
    description: "Opportunité pour un Data Scientist junior passionné par l'analyse de données et le machine learning. Vous travaillerez sur l'extraction, la transformation et l'analyse de grands volumes de données pour en tirer des insights précieux. Vous contribuerez à la modélisation prédictive et à l'amélioration des processus décisionnels basés sur les données.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png',
    salary: '35 000 - 40 000 € / an',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistiques', 'Tableau', 'Power BI', 'Modélisation'],
    requirements: {
      diploma: ['Bac+5 en Statistiques', 'Mathématiques appliquées', 'Informatique'],
      experience: 'Débutant ou 1 an d\'expérience',
      languages: ['Français'],
      other: ['Rigueur analytique', 'Curiosité', 'Proactivité']
    },
    hasApplied: false,
    matchScore: 60,
  },
  {
    id: '4',
    title: 'Designer UX/UI',
    company: 'Innovate Design Studio',
    location: 'Remote',
    postedDate: '2024-05-10',
    contractType: 'Freelance',
    workMode: 'Remote',
    sector: 'Design',
    description: "Nous recherchons un designer UX/UI talentueux pour concevoir des expériences utilisateur intuitives et esthétiques. Vous serez impliqué dans toutes les phases du processus de conception, de la recherche utilisateur à la création de prototypes interactifs. Votre mission sera de transformer des idées complexes en interfaces simples et agréables à utiliser.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1458/1458564.png',
    salary: '500 - 700 € / jour',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping', 'Design System', 'Accessibilité', 'Wireframing'],
    requirements: {
      diploma: ['Bac+3/5 Design UX/UI', 'Graphisme'],
      experience: '2 ans minimum en UX/UI',
      languages: ['Français', 'Anglais (lu/écrit)'],
      other: ['Créativité', 'Empathie utilisateur', 'Bonne communication']
    },
    hasApplied: false,
    matchScore: 78,
  },
  {
    id: '5',
    title: 'Ingénieur DevOps',
    company: 'Cloud Native Solutions',
    location: 'Nantes, France',
    postedDate: '2024-05-08',
    contractType: 'CDI',
    workMode: 'On site',
    sector: 'IT',
    description: "Poste d'Ingénieur DevOps pour optimiser nos infrastructures cloud et CI/CD. Vous travaillerez à l'automatisation des déploiements, à la gestion des conteneurs et à l'assurance de la stabilité des systèmes. Vous serez un acteur clé dans l'amélioration continue de notre environnement de développement et de production.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055675.png',
    salary: '55 000 - 70 000 € / an',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Ansible', 'Terraform', 'Linux', 'Bash'],
    requirements: {
      diploma: ['Bac+5 Informatique', 'Ingénierie des systèmes'],
      experience: '4 ans et plus en DevOps',
      languages: ['Français', 'Anglais (professionnel)'],
      other: ['Résolution de problèmes complexes', 'Autonomie', 'Veille technologique']
    },
    hasApplied: false,
    matchScore: 90,
  },
  {
    id: '6',
    title: 'Commercial B2B',
    company: 'Global Sales Group',
    location: 'Marseille, France',
    postedDate: '2024-05-05',
    contractType: 'CDI',
    workMode: 'On site',
    sector: 'Commercial',
    description: "Développez notre portefeuille clients dans le secteur B2B. Vous serez en charge de la prospection, de la négociation et du suivi de la relation client, contribuant directement à la croissance de l'entreprise. Votre objectif sera d'atteindre et dépasser les objectifs de vente fixés.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1458/1458514.png',
    salary: '40 000 € / an + commissions',
    skills: ['Prospection', 'Négociation', 'CRM', 'Salesforce', 'Business Development', 'Communication', 'Force de vente', 'Relation client'],
    requirements: {
      diploma: ['Bac+2/3 Commercial', 'Négociation'],
      experience: '2 ans minimum en vente B2B',
      languages: ['Français'],
      other: ['Dynamisme', 'Capacité de persuasion', 'Sens du résultat']
    },
    hasApplied: false,
    matchScore: 65,
  },
  {
    id: '7',
    title: 'Développeur Backend Node.js',
    company: 'API Masters',
    location: 'Toulouse, France',
    postedDate: '2024-05-01',
    contractType: 'CDI',
    workMode: 'Hybrid',
    sector: 'IT',
    description: "Construisez des APIs robustes et scalables avec Node.js et Express. Vous participerez à la conception des architectures, à l'écriture de code de qualité et à l'intégration avec diverses bases de données. Vous aurez l'opportunité de travailler sur des projets innovants et d'impacter directement nos produits.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1055/1055655.png',
    salary: '50 000 - 65 000 € / an',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST API', 'Authentication', 'Microservices', 'AWS Lambda'],
    requirements: {
      diploma: ['Bac+5 Informatique', 'Développement logiciel'],
      experience: '3 ans et plus en Node.js',
      languages: ['Français', 'Anglais (technique)'],
      other: ['Bonne compréhension des principes SOLID', 'Autonomie', 'Curiosité']
    },
    hasApplied: false,
    matchScore: 82,
  },
  {
    id: '8',
    title: 'Assistant(e) Administratif(ve)',
    company: 'Support Services SA',
    location: 'Paris, France',
    postedDate: '2024-04-28',
    contractType: 'CDD',
    workMode: 'On site',
    sector: 'Administration',
    description: "Support administratif général et gestion de bureau. Vous serez un pilier essentiel pour le bon fonctionnement quotidien de l'entreprise, gérant les plannings, la correspondance et l'organisation des événements. Une bonne maîtrise des outils bureautiques est indispensable.",
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1458/1458535.png',
    salary: '28 000 - 32 000 € / an',
    skills: ['Microsoft Office', 'Gestion de planning', 'Communication', 'Organisation', 'Accueil', 'Classement', 'Rédaction'],
    requirements: {
      diploma: ['Bac+2 Assistant de gestion', 'Secrétariat'],
      experience: '1 an minimum sur un poste similaire',
      languages: ['Français'],
      other: ['Rigueur', 'Discrétion', 'Sens du service']
    },
    hasApplied: false,
    matchScore: 55,
  },
];


// Filter Options Data
const datePostOptions = [
  { value: 'any', label: 'N\'importe quand' },
  { value: '24h', label: 'Dernières 24 heures' },
  { value: '7d', label: 'Derniers 7 jours' },
  { value: '30d', label: 'Derniers 30 jours' },
];

const contractTypeCheckboxOptions = [
  { value: 'CDI', label: 'Temps plein (CDI)' },
  { value: 'CDD', label: 'Temps partiel (CDD)' },
  { value: 'Alternance', label: 'Alternance' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Stage', label: 'Stage' },
];

const workModeOptions = [
  { value: 'On site', label: 'Sur site' },
  { value: 'Remote', label: 'Télétravail' },
  { value: 'Hybrid', label: 'Hybride' },
];

const sectorOptions = [
  { value: '', label: 'Tous secteurs' },
  { value: 'IT', label: 'IT / Développement' },
  { value: 'Marketing', label: 'Marketing & Communication' },
  { value: 'Data', label: 'Science des Données & Analyse' },
  { value: 'Design', label: 'Design & Création' },
  { value: 'Commercial', label: 'Commercial & Ventes' },
  { value: 'Administration', label: 'Administration' },
];

const JobSearchPage: React.FC = () => {
  const router = useRouter();
  // States for the main search bar inputs
  const [mainJobTitle, setMainJobTitle] = useState<string>('');
  const [mainLocation, setMainLocation] = useState<string>('');
  const [mainJobType, setMainJobType] = useState<string>(''); // For the top Job Type filter

  // States for sidebar filters (renamed for clarity with new top bar)
  const [sidebarDatePostFilter, setSidebarDatePostFilter] = useState<string>('any');
  const [sidebarSelectedContractTypes, setSidebarSelectedContractTypes] = useState<string[]>([]);
  const [sidebarSelectedWorkModes, setSidebarSelectedWorkModes] = useState<string[]>([]);
  const [sidebarSectorFilter, setSidebarSectorFilter] = useState<string>('');

  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [experience, setExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState<string>('0');
  const jobsPerPage = 5;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [suggestions, setSuggestions] = useState([
    'JavaScript',
    'React',
    'UX Design',
    'UI/UX',
    'Frontend',
    'Backend',
    'Full Stack',
    'Python',
    'Node.js',
    'TypeScript'
  ]);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(mainJobTitle.toLowerCase())
  );

  // Load/Save saved jobs (unchanged)
  useEffect(() => {
    const storedSavedJobs = localStorage.getItem('savedJobs');
    if (storedSavedJobs) {
      setSavedJobs(JSON.parse(storedSavedJobs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Function to apply filters (called by both main search bar and sidebar filter button)
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page on new filter application
    // The filtering logic below will now use the current state of all filters
  };

  const filteredJobs = dummyJobs.filter(job => {
    // Main Search Bar Filters
    const matchesMainJobTitle =
      mainJobTitle === '' ||
      job.title.toLowerCase().includes(mainJobTitle.toLowerCase()) ||
      job.description.toLowerCase().includes(mainJobTitle.toLowerCase()) ||
      (job.skills && job.skills.some(skill => skill.toLowerCase().includes(mainJobTitle.toLowerCase())));

    const matchesMainLocation =
      mainLocation === '' || job.location.toLowerCase().includes(mainLocation.toLowerCase());
      
    // The top 'Job Type' is typically a single select, let's connect it to contractType
    const matchesMainJobType =
      mainJobType === '' || job.contractType === mainJobType;


    // Sidebar Filters
    const matchesDatePost = () => {
        if (sidebarDatePostFilter === 'any') return true;
        const jobDate = new Date(job.postedDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - jobDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (sidebarDatePostFilter === '24h') return diffDays <= 1;
        if (sidebarDatePostFilter === '7d') return diffDays <= 7;
        if (sidebarDatePostFilter === '30d') return diffDays <= 30;
        return true;
    };

    const matchesContractType =
      sidebarSelectedContractTypes.length === 0 || sidebarSelectedContractTypes.includes(job.contractType);

    const matchesWorkMode =
      sidebarSelectedWorkModes.length === 0 || sidebarSelectedWorkModes.includes(job.workMode);

    const matchesSector =
      sidebarSectorFilter === '' || job.sector === sidebarSectorFilter;

    return (
      matchesMainJobTitle &&
      matchesMainLocation &&
      matchesMainJobType &&
      matchesDatePost() &&
      matchesContractType &&
      matchesWorkMode &&
      matchesSector
    );
  });

  // Pagination Logic (unchanged)
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewMore = (id: string) => {
    router.push(`/candidate/jobs/${id}`);
  };

  const handleToggleSave = (id: string) => {
    setSavedJobs(prevSavedJobs => {
      if (prevSavedJobs.includes(id)) {
        return prevSavedJobs.filter(jobId => jobId !== id);
      } else {
        return [...prevSavedJobs, id];
      }
    });
  };

  const handleClearAllFilters = () => {
    setMainJobTitle('');
    setMainLocation('');
    setMainJobType('');
    setSidebarDatePostFilter('any');
    setSidebarSelectedContractTypes([]);
    setSidebarSelectedWorkModes([]);
    setSidebarSectorFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
     

        {/* Top Search Bar Section - Inspired by Image */}
        <div className="bg-primary-500 rounded-lg p-8  rounded-b-none flex items-center justify-between relative overflow-hidden"
              style={{backgroundImage: `linear-gradient(to right, var(--primary-600), var(--secondary-700))` }}>
            <div className="absolute top-0 right-0 h-full w-1/4" >
                {/* Abstract shapes for decoration, like in the image */}
                <div className="absolute bg-gray-900 top-[-50px] right-[-50px] w-48 h-48 rounded-full opacity-20"  ></div>
                <div className="absolute bottom-[-30px] right-[-30px] w-32 h-32 rounded-full opacity-20 bg-gray-100" ></div>
            </div>
            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-2">À la recherche de nouvelles opportunités ?</h2>
                <p className="text-primary-100 text-lg text-gray-100 ">Parcourez nos dernières offres d'emploi</p>
            </div>
        </div>

        {/* Main Search Filters - Improved version */}
        <div className="bg-white p-6 rounded-lg rounded-t-none shadow-md mb-8 overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-x-4">
            <tbody>
              <tr className="align-top">
                {/* Poste */}
                <td className="w-1/5">
                  <label htmlFor="mainJobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Poste
                  </label>
                  <div className="relative">
                    <Input
                      id="mainJobTitle"
                      placeholder="Ex: UI/UX Designer"
                      value={mainJobTitle}
                      onChange={(e) => setMainJobTitle(e.target.value)}
                      className="pr-10 w-full h-10 border border-gray-400 rounded-lg px-2.5"
                    />
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </td>

                {/* Localisation */}
                <td className="w-1/5">
                  <label htmlFor="mainLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <Select
                    id="mainLocation"
                    options={[
                      { value: '', label: 'Toute Localisation' },
                      { value: 'Paris', label: 'Paris' },
                      { value: 'Lyon', label: 'Lyon' },
                      { value: 'Remote', label: 'Télétravail' },
                      { value: 'Bongolore', label: 'Bongolore' },
                    ]}
                    className='h-10 px-4 border border-gray-400 rounded-lg w-full'
                    value={mainLocation}
                    onChange={(e) => setMainLocation(e.target.value)}
                  />
                </td>

                {/* Type d'emploi */}
                <td className="w-1/5">
                  <label htmlFor="mainJobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'emploi
                  </label>
                  <Select
                    id="mainJobType"
                    options={[
                      { value: '', label: 'Tout Type' },
                      { value: 'Full Time', label: 'Full Time' },
                      { value: 'Part Time', label: 'Part Time' },
                      { value: 'Contract', label: 'Contract' },
                      { value: 'Internship', label: 'Internship' },
                    ]}
                    value={mainJobType}
                    className='h-10 border px-4 border-gray-400 rounded-lg w-full'
                    onChange={(e) => setMainJobType(e.target.value)}
                  />
                </td>

                {/* Expérience */}
                <td className="w-1/5">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Expérience
                  </label>
                  <Select
                    id="experience"
                    options={[
                      { value: '', label: 'Toute Expérience' },
                      { value: 'Fresher', label: 'Fresher' },
                      { value: 'Junior', label: 'Junior' },
                      { value: 'Mid', label: 'Intermédiaire' },
                      { value: 'Senior', label: 'Sénior' },
                    ]}
                    className='h-10 border px-4 border-gray-400 rounded-lg w-full'
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </td>

                {/* Bouton appliquer */}
                <td className="w-1/5 ">
                  <Button
                    onClick={applyFilters}
                    variant="primary"
                    className="w-full h-10 mt-6 flex px-4  justify-center items-center cursor-pointer border border-gray-400 rounded-lg"
                    style={{
                      backgroundColor: 'var(--primary-600)',
                      color: 'white',
                    }}
                  >
                    Appliquer les filtres
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Modern Filters Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit  ">
            {/* Header with clear button */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center text-gray-900" >
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h2>
              <button
                onClick={handleClearAllFilters}
                className="text-sm font-medium text-red-600  bg-red-50 rounded-lg px-2 py-1 hover:bg-red-100  cursor-pointer hover:text-primary-800 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Date Posted Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
              <select 
                className="w-full px-4 py-2.5 text-base border cursor-pointer border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                value={sidebarDatePostFilter}
                onChange={(e) => setSidebarDatePostFilter(e.target.value)}
              >
                {datePostOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="bg-white text-gray-800 text-base p-3 hover:bg-primary-50 focus:bg-primary-50"
                    style={{
                      fontSize: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#fff',
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <div className="space-y-2">
                {contractTypeCheckboxOptions.map(option => (
                  <label key={option.value} className=" cursor-pointer flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      checked={sidebarSelectedContractTypes.includes(option.value)}
                      onChange={() => {
                        const newValues = sidebarSelectedContractTypes.includes(option.value)
                          ? sidebarSelectedContractTypes.filter(v => v !== option.value)
                          : [...sidebarSelectedContractTypes, option.value];
                        setSidebarSelectedContractTypes(newValues);
                      }}
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {workModeOptions.map(option => (
                  <button
                    key={option.value}
                    className={`py-2 px-3 cursor-pointer rounded-lg text-sm font-medium transition-colors ${sidebarSelectedWorkModes.includes(option.value)
                      ? 'bg-indigo-500  text-gray-100 border border-indigo-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    
                    onClick={() => {
                      const newValues = sidebarSelectedWorkModes.includes(option.value)
                        ? sidebarSelectedWorkModes.filter(v => v !== option.value)
                        : [...sidebarSelectedWorkModes, option.value];
                      setSidebarSelectedWorkModes(newValues);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Salary Range with Value Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fourchette de salaire (en DH)
                {salaryRange && (
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {salaryRange} 000 DH
                  </span>
                )}
              </label>
              
              <div className="px-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 000 DH</span>
                  <span>100 000+ DH</span>
                </div>
              </div>
            </div>


            {/* Sector Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select 
                  className="w-full px-4 py-2.5 pr-10 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none bg-white cursor-pointer hover:border-gray-400"
                  value={sidebarSectorFilter}
                  onChange={(e) => setSidebarSectorFilter(e.target.value)}
                >
                  {sectorOptions.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-white text-gray-800 text-base p-3 hover:bg-primary-100 focus:bg-primary-100"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
            </div>


           {/* Keywords Input with Suggestions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 transition-all"
                placeholder="e.g. JavaScript, UX Design"
                value={mainJobTitle}
                onChange={(e) => {
                  setMainJobTitle(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedSuggestion(prev => 
                      Math.min(prev + 1, filteredSuggestions.length - 1)
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedSuggestion(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter' && showSuggestions) {
                    e.preventDefault();
                    if (filteredSuggestions[selectedSuggestion]) {
                      setMainJobTitle(filteredSuggestions[selectedSuggestion]);
                      setShowSuggestions(false);
                    }
                  }
                }}
                onFocus={() => setShowSuggestions(mainJobTitle.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className={`px-4 py-2 cursor-pointer hover:bg-primary-50 ${index === selectedSuggestion ? 'bg-primary-100' : ''}`}
                      onClick={() => {
                        setMainJobTitle(suggestion);
                        setShowSuggestions(false);
                      }}
                      onMouseEnter={() => setSelectedSuggestion(index)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>

          {/* Job Listings Column (unchanged) */}
          <div className="lg:col-span-3">
            {currentJobs.length > 0 ? (
              <div className="space-y-6">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    postedDate={new Date(job.postedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    contractType={job.contractType}
                    description={job.description}
                    imageUrl={job.imageUrl}
                    salary={job.salary}
                    skills={job.skills}
                    isSaved={savedJobs.includes(job.id)}
                    onViewMore={handleViewMore}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-xl font-medium text-neutral-600">Aucune offre d'emploi ne correspond à vos critères.</p>
                <Button
                  onClick={handleClearAllFilters}
                  variant="primary"
                  className="mt-6"
                  style={{
                    backgroundColor: 'var(--primary-500)',
                    color: 'white'
                  }}
                >
                  Effacer tous les filtres
                </Button>
              </div>
            )}

            {/* Pagination (unchanged) */}
            {filteredJobs.length > jobsPerPage && (
              <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    variant={currentPage === i + 1 ? 'primary' : 'outline'}
                    className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? '' : 'text-primary-700 border-primary-300'}`}
                    style={currentPage === i + 1 ? {
                      backgroundColor: 'var(--primary-500)',
                      color: 'white',
                      borderColor: 'var(--primary-500)'
                    } : {
                      borderColor: 'var(--primary-300)',
                      color: 'var(--primary-700)',
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;