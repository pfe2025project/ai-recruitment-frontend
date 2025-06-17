"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {  getCurrentUser } from '@/lib/api/auth';
import { User } from '@supabase/supabase-js';

const HeroSection: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setUser(null);
      } finally {
      }
    };

    fetchUser();
  }, []);


  const getUserRole = () => {
    if (!user) return '';
    const metadata = user.user_metadata as any;
    return metadata?.role || 'candidate';
  };

  const isCandidate = getUserRole() === 'candidate';

  return (
    <section
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
          {!user ? (
            <>
              {/* Candidate Button */}
              <button
                className="px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer duration-300 bg-[color:var(--neutral-50)] text-[color:var(--primary-600)] hover:bg-[color:var(--neutral-100)] hover:text-[color:var(--primary-700)]"
              >
                Je suis Candidat
              </button>

              {/* Recruiter Button */}
              <button
                className="px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-2 border-[color:var(--neutral-50)] text-[color:var(--neutral-50)] hover:bg-[color:var(--neutral-50)] hover:text-[color:var(--primary-600)]"
              >
                Je suis Recruteur
              </button>
            </>
          ) : isCandidate ? (
            <>
              <button
              
                className="px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer duration-300 bg-[color:var(--neutral-50)] text-[color:var(--primary-600)] hover:bg-[color:var(--neutral-100)] hover:text-[color:var(--primary-700)]"
              >
                Consulter les offres
              </button>
              <button
                className="px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-2 border-[color:var(--neutral-50)] text-[color:var(--neutral-50)] hover:bg-[color:var(--neutral-50)] hover:text-[color:var(--primary-600)]"
              >
                Mon Profil
              </button>
            </>
          ) : (
            <>
              <button
                className="px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer duration-300 bg-[color:var(--neutral-50)] text-[color:var(--primary-600)] hover:bg-[color:var(--neutral-100)] hover:text-[color:var(--primary-700)]"
              >
                Tableau de bord
              </button>
              <button
                className="px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 border-2 border-[color:var(--neutral-50)] text-[color:var(--neutral-50)] hover:bg-[color:var(--neutral-50)] hover:text-[color:var(--primary-600)]"
              >
                Publier une offre
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;