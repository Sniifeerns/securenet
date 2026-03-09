import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 px-4 border-t border-gray-800">
      <div className="absolute inset-0 bg-[#050508]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SecureNet Lab
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Infraestructura de red segura con segmentación avanzada, DMZ protegida 
              y automatización inteligente. Proyecto de innovación desarrollado por el Grupo B.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Secciones</h4>
            <ul className="space-y-3">
              {[
                { label: 'Arquitectura', id: 'architecture' },
                { label: 'Seguridad', id: 'security' },
                { label: 'Servicios', id: 'services' },
                { label: 'Equipo', id: 'team' },
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

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://somosdelprieto.com/index.php/2025/11/27/trabajando-en-el-proyecto-securenet-lab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center gap-1"
                >
                  Noticia del Proyecto
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Dashboard Demo
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            SecureNet Lab – <span className="text-cyan-400">Grupo B</span> – Proyecto de Innovación 2026
          </p>
          
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