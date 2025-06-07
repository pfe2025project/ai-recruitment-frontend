/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {

  
  return (
    <section
      // Moved background and color from style to className
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--secondary-600)] text-[color:var(--neutral-50)]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
          alt="Équipe diversifiée collaborant au bureau"
          fill
          style={{ objectFit: 'cover', opacity: 0.5 }}
          quality={90}
        />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Connectez les talents aux opportunités. <br className="hidden md:inline" /> Simple. Intelligent. Efficace.
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
          HireMatch révolutionne le recrutement avec une analyse de CV alimentée par l'IA, une publication d'offres simplifiée et une gestion intuitive des candidats.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Candidate Button */}
          <button
            // Removed style prop, moved colors to Tailwind classes
            className="px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer duration-300 bg-[color:var(--neutral-50)] text-[color:var(--primary-600)] hover:bg-[color:var(--neutral-100)] hover:text-[color:var(--primary-700)]"
          >
            Je suis Candidat
          </button>

          {/* Recruiter Button */}
          <button
            // Removed style prop, moved colors to Tailwind classes
            className="px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-2 border-[color:var(--neutral-50)] text-[color:var(--neutral-50)] hover:bg-[color:var(--neutral-50)] hover:text-[color:var(--primary-600)]"
          >
            Je suis Recruteur
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;