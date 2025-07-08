'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getRole } from '@/lib/api/auth';
import Loader from '@/components/ui/loader'; // Assurez-vous que ce composant existe

import Footer from '@/components/shared/footer'; // Importez votre composant Footer

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false); // Nouveau state pour suivre l'autorisation

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      const userRole = getRole();
      if (userRole !== 'candidate') {
        router.push('/unauthorized'); // Ou une page d'erreur spécifique
        return;
      }
      
      // Optionnel: Vous pourriez ajouter une vérification de token valide ici
      // en appelant une API backend si nécessaire.
      
      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    // Affiche un loader tant que la vérification d'authentification est en cours
    return <Loader role="candidate" />;
  }

  // Si non autorisé (redirigé, mais peut aussi être un état transitoire avant redirection)
  if (!authorized) {
    return null; // Ou un message d'erreur si vous préférez ne pas rediriger immédiatement
  }

  // Si autorisé, affiche le contenu avec le header et le footer
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow">
        {children} {/* Les pages (profile/page.tsx, profile/edit/page.tsx, etc.) */}
        
      </main>
      <Footer /> {/* Votre Footer pour le layout candidat */}
    </div>
  );
}