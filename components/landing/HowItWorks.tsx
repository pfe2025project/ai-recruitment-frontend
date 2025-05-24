"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const HowItWorks: React.FC = () => {
  const [userType, setUserType] = useState<'candidate' | 'recruiter'>('candidate');

  // Cette fonction reste inchangée, elle retourne la variable CSS comme 'var(--primary-600)'
  const getDynamicColor = (shade: number) => {
    const colorBase = userType === 'candidate' ? 'primary' : 'secondary';
    return `var(--${colorBase}-${shade})`
  };

    // Logique pour déterminer les couleurs de début et de fin du dégradé du titre
  const getTitleGradientColors = () => {
    if (userType === 'candidate') {
      // Pour candidat: Dégradé du primary-600 au secondary-600
      return {
        start: 'var(--primary-600)',
        end: 'var(--secondary-600)'
      };
    } else {
      // Pour recruteur: Dégradé du secondary-600 au primary-600
      return {
        start: 'var(--secondary-600)',
        end: 'var(--primary-600)'
      };
    }
  };

  const candidateSteps = [
    {
      title: 'Créez votre profil',
      description: 'Construisez un profil complet avec vos compétences, expériences et préférences.',
      icon: '/images/ajouter-un-utilisateur.png',
    },
    {
      title: 'Upload & Analyse AI de votre CV',
      description: 'Notre IA analyse votre CV et extrait automatiquement toutes les informations pertinentes.',
      icon: '/images/cv.png',
    },
    {
      title: 'Découvrez des offres personnalisées',
      description: 'Recevez des recommandations d\'offres qui correspondent parfaitement à votre profil.',
      icon: '/images/description-de-lemploi.png',
    },
    {
      title: 'Postulez & Suivez vos candidatures',
      description: 'Postulez en un clic et suivez l\'état de toutes vos candidatures en temps réel.',
      icon: '/images/liste-de-controle.png',
    },
  ];

  const recruiterSteps = [
    {
      title: 'Publiez votre offre',
      description: "Déposez vos offres d'emploi détaillées en quelques clics avec notre assistant intelligent.",
      icon: '/images/offre-demploi.png',
    },
    {
      title: 'Analyse Automatique de CVs (AI)',
      description: 'Notre IA analyse et classe les CVs, vous présentant les profils les plus pertinents en premier.',
      icon: '/images/technologie-ia.png',
    },
    {
      title: 'Gestion des candidatures',
      description: 'Visualisez et organisez toutes vos candidatures avec notre tableau de bord intuitif.',
      icon: '/images/tableau-de-bord.png',
    },
    {
      title: 'Planifiez des entretiens',
      description: 'Organisez des entretiens directement via la plateforme avec synchronisation calendrier.',
      icon: '/images/calendrier.png',
    },
  ];

  const steps = userType === 'candidate' ? candidateSteps : recruiterSteps;
  const gradientColors = getTitleGradientColors(); // Récupère les couleurs du dégradé pour le titre

  return (
    <section className="py-20 bg-[color:var(--neutral-50)]">
      <div className="container mx-auto px-6 text-center">
       {/* Titre avec dégradé dynamique */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})` }}
        >
          Comment ça marche ?
        </h2>

        {/* Sélecteur de type d'utilisateur - Style "Pill" moderne */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-full bg-[color:var(--neutral-100)] shadow-inner">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setUserType('candidate')}
              // Le fond est maintenant appliqué via style, le reste des classes reste Tailwind
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer text-base md:text-lg select-none
                ${
                  userType === 'candidate'
                    ? `text-[color:var(--neutral-50)] shadow-md` // Le texte et l'ombre restent Tailwind
                    : `text-[color:var(--neutral-700)] hover:text-[color:var(--primary-600)]` // Le hover reste Tailwind
                }`}
              style={userType === 'candidate' ? { backgroundColor: getDynamicColor(600) } : {}}
            >
              Candidat
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setUserType('recruiter')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer text-base md:text-lg select-none
                ${
                  userType === 'recruiter'
                    ? `text-[color:var(--neutral-50)] shadow-md` // Le texte et l'ombre restent Tailwind
                    : `text-[color:var(--neutral-700)] hover:text-[color:var(--secondary-600)]` // Le hover reste Tailwind
                }`}
              style={userType === 'recruiter' ? { backgroundColor: getDynamicColor(600) } : {}}
            >
              Recruteur
            </div>
          </div>
        </div>

        {/* Grille des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[color:var(--neutral-50)] p-8 rounded-xl border border-[color:var(--neutral-200)] shadow-md hover:shadow-[0_10px_25px_-5px_rgba(14,165,233,0.1)] transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
              {/* Élément décoratif (barre supérieure) - Couleur via style inline */}
              <div
                className={`absolute top-0 left-0 w-full h-1 group-hover:h-2 transition-all duration-300`}
                style={{ backgroundColor: getDynamicColor(100) }}
              ></div>

              {/* Conteneur de l'icône - Couleurs via style inline */}
              <div
                className={`relative p-2 w-30 h-30 mx-auto mb-6 rounded-full overflow-hidden border-2 flex items-center justify-center`}
                style={{
                  borderColor: getDynamicColor(100),
                  backgroundColor: getDynamicColor(50)
                }}
              >
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={80}
                  height={80}
                  className="object-cover opacity-90"
                />
              </div>

              {/* Titre - Couleur du texte via style inline */}
              <h3
                className={`text-xl font-semibold mb-4`} // La classe text-[...] est supprimée ici
                style={{ color: getDynamicColor(700) }}
              >
                {step.title}
              </h3>

              <p className="text-sm leading-relaxed text-[color:var(--neutral-600)]">
                {step.description}
              </p>

              {/* Numéro d'étape */}
              <div className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-[${getDynamicColor(200)}] font-bold text-sm text-[${getDynamicColor(600)}]`}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;