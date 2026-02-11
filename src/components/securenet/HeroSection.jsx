import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-[#0a0a0f]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300">Proyecto de Innovación 2026</span>
          </motion.div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SECURENET
            </span>
            <br />
            <span className="text-white">LAB</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-400 mb-4 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Proyecto de Innovación – <span className="text-cyan-400 font-medium">Grupo B</span>
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            "Infraestructura de red segura con segmentación avanzada, DMZ protegida 
            y automatización inteligente."
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={() => scrollToSection('architecture')}
              className="group relative px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-medium text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Shield className="w-5 h-5 mr-2 inline" />
              Ver Arquitectura
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              onClick={() => scrollToSection('about')}
              variant="outline"
              className="px-8 py-6 border-2 border-gray-700 hover:border-purple-500/50 bg-transparent hover:bg-purple-500/10 text-gray-300 hover:text-white rounded-xl font-medium text-lg transition-all duration-300"
            >
              <FileText className="w-5 h-5 mr-2 inline" />
              Documentación Técnica
            </Button>

            <Button
              onClick={() => scrollToSection('dashboard')}
              variant="outline"
              className="px-8 py-6 border-2 border-gray-700 hover:border-cyan-500/50 bg-transparent hover:bg-cyan-500/10 text-gray-300 hover:text-white rounded-xl font-medium text-lg transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-2 inline" />
              Acceder al Laboratorio
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-gray-600" />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-blue-500/20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-purple-500/20 rounded-full" />
      <div className="absolute top-1/3 right-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
    </section>
  );
}