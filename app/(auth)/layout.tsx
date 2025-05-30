// app/(auth)/layout.tsx  <-- REMARQUEZ LE (auth) ICI
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Ce div fournit le fond et le centrage partagés pour toutes les pages d'authentification.
    // Il n'inclut PAS les composants de header ou de footer.
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center p-4">
      {children}
    </div>
  );
}