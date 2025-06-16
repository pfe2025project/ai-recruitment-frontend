// app/layout.tsx
import { ProfileProvider } from '@/context/ProfileContext';
import '../styles/globals.css';
import type { Metadata } from 'next';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'TalentConnect',
  description: 'Connect Talent With Opportunity',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // You can enhance this context object with more info per page in the future
  const pageContext = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <ProfileProvider>
          {children}
          <ChatBot pageContext={pageContext} />
        </ProfileProvider>
      </body>
    </html>
  );
}
