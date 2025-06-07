// data/dummyJobs.ts (updated)

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
  hasApplied?: boolean; // Keep this for immediate feedback on job detail page
  matchScore?: number;
  // NEW: Application status and date
  applicationStatus?: 'en attente' | 'retenu' | 'rejeté' | 'entretien prévu';
  applicationDate?: string; // Date when the candidate applied
}

export const dummyJobs: Job[] = [
  {
    id: '1',
    title: 'Développeur Fullstack React/Node.js',
    company: 'Tech Solutions Inc.',
    location: 'Paris, France',
    postedDate: '2025-05-20',
    contractType: 'CDI',
    workMode: 'Hybride',
    sector: 'Informatique',
    description: `Nous recherchons un développeur Fullstack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants, du front-end au back-end, en utilisant React.js et Node.js.
    
    Responsabilités :
    - Développer et maintenir des applications web robustes.
    - Collaborer avec les équipes produit et design.
    - Assurer la qualité du code et les tests unitaires.
    - Participer aux revues de code.
    
    Compétences techniques:
    - Maîtrise de JavaScript/TypeScript, React, Node.js.
    - Connaissance des bases de données SQL et NoSQL.
    - Expérience avec les APIs RESTful.
    - Familiarité avec les principes Agile/Scrum.
    `,
    imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=TS', // Example image
    salary: '45k-60k€',
    skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'GraphQL', 'AWS'],
    requirements: {
      diploma: ['Bac+5 Informatique'],
      experience: '3-5 ans',
      languages: ['Anglais (courant)'],
      other: ['Esprit d\'équipe', 'Autonome'],
    },
    hasApplied: true, // Mark as applied
    applicationStatus: 'entretien prévu', // Example status
    applicationDate: '2025-05-22', // Example date
    matchScore: 85,
  },
  {
    id: '2',
    title: 'Chef de Projet Digital',
    company: 'Marketing Innovators',
    location: 'Lyon, France',
    postedDate: '2025-05-18',
    contractType: 'CDI',
    workMode: 'Présentiel',
    sector: 'Marketing',
    description: `En tant que Chef de Projet Digital, vous serez responsable de la gestion de projets web de A à Z, de la conception à la livraison. Vous travaillerez en étroite collaboration avec les clients et les équipes internes.
    
    Vos missions :
    - Définir les besoins clients et rédiger les spécifications.
    - Planifier et suivre les projets.
    - Gérer les budgets et les délais.
    - Coordonner les équipes techniques et créatives.
    - Assurer la satisfaction client.
    `,
    imageUrl: 'https://via.placeholder.com/150/33A2FF/FFFFFF?text=MI',
    salary: '40k-55k€',
    skills: ['Gestion de projet', 'SCRUM', 'Marketing Digital', 'SEO', 'SEA'],
    requirements: {
      diploma: ['Bac+4/5 Marketing', 'École de commerce'],
      experience: '2-4 ans',
      languages: ['Anglais'],
      other: ['Excellente communication', 'Organisation'],
    },
    hasApplied: true, // Mark as applied
    applicationStatus: 'en attente', // Example status
    applicationDate: '2025-05-20', // Example date
    matchScore: 70,
  },
  {
    id: '3',
    title: 'Designer UI/UX Senior',
    company: 'Creative Studio',
    location: 'Bordeaux, France',
    postedDate: '2025-05-15',
    contractType: 'CDI',
    workMode: 'Full Remote',
    sector: 'Design',
    description: `Nous recherchons un Designer UI/UX passionné pour concevoir des expériences utilisateur exceptionnelles. Vous serez en charge de l'ensemble du processus de conception, de la recherche utilisateur à la livraison des maquettes finales.
    
    Ce que nous attendons :
    - Concevoir des interfaces intuitives et esthétiques.
    - Réaliser des wireframes, mockups et prototypes.
    - Effectuer des tests utilisateurs et des analyses.
    - Travailler en synergie avec les développeurs.
    
    Outils maîtrisés :
    - Figma, Sketch, Adobe XD.
    - Suite Adobe (Photoshop, Illustrator).
    - Prototypage interactif.
    `,
    imageUrl: 'https://via.placeholder.com/150/FF33A8/FFFFFF?text=CS',
    salary: '42k-58k€',
    skills: ['UI/UX Design', 'Figma', 'Prototypage', 'Design System', 'User Research'],
    requirements: {
      diploma: ['Bac+3/5 Design Graphique', 'UX Design'],
      experience: '5 ans et plus',
      languages: [],
      other: ['Créativité', 'Souci du détail'],
    },
    hasApplied: false, // Not applied yet
    matchScore: 90,
  },
  {
    id: '4',
    title: 'Ingénieur DevOps Cloud (AWS)',
    company: 'Cloud Innovations',
    location: 'Nantes, France',
    postedDate: '2025-05-12',
    contractType: 'CDI',
    workMode: 'Hybride',
    sector: 'Cloud Computing',
    description: `Rejoignez notre équipe en tant qu'Ingénieur DevOps Cloud pour construire et maintenir des infrastructures scalables et fiables sur AWS.
    
    Vos responsabilités incluront :
    - Déploiement et gestion d'infrastructures cloud.
    - Automatisation des processus (CI/CD).
    - Monitoring et optimisation des performances.
    - Sécurité des systèmes.
    `,
    imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=CI',
    salary: '50k-70k€',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Python'],
    requirements: {
      diploma: ['Bac+5 Ingénieur', 'Informatique'],
      experience: '4 ans et plus',
      languages: ['Anglais (technique)'],
      other: ['Résolution de problèmes', 'Travail en équipe'],
    },
    hasApplied: true, // Mark as applied
    applicationStatus: 'retenu', // Example status
    applicationDate: '2025-05-14', // Example date
    matchScore: 78,
  },
  {
    id: '5',
    title: 'Responsable Commercial B2B',
    company: 'Global Sales Corp.',
    location: 'Marseille, France',
    postedDate: '2025-05-10',
    contractType: 'CDI',
    workMode: 'Présentiel',
    sector: 'Vente',
    description: `Nous recherchons un Responsable Commercial B2B dynamique pour développer notre portefeuille clients et atteindre nos objectifs de vente.
    
    Missions principales :
    - Prospection et acquisition de nouveaux clients.
    - Négociation et closing des contrats.
    - Fidélisation de la clientèle existante.
    - Veille concurrentielle.
    `,
    imageUrl: 'https://via.placeholder.com/150/A833FF/FFFFFF?text=GSC',
    salary: '35k-50k€ + commissions',
    skills: ['Négociation', 'Prospection', 'CRM', 'Développement commercial'],
    requirements: {
      diploma: ['Bac+3/5 Commercial', 'Vente'],
      experience: '3 ans minimum',
      languages: ['Anglais (professionnel)'],
      other: ['Autonome', 'Orienté résultats', 'Excellent relationnel'],
    },
    hasApplied: true, // Mark as applied
    applicationStatus: 'rejeté', // Example status
    applicationDate: '2025-05-11', // Example date
    matchScore: 60,
  },
  {
    id: '6',
    title: 'Data Scientist Junior',
    company: 'Data Insights Co.',
    location: 'Paris, France',
    postedDate: '2025-05-08',
    contractType: 'CDI',
    workMode: 'Hybride',
    sector: 'Data Science',
    description: `Rejoignez notre équipe de Data Scientists pour transformer des données brutes en insights exploitables. Vous travaillerez sur l'analyse prédictive, la modélisation et la visualisation de données.
    
    Vos tâches :
    - Collecte et nettoyage de données.
    - Développement de modèles statistiques et de machine learning.
    - Création de tableaux de bord.
    - Présentation des résultats aux équipes métiers.
    `,
    imageUrl: 'https://via.placeholder.com/150/FF3333/FFFFFF?text=DI',
    salary: '38k-48k€',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistiques', 'Tableau'],
    requirements: {
      diploma: ['Bac+5 Data Science', 'Statistiques', 'Mathématiques appliquées'],
      experience: '0-2 ans',
      languages: ['Anglais'],
      other: ['Curiosité', 'Rigueur analytique'],
    },
    hasApplied: true, // Mark as applied
    applicationStatus: 'en attente', // Example status
    applicationDate: '2025-05-09', // Example date
    matchScore: 75,
  },
  {
    id: '7',
    title: 'Consultant en Cybersécurité',
    company: 'SecureNet Solutions',
    location: 'Sophia Antipolis, France',
    postedDate: '2025-05-05',
    contractType: 'CDI',
    workMode: 'Présentiel',
    sector: 'Cybersécurité',
    description: `Nous recherchons un Consultant en Cybersécurité pour accompagner nos clients dans la protection de leurs systèmes d'information.
    
    Missions :
    - Audit de sécurité.
    - Recommandations et implémentation de solutions.
    - Sensibilisation des équipes.
    - Veille technologique.
    `,
    imageUrl: 'https://via.placeholder.com/150/33FFB5/FFFFFF?text=SNS',
    salary: '45k-65k€',
    skills: ['Audit de sécurité', 'Pentesting', 'ISO 27001', 'Réseaux', 'Cryptographie'],
    requirements: {
      diploma: ['Bac+5 Cybersécurité', 'Ingénieur Réseaux & Sécurité'],
      experience: '3 ans et plus',
      languages: ['Anglais (impératif)'],
      other: ['Ethique professionnelle', 'Esprit d\'analyse'],
    },
    hasApplied: false, // Not applied yet
    matchScore: 80,
  },
  {
    id: '8',
    title: 'Développeur Mobile iOS/Android',
    company: 'App Innovators',
    location: 'Toulouse, France',
    postedDate: '2025-05-02',
    contractType: 'CDI',
    workMode: 'Hybride',
    sector: 'Développement Mobile',
    description: `Développez des applications mobiles natives et hybrides pour nos clients variés.
    
    Profil recherché :
    - Expérience avec Swift/Kotlin ou React Native/Flutter.
    - Connaissance des APIs mobiles.
    - Publication sur les stores (App Store, Google Play).
    - Conception d'interfaces utilisateur mobiles.
    `,
    imageUrl: 'https://via.placeholder.com/150/8D33FF/FFFFFF?text=AI',
    salary: '40k-55k€',
    skills: ['iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'UI/UX Mobile'],
    requirements: {
      diploma: ['Bac+3/5 Informatique', 'Développement Mobile'],
      experience: '2-4 ans',
      languages: ['Anglais (technique)'],
      other: ['Passion pour le mobile', 'Veille technologique'],
    },
    hasApplied: false, // Not applied yet
    matchScore: 65,
  },
  {
    id: '9',
    title: 'Comptable Junior',
    company: 'Expertise Comptable ABC',
    location: 'Lille, France',
    postedDate: '2025-04-28',
    contractType: 'CDI',
    workMode: 'Présentiel',
    sector: 'Comptabilité',
    description: `Rejoignez notre cabinet en tant que Comptable Junior et participez à la gestion quotidienne des dossiers clients.
    
    Vos missions :
    - Saisie des opérations comptables.
    - Rapprochements bancaires.
    - Déclarations fiscales et sociales.
    - Préparation des bilans.
    `,
    imageUrl: 'https://via.placeholder.com/150/FF8833/FFFFFF?text=ECA',
    salary: '28k-35k€',
    skills: ['Comptabilité générale', 'Fiscalité', 'Pack Office', 'Sage', 'Ciel Compta'],
    requirements: {
      diploma: ['BTS Comptabilité', 'DCG'],
      experience: '0-1 an',
      languages: [],
      other: ['Rigueur', 'Organisation', 'Esprit d\'équipe'],
    },
    hasApplied: true,
    applicationStatus: 'en attente',
    applicationDate: '2025-04-29',
    matchScore: 50,
  },
  {
    id: '10',
    title: 'Assistant Marketing Communication',
    company: 'Brand Builders Co.',
    location: 'Strasbourg, France',
    postedDate: '2025-04-25',
    contractType: 'Alternance',
    workMode: 'Hybride',
    sector: 'Marketing',
    description: `Nous offrons une opportunité en alternance pour un Assistant Marketing Communication.
    
    Missions :
    - Participer à l'élaboration des campagnes marketing.
    - Gérer les réseaux sociaux.
    - Rédiger des contenus.
    - Organiser des événements.
    `,
    imageUrl: 'https://via.placeholder.com/150/33CCFF/FFFFFF?text=BBC',
    salary: 'Rémunération légale alternance',
    skills: ['Marketing Digital', 'Réseaux Sociaux', 'Rédaction web', 'Pack Office', 'Canva'],
    requirements: {
      diploma: ['Bac+2/3 Marketing', 'Communication'],
      experience: 'Stage significatif',
      languages: ['Anglais'],
      other: ['Créativité', 'Dynamisme'],
    },
    hasApplied: false,
    matchScore: 72,
  },
];