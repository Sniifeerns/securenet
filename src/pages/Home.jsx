import React from 'react';
import HeroSection from '@/components/securenet/HeroSection';
import AboutSection from '@/components/securenet/AboutSection';
import ArchitectureSection from '@/components/securenet/ArchitectureSection';
import SecuritySection from '@/components/securenet/SecuritySection';
import ServicesSection from '@/components/securenet/ServicesSection';
import TeamSection from '@/components/securenet/TeamSection';
import NewsSection from '@/components/securenet/NewsSection';
import DashboardSection from '@/components/securenet/DashboardSection';
import Footer from '@/components/securenet/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ArchitectureSection />
      <SecuritySection />
      <ServicesSection />
      <TeamSection />
      <NewsSection />
      <DashboardSection />
      <Footer />
    </div>
  );
}