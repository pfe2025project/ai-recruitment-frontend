/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleToggle from '@/components/auth/RoleToggle';
import AuthForm from '@/components/auth/AuthForm';
import { isAuthenticated, registerUser, getRole } from '@/lib/api/auth'; // Importez getRole
import Loader from '@/components/ui/loader';

export default function RegisterPage() {
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [error, setError] = useState('');
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà authentifié au chargement de la page
    if (isAuthenticated()) {
      const storedRole = getRole(); // Utilise la fonction getRole de lib/api/auth
      if (storedRole === 'candidate') {
        router.push('/candidate/dashboard');
      } else if (storedRole === 'recruiter') {
        router.push('/recruiter/dashboard');
      } else {
        // Si le rôle n'est pas clair, peut-être déconnecter ou rediriger vers une page neutre
        setLoading(false);
      }
    } else {
      setLoading(false); // Arrête le chargement si non authentifié
    }
  }, [router]); // Supprime `loading` des dépendances car il est mis à jour à l'intérieur

  if (loading) {
    return <Loader role='candidate' />; // Vous pouvez ajuster le 'role' ici si nécessaire
  }

  const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    setError('');

    try {
      console.log(`Registering as ${role} with:`, { email, password });

      // registerUser() gère désormais l'authentification avec Supabase
      // et la synchronisation avec votre backend Flask,
      // ainsi que le stockage des informations dans localStorage SI une session est retournée immédiatement.
      const result = await registerUser(email, password, role);
      console.log('Registration success:', result);

      // Si Supabase nécessite une confirmation par e-mail, 'result.session' sera null.
      if (result.session) {
        // Redirection vers le tableau de bord si une session est immédiatement disponible
        router.push(`/${role}/dashboard`);
      } else {
        // Si une confirmation par e-mail est nécessaire, affichez un message à l'utilisateur
        setError(result.message || "Inscription réussie ! Veuillez vérifier votre e-mail pour confirmer votre compte.");
        // Vous pouvez aussi rediriger vers une page "vérifier votre e-mail"
        // router.push('/verify-email');
      }
    } catch (err: any) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Le serveur n'est pas disponible. Veuillez réessayer plus tard.");
      } else {
        setError(err.message || "L'inscription a échoué");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with role indicator */}
        <div
          className={`py-6 px-8 text-center ${
            role === 'candidate'
              ? 'bg-[var(--primary-500)]'
              : 'bg-[var(--secondary-500)]'
          }`}
        >
          <h2 className="text-2xl font-bold text-white">
            {role === 'candidate' ? 'Inscription Candidat' : 'Inscription Recruteur'}
          </h2>
        </div>

        <div className="p-8">
          <RoleToggle role={role} setRole={setRole} />

          {error && (
            <div className="mb-6 p-3 font-bold rounded-lg bg-[var(--error)/10] text-[var(--error)] text-sm">
              {error}
            </div>
          )}

          <AuthForm type="register" onSubmit={handleSubmit} role={role} />

          <div className="mt-6 text-center text-neutral-600">
            Vous avez déjà un compte ?{' '}
            <a 
              href="/login" 
              className={`font-medium ${role === 'candidate'
                                  ? 'text-[var(--primary-600)] hover:text-[var(--primary-500)] '
                                  : 'text-[var(--secondary-600)] hover:text-[var(--secondary-500)] '
                                } transition-colors`}
            >
              Connectez-vous
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}