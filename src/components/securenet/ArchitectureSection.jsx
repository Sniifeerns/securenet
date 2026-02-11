import React from 'react';
import { motion } from 'framer-motion';
import { Network, Shield, Globe, Lock, Router, Server, Wifi, ArrowRight } from 'lucide-react';

const vlans = [
  { name: "VLAN 10", subnet: "172.16.10.0/24", description: "Red de Administración", color: "blue", icon: Shield },
  { name: "VLAN 20", subnet: "172.16.20.0/24", description: "Red de Usuarios", color: "green", icon: Wifi },
  { name: "VLAN 30", subnet: "172.16.30.0/24", description: "Red de Servidores", color: "purple", icon: Server },
  { name: "DMZ", subnet: "172.16.40.0/24", description: "Zona Desmilitarizada", color: "orange", icon: Globe },
  { name: "Transit", subnet: "10.10.0.0/30", description: "Red de Tránsito", color: "cyan", icon: Router },
];

const features = [
  {
    title: "Inter-VLAN Routing",
    description: "Enrutamiento controlado entre segmentos de red mediante OPNsense, permitiendo comunicación selectiva entre VLANs.",
    icon: Router
  },
  {
    title: "ACLs Avanzadas",
    description: "Listas de control de acceso que impiden que la DMZ acceda a la LAN interna, siguiendo el principio de mínimo privilegio.",
    icon: Shield
  },
  {
    title: "NAT & Port Forwarding",
    description: "Traducción de direcciones para acceso a Internet y redirección de puertos para servicios públicos en la DMZ.",
    icon: Globe
  },
  {
    title: "Reverse Proxy & HTTPS",
    description: "Proxy inverso con certificados SSL para proteger las comunicaciones y ocultar la estructura interna.",
    icon: Lock
  },
  {
    title: "VPN con Tailscale",
    description: "Acceso remoto seguro mediante VPN mesh que permite administración desde cualquier ubicación.",
    icon: Network
  },
  {
    title: "Automatización n8n",
    description: "Workflows automatizados para monitoreo, alertas y gestión de la infraestructura.",
    icon: Server
  }
];

export default function ArchitectureSection() {
  const colorMap = {
    blue: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400", glow: "shadow-blue-500/20" },
    green: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-400", glow: "shadow-green-500/20" },
    purple: { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400", glow: "shadow-purple-500/20" },
    orange: { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-400", glow: "shadow-orange-500/20" },
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/50", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  };

  return (
    <section id="architecture" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Infraestructura</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Arquitectura <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Técnica</span>
          </h2>
        </motion.div>

        {/* Network Diagram */}
        <motion.div
          className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Topología de Red</h3>
          
          {/* Visual diagram */}
          <div className="relative">
            {/* Internet */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <span className="text-red-300 font-medium">Internet</span>
              </motion.div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center mb-8">
              <div className="w-0.5 h-12 bg-gradient-to-b from-red-500/50 to-cyan-500/50" />
            </div>

            {/* Firewall/Router */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="px-12 py-6 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                <span className="text-cyan-300 font-semibold text-lg">OPNsense Firewall</span>
                <p className="text-cyan-400/70 text-sm mt-1">10.10.0.0/30</p>
              </motion.div>
            </div>

            {/* Arrows to VLANs */}
            <div className="flex justify-center mb-8">
              <div className="flex items-end gap-8">
                <div className="w-0.5 h-8 bg-blue-500/50 rotate-45 origin-bottom" />
                <div className="w-0.5 h-12 bg-green-500/50" />
                <div className="w-0.5 h-8 bg-purple-500/50" />
                <div className="w-0.5 h-8 bg-orange-500/50 -rotate-45 origin-bottom" />
              </div>
            </div>

            {/* VLANs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vlans.slice(0, 4).map((vlan, index) => {
                const colors = colorMap[vlan.color];
                return (
                  <motion.div
                    key={vlan.name}
                    className={`p-6 rounded-xl ${colors.bg} border ${colors.border} shadow-lg ${colors.glow}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <vlan.icon className={`w-8 h-8 ${colors.text} mb-3`} />
                    <h4 className={`font-semibold ${colors.text}`}>{vlan.name}</h4>
                    <p className="text-gray-300 text-sm mt-1">{vlan.subnet}</p>
                    <p className="text-gray-500 text-xs mt-2">{vlan.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-3 rounded-lg bg-cyan-500/10 w-fit mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}