/* eslint-disable react/no-unescaped-entities */
// components/StatsSection.tsx
"use client";

import React from 'react';
import Image from 'next/image'; // <-- Importe le composant Image de Next.js
import AnimatedCounter from '../ui/AnimatedCounter'; // Assurez-vous que le chemin d'importation est correct

const StatsSection: React.FC = () => {
  // Fonctions utilitaires pour obtenir les variables CSS de couleur
  // getPrimaryColor n'est plus utilisée pour le background des cartes stats, elle est donc retirée si non utilisée ailleurs.
  const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;

  const stats = [
    // Les chemins des images sont maintenant utilisés pour les icônes
    // J'ai ajouté l'extension .png au troisième chemin d'image pour le rendre valide.
    // Assurez-vous que ces chemins correspondent à l'emplacement réel de vos images dans le dossier `public`.
    { value: '95%', label: 'Taux de satisfaction', icon: '/images/stars.png', alt: 'Étoiles de satisfaction' },
    { value: '500+', label: '500+ Entreprises en France', icon: '/images/business-and-trade.png', alt: 'Icône d\'entreprise' },
    { value: '10K+', label: '10K+ Candidats inscrits', icon: '/images/male-people-group.png', alt: 'Icône de groupe de personnes' },
  ];

  return (
    <section className=" pb-40" style={{ backgroundColor: getNeutralColor(50) }}>
      <div className="container mx-auto px-6 text-center">
        {/* Le titre de la section a été supprimé comme demandé */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              // Fond blanc (bg-white) et couleur de texte neutre (text-neutral-800)
              // La couleur de fond 'primary-600' a été supprimée ici.
              className="p-8 rounded-lg flex flex-col items-center justify-center text-neutral-800"
            >
              {/* Utilisation du composant Image de Next.js pour afficher l'icône */}
              {stat.icon && (
                <div className="relative w-12 h-12 mb-2"> {/* Conteneur pour l'image */}
                  <Image
                    src={stat.icon}
                    alt={stat.alt || 'Icône de statistique'}
                    fill // L'image remplit son conteneur
                    sizes="48px" // Optimisation de l'image pour cette taille
                    style={{ objectFit: 'contain' }} // Garde les proportions de l'image
                  />
                </div>
              )}
              {/* Valeur animée du compteur */}
              <p className="text-4xl text-[var(--secondary-500)] font-bold mb-1"> {/* Taille du texte ajustée pour s'intégrer avec l'icône */}
                <AnimatedCounter targetValue={stat.value} /> 
              </p>
              {/* Label de la statistique */}
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;