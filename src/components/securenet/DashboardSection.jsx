import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  MemoryStick,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Server,
  Lock,
  Globe,
  Workflow,
  HardDrive,
  Gauge,
  Container,
  Network,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLiveMetrics, formatBps } from "@/hooks/useLiveMetrics";

// Helper para formatear valores que pueden venir como string o number
const formatValue = (val, suffix = "") => {
  if (val === null || val === undefined || val === "") return "--";
  const num = Number(val);
  if (isNaN(num)) return "--";
  return `${num}${suffix}`;
};

// Helper para obtener color basado en porcentaje
const getColorByPercent = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "text-slate-400";
  if (num >= 90) return "text-red-400";
  if (num >= 70) return "text-yellow-400";
  return "text-emerald-400";
};

// Helper para obtener color de barra de progreso
const getBarColor = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "bg-slate-600";
  if (num >= 90) return "bg-red-500";
  if (num >= 70) return "bg-yellow-500";
  return "bg-emerald-500";
};

export default function DashboardSection() {
  const { loading, error, data } = useLiveMetrics(4000);

  const host = data?.host ?? {};
  const containers = data?.containers ?? [];
  const threats = data?.threats ?? 0;
  const hasWarning = data?.warning;

  const services = [
    { name: "HTTPS/SSL", icon: Lock, up: true },
    { name: "Tailscale VPN", icon: Globe, up: true },
    { name: "n8n Automation", icon: Workflow, up: true },
    { name: "Firewall", icon: ShieldCheck, up: true },
    { name: "DHCP Failover", icon: Server, up: true },
    { name: "Reverse Proxy", icon: Activity, up: true },
  ];

  return (
    <section id="dashboard" className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b16] via-[#0a1120] to-[#070b16]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-white">Dashboard </span>
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Live
            </span>
          </h2>
          <p className="text-slate-300 mt-4 text-lg">
            Monitorización en tiempo real con New Relic
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error de métricas: {error}
          </div>
        )}

        {hasWarning && !error && (
          <div className="mb-6 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-yellow-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {data.warning}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 1: HOST PRINCIPAL - Métricas detalladas del servidor
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Server className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Host Principal</h3>
              <p className="text-slate-400 text-sm">securenet-host · Métricas del servidor</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">ONLINE</span>
            </div>
          </div>

          {/* Métricas principales del host */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            <HostMetricCard
              title="CPU"
              value={host.cpu}
              suffix="%"
              icon={Cpu}
              loading={loading}
              description="Uso del procesador"
            />
            <HostMetricCard
              title="Memoria RAM"
              value={host.memory}
              suffix="%"
              icon={MemoryStick}
              loading={loading}
              description="Memoria utilizada"
            />
            <HostMetricCard
              title="Disco"
              value={host.disk}
              suffix="%"
              icon={HardDrive}
              loading={loading}
              description="Almacenamiento usado"
            />
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <Network className="w-5 h-5 text-cyan-300" />
                <span className="text-emerald-300 text-xs font-medium px-2 py-0.5 bg-emerald-500/20 rounded-full">LIVE</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Network I/O</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">↓ IN</span>
                  <span className="text-white font-bold">{loading ? "--" : formatBps(host.netInBps)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">↑ OUT</span>
                  <span className="text-white font-bold">{loading ? "--" : formatBps(host.netOutBps)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas secundarias del host */}
          <div className="grid md:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-5 h-5 text-cyan-300" />
                <span className="text-slate-400 text-sm">Load Average</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-white">
                  {loading ? "--" : formatValue(host.load1)}
                </p>
                <p className="text-slate-500 text-sm">
                  / {loading ? "--" : formatValue(host.load5)}
                </p>
              </div>
              <p className="text-slate-500 text-xs mt-1">1 min / 5 min</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className={`w-5 h-5 ${threats > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
                <span className="text-slate-400 text-sm">Amenazas</span>
              </div>
              <p className={`text-3xl font-bold ${threats > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {loading ? "--" : threats}
              </p>
              <p className="text-slate-500 text-xs mt-1">Eventos críticos detectados</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <Container className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 text-sm">Contenedores</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? "--" : containers.length}
              </p>
              <p className="text-slate-500 text-xs mt-1">Contenedores activos</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 text-sm">Última actualización</span>
              </div>
              <p className="text-emerald-300 font-bold text-xl">
                {data?.updatedAt
                  ? new Date(data.updatedAt).toLocaleTimeString()
                  : "--:--:--"}
              </p>
              <p className="text-slate-500 text-xs mt-1">Actualización cada 4s</p>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 2: CONTENEDORES DOCKER - CPU y Memoria de cada uno
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Container className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Contenedores Docker</h3>
              <p className="text-slate-400 text-sm">Uso de recursos por contenedor</p>
            </div>
            <div className="ml-auto">
              <span className="text-slate-400 text-sm">
                {loading ? "..." : `${containers.length} contenedores`}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              // Skeleton loaders
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-slate-700 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-700 rounded w-full" />
                </div>
              ))
            ) : containers.length === 0 ? (
              <div className="col-span-full rounded-xl border border-slate-700/50 bg-slate-900/30 p-8 text-center">
                <Container className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No se detectaron contenedores</p>
                <p className="text-slate-500 text-sm mt-1">Los contenedores aparecerán aquí cuando New Relic los detecte</p>
              </div>
            ) : (
              containers.map((container, idx) => (
                <ContainerCard key={idx} container={container} />
              ))
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECCIÓN 3: VLANs y Servicios
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-4">Estado de VLANs</h3>
            <div className="space-y-3 text-slate-200">
              <Row label="VLAN 10 - Admin" sub="172.16.10.0/24" speed="ACTIVE" />
              <Row label="VLAN 20 - Users" sub="172.16.20.0/24" speed="ACTIVE" />
              <Row label="VLAN 30 - Servers" sub="172.16.30.0/24" speed="ACTIVE" />
              <Row label="DMZ" sub="172.16.40.0/24" speed="ACTIVE" />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-4">Estado de Servicios</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.name}
                    className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-300" />
                      <span className="text-slate-100">{s.name}</span>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        s.up ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Tarjeta de métrica del host con barra de progreso
function HostMetricCard({ title, value, suffix = "", icon: Icon, loading, description }) {
  const displayValue = loading ? "--" : formatValue(value, suffix);
  const numValue = Number(value);
  const barWidth = isNaN(numValue) ? 0 : Math.min(numValue, 100);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-cyan-300" />
        <span className="text-emerald-300 text-xs font-medium px-2 py-0.5 bg-emerald-500/20 rounded-full">LIVE</span>
      </div>
      <p className={`text-4xl font-extrabold ${loading ? 'text-slate-400' : getColorByPercent(value)}`}>
        {displayValue}
      </p>
      <p className="text-slate-400 mt-1 text-sm">{title}</p>
      
      {/* Barra de progreso */}
      <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getBarColor(value)}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="text-slate-500 text-xs mt-2">{description}</p>
    </div>
  );
}

// Tarjeta de contenedor mejorada
function ContainerCard({ container }) {
  const { name, cpu, memory } = container;
  const cpuNum = Number(cpu) || 0;
  const memNum = Number(memory) || 0;
  
  // Extraer nombre corto del contenedor (quitar prefijos como "securenet-")
  const shortName = name?.replace(/^securenet[-_]?/i, "").replace(/-1$/, "") || "unknown";
  
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-slate-900/50 p-4 backdrop-blur hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-md bg-emerald-500/20">
          <Container className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-white font-medium text-sm truncate flex-1" title={name}>
          {shortName}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </div>
      
      <div className="space-y-3">
        {/* CPU */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-slate-400 text-xs">CPU</span>
            </div>
            <span className={`font-semibold text-sm ${getColorByPercent(cpuNum)}`}>
              {formatValue(cpu, "%")}
            </span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getBarColor(cpuNum)}`}
              style={{ width: `${Math.min(cpuNum, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Memoria */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <MemoryStick className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-slate-400 text-xs">RAM</span>
            </div>
            <span className="text-white font-semibold text-sm">
              {formatValue(memory)} MB
            </span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(memNum / 5, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, sub, speed }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/35 px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-slate-400 text-sm">{sub}</p>
      </div>
      <span className="text-emerald-300 text-sm">{speed}</span>
    </div>
  );
}
