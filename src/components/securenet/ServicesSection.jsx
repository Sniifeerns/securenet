import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Workflow, Server, Cloud, Shield, Cpu } from 'lucide-react';



const services = [
  {
    icon: Globe,
    title: "Servidor Web en DMZ",
    description: "Servidor web Nginx desplegado en la zona desmilitarizada, accesible públicamente con certificado SSL y protegido por reverse proxy.",
    status: "online",
    metrics: { requests: "2.4K/día", uptime: "99.9%" }
  },
  {
    icon: Workflow,
    title: "n8n Automation Server",
    description: "Plataforma de automatización de workflows para orquestación de tareas, monitoreo de servicios y gestión de alertas.",
    status: "online",
    metrics: { workflows: "15 activos", executions: "500+/día" }
  },
  {
    icon: Server,
    title: "DHCP Failover",
    description: "Servicio DHCP con alta disponibilidad mediante configuración failover primary/secondary, garantizando asignación de IPs sin interrupciones.",
    status: "online",
    metrics: { leases: "50 activos", failover: "Sincronizado" }
  },
  {
    icon: Cloud,
    title: "Infraestructura Virtualizada",
    description: "Entorno completamente virtualizado sobre Proxmox VE, permitiendo snapshots, backups automatizados y escalabilidad.",
    status: "online",
    metrics: { vms: "8 activas", storage: "500GB" }
  },
  {
    icon: Shield,
    title: "Acceso Remoto Seguro",
    description: "Sistema de acceso remoto mediante Tailscale VPN con autenticación SSO, permitiendo administración segura desde cualquier ubicación.",
    status: "online",
    metrics: { conexiones: "4 nodos", latencia: "<50ms" }
  },
  {
    icon: Cpu,
    title: "Monitoreo & Logging",
    description: "Sistema centralizado de logs y monitoreo para visibilidad completa de la infraestructura y detección temprana de anomalías.",
    status: "online",
    metrics: { eventos: "10K+/día", alertas: "Real-time" }
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-green-400 text-sm font-medium tracking-wider uppercase">Servicios</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Servicios <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Desplegados</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Infraestructura de servicios empresariales en producción, diseñados para alta disponibilidad y rendimiento
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-green-500/30 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-medium uppercase">Online</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="p-3 rounded-xl bg-green-500/10 w-fit mb-4 group-hover:bg-green-500/20 transition-colors">
                  <service.icon className="w-6 h-6 text-green-400" />
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-3 pr-20">{service.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
                
                {/* Metrics */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(service.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-cyan-400 font-semibold text-sm">{value}</p>
                        <p className="text-gray-500 text-xs capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 via-cyan-500/50 to-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Stack Tecnológico</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Proxmox VE', 'OPNsense', 'Nginx', 'n8n', 'Tailscale', 'Docker', 'Let\'s Encrypt', 'ISC DHCP'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 text-gray-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-300 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}