import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Network, Server, Key, Wifi, CheckCircle2, AlertTriangle } from 'lucide-react';

const securityFeatures = [
  {
    icon: Network,
    title: "Segmentación por VLAN",
    description: "Aislamiento lógico de redes mediante VLANs que previene el movimiento lateral de amenazas y limita el alcance de posibles brechas de seguridad.",
    status: "active"
  },
  {
    icon: Shield,
    title: "Firewall Rules",
    description: "Reglas de firewall stateful que controlan todo el tráfico entrante y saliente, aplicando políticas de seguridad granulares.",
    status: "active"
  },
  {
    icon: Lock,
    title: "ACLs Avanzadas",
    description: "Listas de control de acceso que implementan el principio de mínimo privilegio, bloqueando acceso desde DMZ hacia redes internas.",
    status: "active"
  },
  {
    icon: Server,
    title: "DMZ Aislada",
    description: "Zona desmilitarizada completamente aislada para servicios públicos, protegiendo la red interna de exposición directa a Internet.",
    status: "active"
  },
  {
    icon: Key,
    title: "HTTPS & SSL",
    description: "Certificados SSL/TLS para todas las comunicaciones, garantizando confidencialidad e integridad de los datos en tránsito.",
    status: "active"
  },
  {
    icon: Wifi,
    title: "SSH Seguro",
    description: "Acceso administrativo mediante SSH con autenticación por claves, deshabilitando acceso por contraseña y root directo.",
    status: "active"
  }
];

const stats = [
  { label: "Reglas de Firewall", value: 47, suffix: "+" },
  { label: "VLANs Configuradas", value: 4, suffix: "" },
  { label: "Servicios Protegidos", value: 12, suffix: "" },
  { label: "Uptime", value: 99.9, suffix: "%" }
];

function AnimatedCounter({ value, suffix, duration = 2 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

export default function SecuritySection() {
  return (
    <section id="security" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]" />
      
      {/* Animated security grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(168, 85, 247, 0.1) 50px, rgba(168, 85, 247, 0.1) 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(168, 85, 247, 0.1) 50px, rgba(168, 85, 247, 0.1) 51px)`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">Ciberseguridad</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Seguridad <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Implementada</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Múltiples capas de seguridad diseñadas para proteger la infraestructura siguiendo el modelo de defensa en profundidad
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Status indicator */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Activo</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Security Info */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Tailscale VPN</h3>
              <p className="text-gray-400 leading-relaxed">
                Acceso remoto seguro mediante una VPN mesh que utiliza WireGuard como protocolo subyacente. 
                Permite administrar la infraestructura de forma segura desde cualquier ubicación, 
                con autenticación mediante SSO y auditoría completa de conexiones.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Conectado</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}