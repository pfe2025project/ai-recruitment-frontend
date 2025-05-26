// data/dummyJobs.ts
// (Copy the dummyJobs array and the Job interface from app/jobs/page.tsx here)

export interface Job {
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
    skills?: string[];
    requirements?: {
      diploma?: string[];
      experience?: string;
      languages?: string[];
      other?: string[];
    };
    hasApplied?: boolean;
    matchScore?: number;
  }

  export const dummyJobs: Job[] = [
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
      matchScore: 85,
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