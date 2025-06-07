import React from 'react';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import AboutSection from '@/components/about/AboutSection';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
