import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import BenefitsSection from '@/components/landing/BenefitsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import StatsSection from '@/components/landing/StatsSection';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

export default function HomePage() {
  return (
    <>
      {/* Header and Footer are already included via layout.tsx,
          but if you need to pass specific props or control their visibility,
          you might adjust layout.tsx or pass props down. */}
      {/* <Header />  -> This is in layout.tsx */}
      <Header />
      <main className="flex-grow">
          <HeroSection />
          <HowItWorks />
          <BenefitsSection />
          <TestimonialsSection />
          <StatsSection/>
      </main>
      <Footer />
      
    </>
  );
}