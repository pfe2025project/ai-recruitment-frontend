/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/auth.ts
import { supabase } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'; // Importation des types User et Session

// URL de base de votre backend Flask
const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/';

interface AuthResult {
  session: Session | null;
  user: User | null;
  role?: 'candidate' | 'recruiter' | null;
  message?: string; // Pour des messages supplémentaires (ex: confirmation email)
}

// --- Helper pour interagir avec le backend Flask pour la création/mise à jour du profil ---
// Cette fonction appelle le nouvel endpoint /auth/sync-profile de votre Flask
async function createProfileInBackend(
  userId: string,
  email: string,
  role: 'candidate' | 'recruiter',
  fullName?: string // Peut être undefined, pour les utilisateurs OAuth
) {
  try {
    const response = await fetch(`${FLASK_API_BASE_URL}/auth/sync-profile`, { // <-- Nouvel endpoint ici
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
        email: email,
        role: role,
        full_name: fullName, // Passer le nom complet si disponible
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur lors de la synchronisation du profil Flask :", errorData);
      throw new Error(errorData.details || 'Échec de la synchronisation du profil sur le backend');
    }

    const backendResponse = await response.json();
    console.log("Réponse du backend Flask pour le profil :", backendResponse);
    return backendResponse;

  } catch (backendError: any) {
    console.error("Erreur d'appel au backend Flask pour le profil :", backendError);
    throw new Error(`Échec de l'opération de profil : ${backendError.message}`);
  }
}

// --- Fonction de connexion (Email/Mot de passe) - Utilise Supabase Auth ---
export async function loginUser(email: string, password: string, role: 'candidate' | 'recruiter'): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'La connexion a échoué.');
  }

  if (!data.session || !data.user) {
    throw new Error('Aucune session ou utilisateur retourné après la connexion. Veuillez vérifier votre e-mail ou réessayer.');
  }

  // Après connexion Supabase, synchroniser le profil avec votre backend Flask
  await createProfileInBackend(
    data.user.id,
    data.user.email!,
    role,
    (data.user.user_metadata as any)?.full_name as string | undefined
  );

  // Stocker le token Supabase et le rôle dans le localStorage
  localStorage.setItem('supabase_access_token', data.session.access_token);
  localStorage.setItem('supabase_refresh_token', data.session.refresh_token);
  localStorage.setItem('user_role', role);

  return { session: data.session, user: data.user, role: role };
}

// --- Fonction d'inscription (Email/Mot de passe) - Utilise Supabase Auth ---
export async function registerUser(
  email: string,
  password: string,
  role: 'candidate' | 'recruiter',
  fullName?: string // Facultatif : si vous collectez le nom complet lors de l'inscription
): Promise<AuthResult> {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { // Stocké dans user_metadata de Supabase Auth
        full_name: fullName,
      }
    }
  });

  if (signUpError) {
    throw new Error(signUpError.message || "L'inscription a échoué.");
  }

  if (!data.user) {
    return { 
      session: null, 
      user: null, 
      role: role, 
      message: "Veuillez vérifier votre e-mail pour confirmer votre compte. Une fois confirmé, vous pourrez vous connecter." 
    };
  }

  // Après inscription Supabase, synchroniser le profil avec votre backend Flask
  try {
    await createProfileInBackend(
      data.user.id,
      data.user.email!,
      role,
      fullName
    );
  } catch (backendError: any) {
    console.error("Échec de la création du profil Flask après l'inscription Supabase :", backendError);
    throw new Error(`L'inscription a été partiellement réussie. Veuillez contacter le support pour finaliser votre profil. Détails : ${backendError.message}`);
  }

  if (data.session) {
    localStorage.setItem('supabase_access_token', data.session.access_token);
    localStorage.setItem('supabase_refresh_token', data.session.refresh_token);
    localStorage.setItem('user_role', role);
    return { session: data.session, user: data.user, role: role };
  } else {
    return { 
      session: null, 
      user: data.user,
      role: role, 
      message: "Un e-mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte." 
    };
  }
}

// --- Connexion avec Google - Utilise Supabase Auth ---
export async function signInWithGoogle(role: 'candidate' | 'recruiter') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/callback?role=${role}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

// --- Gestion du callback OAuth - Utilise Supabase Auth ---
export async function handleAuthCallback(): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session || !session.user) {
    throw new Error('Aucune session ou utilisateur trouvé après le rappel OAuth.');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role') as 'candidate' | 'recruiter' | null;

  if (!role) {
    throw new Error('Rôle non trouvé dans l\'URL de rappel. Impossible d\'attribuer le profil.');
  }

  // Après le callback OAuth, synchroniser le profil avec votre backend Flask
  try {
    await createProfileInBackend(
      session.user.id,
      session.user.email!,
      role,
      (session.user.user_metadata as any)?.full_name as string | undefined
    );
  } catch (backendError: any) {
    console.error("Échec de la création du profil Flask après OAuth :", backendError);
    throw new Error(`La connexion OAuth a été partiellement réussie. Veuillez contacter le support. Détails : ${backendError.message}`);
  }

  localStorage.setItem('supabase_access_token', session.access_token);
  localStorage.setItem('supabase_refresh_token', session.refresh_token);
  localStorage.setItem('user_role', role);

  return session;
}

// --- Fonctions de gestion de session locales (basées sur Supabase) ---
export function getAccessToken(): string | null {
  // console.log("token == > ",localStorage.getItem('supabase_access_token'));
  return typeof window !== 'undefined' ? localStorage.getItem('supabase_access_token') : null;
}

export function getRole(): 'candidate' | 'recruiter' | null {
  return typeof window !== 'undefined' ? localStorage.getItem('user_role') as 'candidate' | 'recruiter' : null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function logout() {
  // Déconnexion de Supabase Auth
  supabase.auth.signOut();
  // Nettoyage du localStorage
  localStorage.removeItem('supabase_access_token');
  localStorage.removeItem('supabase_refresh_token');
  localStorage.removeItem('user_role');
}

// --- Récupérer l'utilisateur directement depuis Supabase (méthode recommandée) ---
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Erreur lors de la récupération de l'utilisateur Supabase:", error.message);
    throw new Error(error.message);
  }

  return user;
}


// récupérer le token d'authentification (access token) dans Supabase
export async function getSupabaseAccessToken(): Promise<string | null> {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Erreur lors de la récupération du token d'accès:", error.message);
    return null;
  }

  if (!session) {
    console.warn("Aucune session trouvée.");
    return null;
  }

  return session.access_token;
}
