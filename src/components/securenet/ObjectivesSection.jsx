import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Rocket, 
  Shield, 
  RefreshCw, 
  Activity, 
  Layers,
  GitMerge,
  Gauge,
  Lock,
  Zap,
  Wrench
} from 'lucide-react';

const objectives = [
  {
    icon: Rocket,
    title: "Despliegue Inmutable",
    description: "Cada release crea una nueva versión completa de la infraestructura, eliminando la deriva de configuración y garantizando reproducibilidad total.",
    status: "completed",
    metrics: "0 config drift"
  },
  {
    icon: Layers,
    title: "Arquitectura Escalable",
    description: "Diseño modular preparado para crecer. Docker Compose permite escalar servicios horizontalmente según la demanda.",
    status: "completed",
    metrics: "Scale on demand"
  },
  {
    icon: GitMerge,
    title: "Integración Continua",
    description: "Pipeline Jenkins automatizado que ejecuta builds, tests y validaciones en cada commit, asegurando calidad constante del código.",
    status: "completed",
    metrics: "Auto CI/CD"
  },
  {
    icon: Activity,
    title: "Monitorización en Tiempo Real",
    description: "New Relic proporciona visibilidad completa: métricas de infraestructura, rendimiento de aplicaciones y alertas proactivas.",
    status: "completed",
    metrics: "24/7 monitoring"
  },
  {
    icon: Shield,
    title: "Seguridad por Diseño",
    description: "Security Groups restrictivos, IAM roles con least privilege, secrets management y comunicaciones cifradas end-to-end.",
    status: "completed",
    metrics: "Zero trust"
  },
  {
    icon: RefreshCw,
    title: "Rollback Instantáneo",
    description: "Capacidad de revertir a cualquier versión anterior en segundos gracias a la infraestructura inmutable y versionado completo.",
    status: "completed",
    metrics: "< 30s rollback"
  },
  {
    icon: Lock,
    title: "Secrets Management",
    description: "Gestión segura de credenciales y secretos mediante variables de entorno cifradas, sin hardcodear información sensible.",
    status: "completed",
    metrics: "Encrypted secrets"
  },
  {
    icon: Zap,
    title: "Alta Disponibilidad",
    description: "Arquitectura diseñada para minimizar downtime con health checks automáticos, auto-recovery y load balancing.",
    status: "completed",
    metrics: "99.9% uptime"
  },
  {
    icon: Wrench,
    title: "Operaciones con Power Apps",
    description: "Último paso operativo con Power Apps para tareas sencillas: apagar/encender EC2, parar/reiniciar contenedores y consultar una monitorización ligera similar a la web.",
    status: "completed",
    metrics: "Ops + mini monitor"
  }
];

const milestones = [
  { phase: "Fase 1", title: "Infraestructura Base", description: "Terraform + AWS EC2 configurados", completed: true },
  { phase: "Fase 2", title: "Edge Público AWS", description: "Route 53 + ACM + ALB en producción", completed: true },
  { phase: "Fase 3", title: "Containerización", description: "Docker Compose multi-servicio", completed: true },
  { phase: "Fase 4", title: "CI/CD Pipeline", description: "Jenkins pipeline automatizado", completed: true },
  { phase: "Fase 5", title: "Observabilidad", description: "New Relic integrado", completed: true },
  { phase: "Fase 6", title: "Operación con Power Apps", description: "Acciones simples + mini monitor", completed: true },
];

export default function ObjectivesSection() {
  return (
    <section id="objectives" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a1018] to-[#0a0a0f]" />
      
      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">Logros</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Objetivos <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Cumplidos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Cada objetivo representa un hito de modernización alcanzado en el proyecto
          </p>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          className="mb-16 p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Roadmap de Implementación</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.phase}
                className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute -top-3 left-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                    {milestone.phase}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-medium text-sm">{milestone.title}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-center text-emerald-400 font-medium mt-3">100% Completado</p>
        </motion.div>

        {/* Objectives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective.title}
              className="group relative p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Completed badge */}
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">Done</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="p-3 rounded-xl bg-emerald-500/10 w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <objective.icon className="w-6 h-6 text-emerald-400" />
                </div>
                
                <h4 className="text-base font-semibold text-white mb-2 pr-16">{objective.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{objective.description}</p>
                
                {/* Metric badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300 text-xs font-medium">{objective.metrics}</span>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Summary Banner */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Proyecto 100% Operativo</h3>
                <p className="text-gray-400">Todos los objetivos de modernización cloud han sido alcanzados</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="text-center px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-3xl font-bold text-emerald-400">9</p>
                <p className="text-gray-400 text-sm">Objetivos</p>
              </div>
              <div className="text-center px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-3xl font-bold text-cyan-400">6</p>
                <p className="text-gray-400 text-sm">Fases</p>
              </div>
              <div className="text-center px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-3xl font-bold text-blue-400">7</p>
                <p className="text-gray-400 text-sm">Tecnologías</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
