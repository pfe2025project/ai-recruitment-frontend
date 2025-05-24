/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Image from 'next/image';

const BenefitsSection: React.FC = () => {
  // Fonctions utilitaires pour obtenir les variables CSS de couleur
  const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
  const getSecondaryColor = (shade: number) => `var(--secondary-${shade})`;
  const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;

  const candidateBenefits = [
    'Accès à des opportunités ciblées',
    'Visibilité accrue auprès des recruteurs',
    'Processus de candidature simplifié',
    'Suivi en temps réel des candidatures',
  ];

  const recruiterBenefits = [
    'Gain de temps grâce à l\'IA',
    'Accès à un vivier de talents qualifiés',
    'Gestion centralisée des candidatures',
    'Communication fluide avec les candidats',
  ];
  

  const gradientColors ={
        start: 'var(--primary-600)',
        end: 'var(--secondary-600)'
      };


  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})` }}
        >
          Les Avantages de Rejoindre HireMatch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section pour les Candidats */}
          <div
            className="p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: getPrimaryColor(50) }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center"
              style={{ color: getPrimaryColor(700) }}
            >
              {/* Icône changée pour Candidats: "work_outline" (travail/opportunité) */}
              <span className="material-icons-outlined text-3xl mr-3" style={{ color: getPrimaryColor(600) }}>work_outline</span>
              Pour les Candidats
            </h3>
            <ul className="space-y-4 text-[color:var(--neutral-700)] text-lg">
              {candidateBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✔</span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-[400px] h-[250px] rounded-lg shadow-lg overflow-hidden">
                <Image
                  src="/images/candidate_lookin_for_a_job.png"
                  alt="Candidate looking for a job"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section pour les Recruteurs */}
          <div
            className="p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: getSecondaryColor(50) }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center"
              style={{ color: getSecondaryColor(700) }}
            >
              {/* Icône changée pour Recruteurs: "handshake" (poignée de main/embauche) */}
              <span className="material-icons-outlined text-3xl mr-3" style={{ color: getSecondaryColor(600) }}>handshake</span>
              Pour les Recruteurs
            </h3>
            <ul className="space-y-4 text-[color:var(--neutral-700)] text-lg">
              {recruiterBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✔</span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
                <div className="relative w-full max-w-[400px] h-[250px] rounded-lg shadow-lg overflow-hidden">
                    <Image
                      src="/images/recruiter_front_laptop.png"
                      alt="Recruiter in front of a laptop"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;



