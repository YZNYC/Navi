"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { NavbarDemo }from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import BenefitsSection from '../components/BenefitsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/toaster';
import { ModeToggle } from '@/components/modetoggle';


function App() {
  return (
    <>

      
      <div className="min-h-screen bg-white">
        <NavbarDemo />
        <ModeToggle/>

        <h1>AAAsssAA</h1>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection />
          <FeaturesSection />
          <BenefitsSection />
          <TestimonialsSection />
          <CTASection />
        </motion.main>
        
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;