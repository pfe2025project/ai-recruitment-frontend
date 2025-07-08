'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  role: 'candidate' | 'recruiter' | null;
  loading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = async (session: any | null) => {
      setLoading(true); // Set loading to true at the start of any auth state change
      if (session) {
        setUser(session.user);
        setUserId(session.user.id);
        let determinedRole: 'candidate' | 'recruiter' | null = null;
        const storedRole = localStorage.getItem('user_role') as 'candidate' | 'recruiter' | null;

        if (storedRole) {
          determinedRole = storedRole;
          console.log('User role from localStorage:', storedRole);
        } else {
          // Fallback to database query if role not in localStorage
          const { data: candidateData, error: candidateError } = await supabase
            .from('candidates')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (candidateData) {
            determinedRole = 'candidate';
            localStorage.setItem('user_role', 'candidate');
            console.log('User is candidate (from DB):', session.user.id);
          } else {
            if (candidateError) console.error('Supabase candidate query error (onAuthStateChange):', candidateError);
            const { data: recruiterData, error: recruiterError } = await supabase
              .from('recruiters')
              .select('id')
              .eq('id', session.user.id)
              .single();
            if (recruiterData) {
              determinedRole = 'recruiter';
              localStorage.setItem('user_role', 'recruiter');
              console.log('User is recruiter (from DB):', session.user.id);
            } else {
              if (recruiterError) console.error('Supabase recruiter query error (onAuthStateChange):', recruiterError);
              determinedRole = null; // User exists but no role found in candidates or recruiters
              console.log('User has no specific role (candidate/recruiter) (from DB):', session.user.id);
              console.log('Role set to null in onAuthStateChange for user:', session.user.id);
            }
          }
        }
        setRole(determinedRole);
        console.log('Auth state changed. User:', session.user.id, 'Role (value being set):', determinedRole);
      } else {
        setUser(null);
        setRole(null);
        setUserId(null);
        localStorage.removeItem('user_role'); // Clear role on logout
        console.log('Auth state changed. User logged out. Role set to null.');
      }
      setLoading(false); // Set loading to false only after all checks are done
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(session);
    });

    // Initial check for session
    const initializeAuth = async () => {
      setLoading(true); // Start loading for initial check
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session); // Use the same logic for initial check
    };

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};