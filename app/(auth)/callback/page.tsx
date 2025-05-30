/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleAuthCallback } from '@/lib/api/auth' // Seul handleAuthCallback est nécessaire ici
import Loader from '@/components/ui/loader' // Assurez-vous que ce chemin est correct

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate'); // Initialisé à 'candidate' par défaut

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Le rôle est extrait des searchParams ici pour l'utiliser dans le Loader et la redirection
        const roleParam = searchParams.get('role');
        const validRole = roleParam === 'recruiter' ? 'recruiter' : 'candidate';
        setRole(validRole); // Mettre à jour l'état du rôle pour le Loader

        // Appelle handleAuthCallback qui gère maintenant :
        // 1. La récupération de la session Supabase.
        // 2. L'extraction du rôle de l'URL.
        // 3. L'appel à votre backend Flask (via createProfileInBackend) pour synchroniser le profil.
        // 4. Le stockage des tokens et du rôle dans le localStorage.
        const session = await handleAuthCallback(); 
        
        if (!session) {
          throw new Error('Aucune session trouvée après l\'authentification.');
        }

        // Redirection vers le tableau de bord spécifique au rôle
        router.push(`/${validRole}/dashboard`);

      } catch (err: any) {
        console.error('Erreur lors du rappel d\'authentification :', err);
        setError(err.message || 'Une erreur inconnue est survenue lors de l\'authentification.');
        // Rediriger vers la page de connexion après un court délai en cas d'erreur
        setTimeout(() => router.push('/login'), 3000);
      }
    }

    handleCallback();
  }, [router, searchParams]); // Dépendances du useEffect

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Affiche un loader pendant le traitement du callback
  return <Loader role={role} />;
}