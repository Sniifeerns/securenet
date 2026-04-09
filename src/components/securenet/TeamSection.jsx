import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ExternalLink, Code, Cloud, Terminal } from 'lucide-react';

export default function TeamSection() {
  return (
    <section id="team" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0f1a] to-[#0a0a0f]" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Desarrollador</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Creado por
          </h2>
        </motion.div>

        {/* Author Card */}
        <motion.div
          className="relative group max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-cyan-500/40 transition-all duration-500">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors">
                    <img
                      src="/img/javier.png"
                      alt="Javier Naranjo Simarro"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-medium">Active</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Javier Naranjo Simarro
                  </h3>
                  <p className="text-cyan-400 font-medium mb-4">
                    Cloud & DevOps Engineer
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Estudiante de 2º ASIR especializado en infraestructura cloud, 
                    automatización CI/CD y tecnologías de contenedores. 
                    Responsable del diseño e implementación completa de este proyecto 
                    de modernización cloud.
                  </p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                    {['Terraform', 'AWS', 'Docker', 'Jenkins', 'New Relic', 'Linux'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Social Link */}
                  <a
                    href="https://www.linkedin.com/in/javier-naranjo-simarro-67325a356"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 group/link"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">LinkedIn</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50" />
          </div>
        </motion.div>

        {/* Project Stats */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <Cloud className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-white font-bold">AWS EC2</p>
            <p className="text-gray-500 text-xs">Cloud Provider</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <Terminal className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-bold">IaC</p>
            <p className="text-gray-500 text-xs">Terraform</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <Code className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-white font-bold">CI/CD</p>
            <p className="text-gray-500 text-xs">Jenkins</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}