import React from 'react';
import HeroSection from '@/components/securenet/HeroSection';
import CloudArchitectureSection from '@/components/securenet/CloudArchitectureSection';
import ObjectivesSection from '@/components/securenet/ObjectivesSection';
import TeamSection from '@/components/securenet/TeamSection';
import DashboardSection from '@/components/securenet/DashboardSection';
import Footer from '@/components/securenet/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <HeroSection />
      <CloudArchitectureSection />
      <ObjectivesSection />
      <DashboardSection />
      <TeamSection />
      <Footer />
    </div>
  );
}