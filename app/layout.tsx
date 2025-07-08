// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import ChatBot from '@/components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Recruitment Platform',
  description: 'AI-powered platform for recruitment and job matching',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <AuthProvider>
          <ProfileProvider>
            <Header />
            {children}
            <Footer />
            {/* <ChatBot /> */}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
