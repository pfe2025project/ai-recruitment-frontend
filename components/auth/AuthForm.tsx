/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithGoogle } from '@/lib/api/auth';
import { useState } from 'react';

// Mise à jour de l'interface AuthFormProps pour inclure fullName comme paramètre optionnel pour onSubmit
interface AuthFormProps {
  type: 'login' | 'register';
  // Modifiez la signature de onSubmit pour accepter fullName (ou undefined)
  onSubmit: (e: React.FormEvent, email: string, password: string, fullName?: string) => void;
  role: 'candidate' | 'recruiter';
}

export default function AuthForm({ type, onSubmit, role }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [fullName, setFullName] = useState(''); // Nouveau state pour le nom complet
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.'); // Message en français
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      // Passer le nom complet si le type est 'register'
      await onSubmit(e, email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(role)
    } catch (error: any) {
      console.error('Erreur de connexion Google :', error) // Message en français
      setError(error.message || 'La connexion Google a échoué.'); // Afficher un message d'erreur utilisateur
      // Pas de throw ici pour ne pas arrêter l'exécution du composant
    }
  }
  

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email field remains unchanged */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
          Adresse e-mail
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            disabled={isSubmitting}
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-[color:var(--neutral-400)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Nouveau champ pour le nom complet, affiché seulement pour l'inscription */}
      {/* {type === 'register' && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
            Nom complet
          </label>
          <input
            id="fullName"
            name="fullName"
            disabled={isSubmitting}
            type="text"
            autoComplete="name"
            required // Rendre le nom complet obligatoire pour l'inscription
            className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
            placeholder="Votre nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      )} */}

      {/* Updated Password field with eye icon */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            disabled={isSubmitting}
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
            placeholder={type === 'login' ? 'Entrez votre mot de passe' : 'Créez un mot de passe'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="h-5 w-5 cursor-pointer text-[color:var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5 cursor-pointer text-[color:var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {type === 'register' && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              disabled={isSubmitting}
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5 text-[color:var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-[color:var(--neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Rest of the form remains unchanged */}
      {type === 'login' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              disabled={isSubmitting}
              type="checkbox"
              className="h-4 w-4 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-[color:var(--neutral-300)] rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[color:var(--neutral-600)]">
              Se souvenir de moi
            </label>
          </div>
          <a
            href="/forgot-password"
            className={`text-sm ${
              role === 'candidate'
                ? 'text-[color:var(--primary-600)] hover:text-[color:var(--primary-500)]'
                : 'text-[color:var(--secondary-600)] hover:text-[color:var(--secondary-500)]'
            }`}
          >
            Mot de passe oublié ?
          </a>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 font-medium -mt-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 
          ${role === 'candidate' 
            ? 'bg-[var(--primary-600)] hover:bg-[var(--primary-700)]' 
            : 'bg-[var(--secondary-600)] hover:bg-[var(--secondary-700)]'} 
          ${isSubmitting ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer'}
        `}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{type === 'login' ? 'Connexion en cours...' : 'Inscription en cours...'}</span>
          </div>
        ) : (
          <span>
            {type === 'login' ? 'Se connecter' : "S'inscrire"} en tant que {role}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full py-3 px-4 cursor-pointer rounded-lg font-medium text-[color:var(--neutral-700)] bg-white border border-[color:var(--neutral-300)] hover:bg-gray-100 flex items-center justify-center gap-2 shadow-sm mt-2"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        {type === 'login' ? 'Se connecter' : "S'inscrire"} avec Google
      </button>
    </form>
  );
}