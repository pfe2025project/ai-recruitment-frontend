/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FiBriefcase, 
  FiUsers, 
  FiAward, 
  FiBarChart2, 
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiSend,
  FiAlertCircle,
  FiEdit3,
  FiInfo,
  FiArrowUpRight} from 'react-icons/fi';

import { checkCVUploadStatus } from '@/lib/api/cv';
import { useProfile } from '@/context/ProfileContext';
import { fetchProfile } from '@/lib/api/profile';
import { getAccessToken, logout } from '@/lib/api/auth';
import MultiStepFormModal from '@/components/ui/MultiStepFormModal';
import { steps } from '@/lib/candidate/config/steps';
import { MdLightbulbOutline } from 'react-icons/md';
import { fetchprofiledata } from '@/lib/data/profile';

export default function CandidateDashboard() {
  const [cvUploaded, setCvUploaded] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const { profileData, handleProfileDataChange, handleContactInfoChange, handleJobPreferencesChange } = useProfile();
  const { user, loading } = useAuth(); // Destructure user and loading from useAuth
  const router = useRouter();

  // Stats importantes pour le candidat
  const stats = [
    { 
      title: "Offres correspondantes", 
      value: "12", 
      icon: <FiBriefcase className="text-2xl" style={{ color: '#0ea5e9' }} />,
      bgColor: '#e0f2fe',
      textColor: '#0369a1',
      borderColor: '#bae6fd',
      description: "Selon votre profil et vos préférences"
    },
    { 
      title: "Entreprises intéressées", 
      value: "5", 
      icon: <FiUsers className="text-2xl" style={{ color: '#7c3aed' }} />,
      bgColor: '#ede9fe',
      textColor: '#5b21b6',
      borderColor: '#ddd6fe',
      description: "Ont consulté votre profil cette semaine"
    },
    { 
      title: "Score de profil", 
      value: "87%", 
      icon: <FiAward className="text-2xl" style={{ color: '#10b981' }} />,
      bgColor: '#d1fae5',
      textColor: '#059669',
      borderColor: '#a7f3d0',
      description: "Complétez votre profil pour améliorer ce score"
    }
  ];

  // Dernières candidatures
  const recentApplications = [
    { 
      position: "Développeur Fullstack Senior", 
      company: "TechInnov", 
      date: "2023-06-15", 
      status: "En revue",
      icon: <FiClock style={{ color: '#7c3aed' }} />,
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe'
    },
    { 
      position: "Data Scientist", 
      company: "DataCorp", 
      date: "2023-06-10", 
      status: "Entretien prévu",
      icon: <FiCheckCircle style={{ color: '#10b981' }} />,
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0'
    },
    { 
      position: "Product Manager", 
      company: "StartUpVision", 
      date: "2023-06-05", 
      status: "Refusé",
      icon: <FiAlertCircle style={{ color: '#ef4444' }} />,
      bgColor: '#fef2f2',
      borderColor: '#fecaca'
    }
  ];

  // Offres recommandées
  const recommendedJobs = [
    { 
      title: "Ingénieur DevOps", 
      company: "CloudTech", 
      location: "Remote", 
      match: "94%",
      salary: "€75k-90k"
    },
    { 
      title: "UX Designer Senior", 
      company: "DesignHub", 
      location: "Paris", 
      match: "88%",
      salary: "€65k-80k"
    },
    { 
      title: "CTO Startup", 
      company: "InnovateCo", 
      location: "Lyon", 
      match: "82%",
      salary: "€90k-120k + equity"
    }
  ];



  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCvUploaded(true);
  };

  useEffect(() => {
    if (!loading) { // Only proceed if authentication state has been determined
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      const accessToken = getAccessToken();
      setToken(accessToken);

      fetchprofiledata(profileData, handleProfileDataChange, handleJobPreferencesChange);

      const checkCV = async () => {
        const uploaded = await checkCVUploadStatus();
        setCvUploaded(uploaded);
        setModalOpen(!uploaded);
      };

      if (accessToken) checkCV();
    }
  }, [loading, user, router]);

  if (loading || cvUploaded === null) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Modal for CV upload */}
      <MultiStepFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        steps={steps}
        onSave={handleModalClose}
      />

      {/* En-tête simplifié */}
      <div className="bg-gradient-to-r  rounded-xl p-6 text-white" 
      style={{
        backgroundImage: `linear-gradient(to right, var(--primary-600), var(--secondary-500))`
      }}>
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Icône simple */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="p-3 bg-white bg-opacity-20 rounded-lg">
            <FiTrendingUp className="text-xl" />
          </div>

          <div className="flex-1 space-y-4">
            {/* Titre */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">
                Bonjour {profileData.name || 'Candidat'} !
              </h1>
              <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                Nouveautés disponibles
              </span>
            </div>

            {/* Analyse de profil */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-start gap-3">
                <FiBarChart2 className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Analyse de votre profil</h3>
                  <p className="text-sm opacity-90">
                    
                    Votre maîtrise de <span className="font-bold">Python (4 ans)</span>, <span className="font-bold">
                    TensorFlow (2 ans)</span> et <span className="font-bold">traitement du NLP</span> vous positionne parmi <span className="font-bold">les 20%  </span> 
                    de data scientists les plus qualifiés.
                  </p>
                </div>
              </div>
            </div>

            {/* Conseil du jour */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
              <div className="flex items-start gap-3">
                <MdLightbulbOutline className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Conseil du jour</h3>
                  <p className="text-sm opacity-90">
                    Complétez votre section <strong>'Compétences clés'</strong> avec 3 mots-clés pour augmenter votre visibilité de <strong>+40%</strong>.
                  </p>
                  <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                    <FiEdit3 />
                    Mettre à jour mon profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              backgroundColor: item.bgColor,
              borderColor: item.borderColor,
              color: item.textColor
            }}
            className="p-5 rounded-xl border flex flex-col shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ opacity: 0.9 }}>{item.title}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} className="p-2 rounded-lg">
                {item.icon}
              </div>
            </div>
            <p className="text-xs mt-3" style={{ opacity: 0.8 }}>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Offres recommandées */}
        <div className="lg:col-span-2 space-y-6">
          <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-6 rounded-xl border shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ color: '#1e293b' }} className="text-lg font-semibold">Offres recommandées</h2>
              <button style={{ color: '#0284c7' }} className="text-sm font-medium hover:text-blue-700 flex items-center">
                Voir toutes <FiTrendingUp className="ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recommendedJobs.map((job, index) => (
                <div 
                  key={index} 
                  style={{ borderColor: '#e2e8f0' }}
                  className="p-4 border rounded-lg hover:border-blue-300 transition-colors group"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 style={{ color: '#1e293b' }} className="font-bold group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p style={{ color: '#64748b' }} className="text-sm">{job.company} • {job.location}</p>
                    </div>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }} className="px-2 py-1 text-xs rounded-full h-fit">
                      {job.match} match
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span style={{ color: '#334155' }} className="text-sm font-medium">{job.salary}</span>
                    <button style={{ color: '#0284c7' }} className="text-sm hover:text-blue-700 font-medium flex items-center">
                      Postuler <FiSend className="ml-1 text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique d'activité */}
          <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-6 rounded-xl border shadow-xs">
            <h2 style={{ color: '#1e293b' }} className="text-lg font-semibold mb-6">Votre activité</h2>
            <div style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }} className="h-64 rounded-lg flex flex-col items-center justify-center">
              <FiBarChart2 className="text-4xl mb-3" />
              <span>Évolution de vos candidatures</span>
              <p className="text-xs mt-2">7 candidatures ce mois-ci (+3 vs dernier mois)</p>
            </div>
          </div>

          

          {/* Ajoutez ceci juste après le div du graphique d'activité */}
          <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-6 rounded-xl border shadow-xs">
            <h2 style={{ color: '#1e293b' }} className="text-lg font-semibold mb-4">Ressources utiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="#" 
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }} className="p-2 rounded-lg">
                    <FiInfo className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      Guide d'entretien technique
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Préparation aux questions techniques courantes pour les rôles en Data Science
                    </p>
                  </div>
                </div>
              </a>
              <a 
                href="#" 
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }} className="p-2 rounded-lg">
                    <FiEdit3 className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      Modèles de CV optimisés
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Téléchargez nos templates ATS-friendly pour augmenter votre visibilité
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center justify-center gap-2">
              Explorer toutes les ressources <FiArrowUpRight />
            </button>
          </div>
        </div>


        

        {/* Colonne droite */}
        <div className="space-y-6">
           {/* Situation actuelle */}
          {profileData.experiences?.[0] && (
            <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-6 rounded-xl border shadow-xs">
              <h2 style={{ color: '#1e293b' }} className="text-lg font-semibold mb-4">Votre situation actuelle</h2>
              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }} className="p-3 rounded-lg">
                  <FiBriefcase className="text-lg" />
                </div>
                <div>
                  <h3 style={{ color: '#1e293b' }} className="font-medium">{profileData.experiences[0].title}</h3>
                  <p style={{ color: '#64748b' }} className="text-sm">{profileData.experiences[0].company}</p>
                  <p style={{ color: '#64748b' }} className="text-xs mt-2">
                    Depuis {new Date(profileData.experiences[0]?.period).toLocaleDateString()} • {profileData.experiences[0].location}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dernières candidatures */}
          <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-6 rounded-xl border shadow-xs">
            <h2 style={{ color: '#1e293b' }} className="text-lg font-semibold mb-4">Vos dernières candidatures</h2>
            <div className="space-y-4">
              {recentApplications.map((app, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: app.bgColor,
                    borderColor: app.borderColor
                  }}
                  className="p-4 rounded-lg border flex items-start gap-3"
                >
                  <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="p-2 rounded-lg border mt-0.5">
                    {app.icon}
                  </div>
                  <div>
                    <h3 style={{ color: '#1e293b' }} className="font-medium">{app.position}</h3>
                    <p style={{ color: '#64748b' }} className="text-sm">{app.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span style={{ color: '#64748b' }} className="text-xs">
                        Postulé le {new Date(app.date).toLocaleDateString()}
                      </span>
                      <span style={{ backgroundColor: '#ffffff' }} className="text-xs px-2 py-1 rounded-full">
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ color: '#0284c7' }} className="w-full mt-4 text-sm font-medium hover:text-blue-700 flex items-center justify-center">
              Voir l'historique complet <FiClock className="ml-2" />
            </button>
          </div>

          {/* Conseils de carrière - Version améliorée */}
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            borderColor: '#8b5cf6',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }} className="p-6 rounded-xl border relative overflow-hidden">
            {/* Effet de fond décoratif */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
            <div className="absolute -left-5 -bottom-5 w-20 h-20 rounded-full bg-white bg-opacity-10"></div>
            
            <div className="relative z-10 flex items-start gap-4">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="p-3 rounded-lg flex-shrink-0">
                <FiTrendingUp className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Boostez votre carrière</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                    </div>
                    <p className="text-white text-opacity-90">
                      <span className="font-semibold">CV sur mesure :</span> Adaptez votre CV à chaque offre pour <span className="font-semibold">augmenter vos chances de 40%</span>
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                    </div>
                    <p className="text-white text-opacity-90">
                      <span className="font-semibold">Alertes intelligentes :</span> Recevez les offres qui <span className="font-semibold">correspondent vraiment</span> à votre profil
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                    </div>
                    <p className="text-white text-opacity-90">
                      <span className="font-semibold">Profil 100% complet :</span> Les recruteurs consultent <span className="font-semibold">3× plus</span> les profils complets
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <button 
              style={{
                background: 'linear-gradient(to right, #f9a8d4, #f472b6)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              className="relative z-10 mt-6 w-full text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <FiAward className="text-lg" />
              Optimiser mon profil maintenant
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
}