/* eslint-disable react/no-unescaped-entities */
"use client"; // Nécessaire pour les composants React dans Next.js 13+

import React from 'react';
import Image from 'next/image';

const TestimonialsSection: React.FC = () => {
  // Fonctions utilitaires pour obtenir les variables CSS de couleur
  const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
  const getSecondaryColor = (shade: number) => `var(--secondary-${shade})`;
  const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;

  const testimonials = [
    {
      quote: "HireMatch a complètement transformé notre processus de recrutement. L'analyse des CVs est incroyablement précise et nous fait gagner un temps fou !",
      name: "Sarah M.",
      title: "Responsable RH, TechSolutions Inc.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      type: 'recruiter' // Ajout du type pour adapter les couleurs
    },
    {
      quote: "Grâce à HireMatch, j'ai trouvé le poste de mes rêves en quelques semaines. La plateforme est intuitive et j'ai apprécié la communication directe avec les recruteurs.",
      name: "Benami M.",
      title: "Développeur Senior",
      avatar: "/images/benami.png",
      type: 'candidate' // Ajout du type pour adapter les couleurs
    },
    {
      quote: "Une plateforme indispensable pour tout recruteur moderne. La gestion des candidatures n'a jamais été aussi simple et efficace.",
      name: "Amélie R.",
      title: "Talent Acquisition Manager, Innovate Corp.",
      avatar: "https://randomuser.me/api/portraits/women/72.jpg",
      type: 'recruiter' // Ajout du type pour adapter les couleurs
    },
  ];
  
  const gradientColors ={
        start: 'var(--primary-600)',
        end: 'var(--secondary-600)'
      };

  return (
    <section className="py-20" style={{ backgroundColor: getNeutralColor(50) }}> {/* bg-gray-100 -> neutral-50 */}
      <div className="container mx-auto px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})` }}
        >
          Ce qu'ils disent de nous
        </h2>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => {
            // Détermine la couleur de la bordure de l'avatar et du nom en fonction du type de témoignage
            const borderColor = testimonial.type === 'candidate' ? getPrimaryColor(200) : getSecondaryColor(200);
            const nameColor = testimonial.type === 'candidate' ? getPrimaryColor(600) : getSecondaryColor(600);

            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300 flex flex-col items-center text-center"
              >
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mb-6 border-4" // border-indigo-200 est supprimé ici
                  style={{ borderColor: borderColor }} // Utilise la couleur dynamique via style inline
                />
                <p
                  className="italic mb-6"
                  style={{ color: getNeutralColor(700) }} // text-neutral-700 -> neutral-700
                >
                  "{testimonial.quote}"
                </p>
                <p
                  className="font-semibold"
                  style={{ color: nameColor }} // Utilise la couleur dynamique via style inline
                >
                  {testimonial.name}
                </p>
                <p
                  className="text-sm"
                  style={{ color: getNeutralColor(500) }} // text-neutral-500 -> neutral-500
                >
                  {testimonial.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;