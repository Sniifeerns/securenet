import React from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, 
  Container, 
  GitBranch, 
  Activity, 
  Layers,
  Workflow,
  Shield,
  Zap,
  Smartphone
} from 'lucide-react';

const cloudStack = [
  {
    icon: Layers,
    title: "Infraestructura como Código",
    subtitle: "Terraform",
    description: "Toda la infraestructura está definida como código utilizando Terraform. Esto permite reproducibilidad, versionado y despliegues consistentes en cualquier entorno.",
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-500/10 to-violet-500/10",
    borderColor: "border-purple-500/30",
    features: ["Módulos reutilizables", "State remoto en S3", "Validación pre-deploy"]
  },
  {
    icon: Cloud,
    title: "Computación Cloud",
    subtitle: "AWS EC2",
    description: "La aplicación se ejecuta en instancias EC2 de Amazon Web Services, aprovechando la escalabilidad, disponibilidad y la red global de AWS.",
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-500/10 to-amber-500/10",
    borderColor: "border-orange-500/30",
    features: ["Auto Scaling Groups", "Elastic Load Balancing", "Security Groups"]
  },
  {
    icon: Container,
    title: "Contenedores",
    subtitle: "Docker & Docker Compose",
    description: "Todos los servicios están containerizados con Docker, orquestados mediante Docker Compose para garantizar portabilidad y consistencia entre entornos.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/30",
    features: ["Multi-stage builds", "Health checks", "Volume persistence"]
  },
  {
    icon: GitBranch,
    title: "CI/CD Pipeline",
    subtitle: "Jenkins",
    description: "Pipeline de integración y despliegue continuo totalmente automatizado con Jenkins. Cada push desencadena build, test y deploy automático.",
    color: "from-red-500 to-rose-600",
    bgColor: "from-red-500/10 to-rose-500/10",
    borderColor: "border-red-500/30",
    features: ["Pipelines declarativos", "Deploy automático", "Rollback instantáneo"]
  },
  {
    icon: Activity,
    title: "Observabilidad",
    subtitle: "New Relic",
    description: "Monitorización completa con New Relic: métricas de infraestructura, APM para la aplicación, logs centralizados y alertas en tiempo real.",
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/30",
    features: ["Métricas en tiempo real", "Distributed tracing", "Alertas inteligentes"]
  },
  {
    icon: Shield,
    title: "Seguridad Cloud",
    subtitle: "AWS Security",
    description: "Implementación de mejores prácticas de seguridad: IAM roles, VPC privada, Security Groups restrictivos y secrets management.",
    color: "from-cyan-500 to-teal-600",
    bgColor: "from-cyan-500/10 to-teal-500/10",
    borderColor: "border-cyan-500/30",
    features: ["Least privilege", "Network isolation", "Encryption at rest"]
  },
  {
    icon: Smartphone,
    title: "Operación Simplificada",
    subtitle: "Power Apps",
    description: "Capa final de operación para tareas sencillas sobre EC2 y contenedores, con acciones controladas y monitorización ligera.",
    color: "from-indigo-500 to-blue-600",
    bgColor: "from-indigo-500/10 to-blue-500/10",
    borderColor: "border-indigo-500/30",
    features: ["Start/Stop EC2", "Restart contenedores", "Vista ligera de estado"]
  }
];

const pipelineSteps = [
  { step: 1, name: "Code Push", icon: GitBranch, description: "Commit a main/feature branch" },
  { step: 2, name: "Build", icon: Container, description: "Docker build & push to ECR" },
  { step: 3, name: "Test", icon: Zap, description: "Lint, unit tests, security scan" },
  { step: 4, name: "Deploy", icon: Cloud, description: "Deploy a EC2 via SSH" },
  { step: 5, name: "Monitor", icon: Activity, description: "Métricas en New Relic" },
  { step: 6, name: "Operate", icon: Smartphone, description: "Power Apps: acciones simples + vista ligera" },
];

export default function CloudArchitectureSection() {
  return (
    <section id="cloud-architecture" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1220] to-[#0a0a0f]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Stack Tecnológico</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Arquitectura <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Cloud-Native</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Infraestructura moderna basada en las mejores prácticas de DevOps y Cloud Engineering
          </p>
        </motion.div>

        {/* CI/CD Pipeline Visualization */}
        <motion.div
          className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">
            Pipeline CI/CD <span className="text-emerald-400">Automatizado</span>
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-2">
            {pipelineSteps.map((step, index) => (
              <React.Fragment key={step.step}>
                <motion.div
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700 hover:border-cyan-500/50 transition-colors min-w-[140px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 mb-1">Paso {step.step}</span>
                  <span className="text-white font-semibold text-sm">{step.name}</span>
                  <span className="text-gray-400 text-xs text-center mt-1">{step.description}</span>
                </motion.div>
                
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex items-center text-gray-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Cloud Stack Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cloudStack.map((item, index) => (
            <motion.div
              key={item.title}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${item.bgColor} border ${item.borderColor} hover:border-opacity-60 transition-all duration-500 overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                    <span className={`text-sm font-medium bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gray-700/50 rounded-tr-2xl opacity-50" />
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram Summary */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Workflow className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Arquitectura Inmutable</h3>
              <p className="text-gray-400 leading-relaxed">
                Cada despliegue crea infraestructura nueva desde cero, garantizando consistencia total. 
                No hay "configuration drift" ni sorpresas en producción. La infraestructura se versiona 
                igual que el código: <span className="text-cyan-400 font-medium">reproducible, auditable y reversible</span>.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-medium">Production Ready</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
