/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Image from 'next/image';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[color:var(--neutral-50)] text-[color:var(--primary-800)]">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-extrabold mb-6">À propos de HireMatch</h2>
          <p className="text-lg leading-relaxed mb-4">
            HireMatch est une plateforme innovante qui utilise l'intelligence artificielle pour transformer le processus de recrutement. Nous aidons les entreprises à identifier les meilleurs talents plus rapidement, tout en offrant aux candidats une expérience simplifiée et personnalisée.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Grâce à l'analyse intelligente de CV, la publication d'offres optimisée et un tableau de bord intuitif, nous créons un lien puissant entre les recruteurs et les chercheurs d'emploi. Notre mission est de rendre le recrutement plus humain, plus efficace et plus pertinent.
          </p>
          <p className="text-lg leading-relaxed">
            Que vous soyez une entreprise cherchant à simplifier vos recrutements ou un candidat en quête d'une nouvelle opportunité, HireMatch est votre partenaire de confiance.
          </p>
        </div>

        {/* Vector Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/about_bg.png"
            alt="Illustration représentant le recrutement IA"
            width={500}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
