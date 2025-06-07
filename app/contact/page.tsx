import React from 'react';
import ContactSection from '@/components/landing/ContactSection';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
