import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 px-4 border-t border-gray-800">
      <div className="absolute inset-0 bg-[#050508]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SecureNet Cloud
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Proyecto de modernización cloud con infraestructura como código (Terraform), 
              despliegue en AWS EC2, contenedores Docker, CI/CD con Jenkins y 
              monitorización con New Relic, con capa operativa final en Power Apps.
            </p>
            
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Terraform', 'AWS EC2', 'Docker', 'Jenkins', 'New Relic', 'Power Apps'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-400 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Secciones</h4>
            <ul className="space-y-3">
              {[
                { label: 'Stack Cloud', id: 'cloud-architecture' },
                { label: 'Objetivos', id: 'objectives' },
                { label: 'Dashboard Live', id: 'dashboard' },
                { label: 'Desarrollador', id: 'team' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              Desarrollado por <span className="text-cyan-400 font-medium">Javier Naranjo Simarro</span>
            </p>
            <a
              href="https://www.linkedin.com/in/javier-naranjo-simarro-67325a356"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Volver arriba ↑
            </button>
          </div>
        </div>

        {/* Decorative */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </footer>
  );
}
