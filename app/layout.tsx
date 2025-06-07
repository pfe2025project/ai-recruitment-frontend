// app/layout.tsx
import { ProfileProvider } from '@/context/ProfileContext';
import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TalentConnect',
  description: 'Connect Talent With Opportunity',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
