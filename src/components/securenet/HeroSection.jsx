import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Rocket, ExternalLink, ChevronDown } from 'lucide-react';
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">Cloud-Native Infrastructure</span>
          </motion.div>

          {/* Main title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">Proyecto </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              SecureNet
            </span>
          </h1>
          
          {/* Subtitle - Modernización Cloud */}
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Modernización <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Cloud</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Infraestructura moderna desplegada en <span className="text-orange-400 font-medium">AWS EC2</span>, 
            provisionada con <span className="text-purple-400 font-medium">Terraform</span>, 
            orquestada con <span className="text-blue-400 font-medium">Docker Compose</span>, 
            automatizada con <span className="text-yellow-400 font-medium">Jenkins CI/CD</span> y 
            monitorizada en tiempo real con <span className="text-green-400 font-medium">New Relic</span>, 
            con operación final simplificada desde <span className="text-indigo-400 font-medium">Power Apps</span>.
          </motion.p>

          {/* Tech Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { name: 'Terraform', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/40 text-purple-300' },
              { name: 'AWS EC2', color: 'from-orange-500/20 to-orange-600/20 border-orange-500/40 text-orange-300' },
              { name: 'Docker', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-300' },
              { name: 'Jenkins', color: 'from-red-500/20 to-red-600/20 border-red-500/40 text-red-300' },
              { name: 'New Relic', color: 'from-green-500/20 to-green-600/20 border-green-500/40 text-green-300' },
              { name: 'Power Apps', color: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/40 text-indigo-300' },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${tech.color} border text-sm font-medium`}
              >
                {tech.name}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={() => scrollToSection('cloud-architecture')}
              className="group relative px-8 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium text-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <Rocket className="w-5 h-5 mr-2 inline" />
              Ver Stack Cloud
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              onClick={() => scrollToSection('objectives')}
              variant="outline"
              className="px-8 py-6 border-2 border-gray-700 hover:border-emerald-500/50 bg-transparent hover:bg-emerald-500/10 text-gray-300 hover:text-white rounded-xl font-medium text-lg transition-all duration-300"
            >
              <Shield className="w-5 h-5 mr-2 inline" />
              Objetivos Cumplidos
            </Button>

            <Button
              onClick={() => scrollToSection('dashboard')}
              variant="outline"
              className="px-8 py-6 border-2 border-gray-700 hover:border-green-500/50 bg-transparent hover:bg-green-500/10 text-gray-300 hover:text-white rounded-xl font-medium text-lg transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-2 inline" />
              Dashboard Live
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
      <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-500/20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-purple-500/20 rounded-full" />
      <div className="absolute top-1/3 right-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
    </section>
  );
}
