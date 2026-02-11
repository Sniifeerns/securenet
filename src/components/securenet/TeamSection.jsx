import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, ExternalLink } from 'lucide-react';

const team = [
  { name:"Tania Morales", role:"Estudiante 2º ASIR · Redes y Seguridad", image:"/img/tania.jpg", social:{ type:"linkedin", url:"https://www.linkedin.com/in/tania-morales-sánchez-348615164" } },
  { name:"Javier Naranjo", role:"Estudiante 2º ASIR · Infraestructura y Routing", image:"/img/javier.jpg", social:{ type:"linkedin", url:"https://www.linkedin.com/in/javier-naranjo-simarro-67325a356" } },
  { name:"Adrián Delgado", role:"Estudiante 2º ASIR · Automatización (n8n) y Servicios", image:"/img/adrian.jpg", social:{ type:"linkedin", url:"https://www.linkedin.com/in/adrian-delgado-campos-b025333ab" } },
  { name:"Martín Labrador", role:"Estudiante 2º ASIR · Sistemas Linux y Despliegue", image:"/img/martin.jpg", social:{ type:"instagram", url:"https://www.instagram.com/_martinlabrador_" } },
];



export default function TeamSection() {
  return (
    <section id="team" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0f1a] to-[#0a0a0f]" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase">El Equipo</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Grupo B</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Un equipo multidisciplinar de profesionales en redes, seguridad y automatización
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-blue-500/30 transition-all duration-500">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="relative p-6 -mt-16">
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{member.role}</p>
                  
                  {/* Social Link */}
                  <a
                    href={member.social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 text-blue-400 hover:text-white hover:border-blue-400 transition-all duration-300 group/link"
                  >
                    {member.social.type === 'linkedin' ? (
                      <Linkedin className="w-4 h-4" />
                    ) : (
                      <Instagram className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {member.social.type === 'linkedin' ? 'LinkedIn' : 'Instagram'}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Description */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Estudiantes del ciclo formativo de grado superior en Administración de Sistemas Informáticos en Red,
            especializados en el diseño, implementación y gestión de infraestructuras de red empresariales seguras.
          </p>
        </motion.div>
      </div>
    </section>
  );
}