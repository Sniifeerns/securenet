import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Cpu, GraduationCap } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: "Objetivo",
    description: "Diseñar e implementar una infraestructura de red empresarial segura que integre segmentación avanzada mediante VLANs, una zona desmilitarizada (DMZ) para servicios públicos, y mecanismos de automatización para la gestión eficiente de la red.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Lightbulb,
    title: "Problema que Resuelve",
    description: "Las redes planas tradicionales presentan vulnerabilidades críticas donde un atacante puede moverse lateralmente sin restricciones. SecureNet Lab implementa una arquitectura segmentada que minimiza la superficie de ataque y aísla los servicios críticos.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Cpu,
    title: "Enfoque Técnico",
    description: "Utilizamos tecnologías de virtualización con Proxmox, routing inter-VLAN con OPNsense, automatización con n8n, y acceso remoto seguro mediante Tailscale VPN. Todo bajo una filosofía de defensa en profundidad y zero-trust.",
    color: "from-cyan-500 to-green-500"
  },
  {
    icon: GraduationCap,
    title: "Justificación Académica",
    description: "Este proyecto aplica conocimientos de administración de redes, seguridad informática, virtualización y automatización, demostrando competencias profesionales en el diseño de infraestructuras empresariales seguras y escalables.",
    color: "from-orange-500 to-red-500"
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Introducción</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Sobre el <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Proyecto</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Una infraestructura de red diseñada con los más altos estándares de seguridad empresarial
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-gray-700 transition-all duration-500 overflow-hidden">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.color} mb-6`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.description}</p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-gray-800 rounded-tr-2xl opacity-50" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}