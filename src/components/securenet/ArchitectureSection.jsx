import React from 'react';
import { motion } from 'framer-motion';
import { Network, Shield, Globe, Lock, Router, Server, Wifi } from 'lucide-react';

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
          
          <div className="overflow-x-auto">
            <div className="relative min-w-[1080px] h-[620px]">
              {/* Main vertical line */}
              <div className="absolute left-[300px] top-[86px] w-px h-[330px] bg-slate-500/80" />

              {/* Branches */}
              <div className="absolute left-[390px] top-[182px] w-[180px] h-px bg-slate-500/80" />
              <div className="absolute left-[300px] top-[440px] w-[240px] h-px bg-slate-500/80" />
              <div className="absolute left-[90px] top-[440px] w-px h-[34px] bg-slate-500/80" />
              <div className="absolute left-[300px] top-[440px] w-px h-[34px] bg-slate-500/80" />
              <div className="absolute left-[510px] top-[440px] w-px h-[34px] bg-slate-500/80" />
              <div className="absolute left-[570px] top-[182px] w-[260px] h-px bg-slate-500/80" />

              {/* Internet */}
              <motion.div
                className="absolute left-[220px] top-[10px] w-[160px] py-4 rounded-[40px] bg-slate-200 text-center border-2 border-blue-400"
                whileHover={{ scale: 1.03 }}
              >
                <Globe className="w-6 h-6 text-slate-700 mx-auto mb-1" />
                <p className="text-slate-800 font-bold text-sm tracking-wide uppercase">Internet</p>
              </motion.div>

              {/* Router 1 */}
              <motion.div
                className="absolute left-[250px] top-[120px] w-[100px] h-[60px] rounded-full bg-cyan-700 border-2 border-cyan-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
              >
                <Shield className="w-8 h-8 text-cyan-100" />
              </motion.div>
              <p className="absolute left-[242px] top-[188px] text-xs text-slate-300">Cisco RV340</p>

              {/* Switch top */}
              <motion.div
                className="absolute left-[390px] top-[150px] w-[180px] p-3 rounded-lg bg-cyan-800 border-2 border-cyan-200"
                whileHover={{ scale: 1.02 }}
              >
                <Network className="w-5 h-5 text-cyan-100 mb-1" />
                <p className="text-cyan-100 text-sm font-semibold">Switch Cisco 3560</p>
              </motion.div>

              {/* DMZ */}
              <motion.div
                className="absolute left-[830px] top-[100px] w-[220px] h-[190px] p-6 rounded-2xl bg-slate-100 border-2 border-blue-500 flex flex-col justify-center"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-slate-800 text-2xl font-semibold text-center">DMZ</p>
                <p className="text-slate-600 text-center mt-2">172.16.40.0/24</p>
              </motion.div>

              {/* Router 2 */}
              <motion.div
                className="absolute left-[250px] top-[260px] w-[100px] h-[60px] rounded-full bg-cyan-700 border-2 border-cyan-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
              >
                <Router className="w-8 h-8 text-cyan-100" />
              </motion.div>
              <p className="absolute left-[240px] top-[328px] text-xs text-slate-300">Cisco 1900</p>

              {/* Switch bottom */}
              <motion.div
                className="absolute left-[240px] top-[380px] w-[120px] p-2 rounded-lg bg-cyan-800 border-2 border-cyan-200"
                whileHover={{ scale: 1.02 }}
              >
                <Wifi className="w-5 h-5 text-cyan-100 mx-auto" />
                <p className="text-cyan-100 text-center text-xs mt-1">Cisco 2960</p>
              </motion.div>

              {/* VLAN cards */}
              <motion.div className="absolute left-[10px] top-[474px] w-[160px] h-[170px] rounded-2xl bg-slate-100 border-2 border-blue-500 p-5" whileHover={{ y: -3 }}>
                <p className="text-slate-800 font-bold text-center">SOPORTE</p>
                <p className="text-slate-800 font-semibold text-center mt-6">VLAN 10</p>
                <p className="text-slate-600 text-center">172.16.10.0/24</p>
              </motion.div>

              <motion.div className="absolute left-[220px] top-[474px] w-[160px] h-[170px] rounded-2xl bg-slate-100 border-2 border-blue-500 p-5" whileHover={{ y: -3 }}>
                <p className="text-slate-800 font-bold text-center">VENTAS</p>
                <p className="text-slate-800 font-semibold text-center mt-6">VLAN 20</p>
                <p className="text-slate-600 text-center">172.16.20.0/24</p>
              </motion.div>

              <motion.div className="absolute left-[430px] top-[474px] w-[160px] h-[170px] rounded-2xl bg-slate-100 border-2 border-blue-500 p-5" whileHover={{ y: -3 }}>
                <p className="text-slate-800 font-bold text-center">ADMINISTRACION</p>
                <p className="text-slate-800 font-semibold text-center mt-6">VLAN 30</p>
                <p className="text-slate-600 text-center">172.16.30.0/24</p>
              </motion.div>
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
