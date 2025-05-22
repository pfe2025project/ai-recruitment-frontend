/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithGoogle } from '@/lib/api/auth';
import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (e: React.FormEvent, email: string, password: string) => void;
  role: 'candidate' | 'recruiter';
}

export default function AuthForm({ type, onSubmit, role }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(e, email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(role)
    } catch (error: any) {
      console.error('Google sign in error:', error)
      setError(error);
      // Optionally show error to user
    }
  }
  

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email field remains unchanged */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
          Email address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
            placeholder="your@email.com"
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

      {/* Updated Password field with eye icon */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
            placeholder={type === 'login' ? 'Enter your password' : 'Create a password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
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

      {type === 'register' && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[color:var(--neutral-700)] mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className="w-full px-4 py-3 rounded-lg border border-[color:var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-all"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
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
              type="checkbox"
              className="h-4 w-4 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-[color:var(--neutral-300)] rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[color:var(--neutral-600)]">
              Remember me
            </label>
          </div>
          <a
            href="#"
            className={`text-sm ${
              role === 'candidate'
                ? 'text-[color:var(--primary-600)] hover:text-[color:var(--primary-500)]'
                : 'text-[color:var(--secondary-600)] hover:text-[color:var(--secondary-500)]'
            }`}
          >
            Forgot password?
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
        className={`w-full py-3 px-4 rounded-lg cursor-pointer font-semibold text-white transition-all duration-300 
          ${role === 'candidate' 
            ? 'bg-[var(--primary-600)] hover:bg-[var(--primary-700)]' 
            : 'bg-[var(--secondary-600)] hover:bg-[var(--secondary-700)]'} 
          ${isSubmitting ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}
        `}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center  space-x-2">
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{type === 'login' ? 'Logging in...' : 'Registering...'}</span>
          </div>
        ) : (
          <span>
            {type === 'login' ? 'Sign in' : 'Sign up'} as {role}
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
        Sign {type === 'login' ? 'in' : 'up'} with Google
      </button>
    </form>
  );
}