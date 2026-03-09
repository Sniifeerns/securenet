import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  MemoryStick,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  Server,
  Lock,
  Globe,
  Workflow,
} from "lucide-react";
import { useLiveMetrics, formatBps } from "@/hooks/useLiveMetrics";

export default function DashboardSection() {
  const { loading, error, data } = useLiveMetrics(4000);

  const cpu = data?.cpu ?? null;
  const ram = data?.ram ?? null;
  const netIn = data?.netInBps ?? null;
  const netOut = data?.netOutBps ?? null;
  const threats = data?.threats ?? 0;

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
            Monitorización en tiempo real con Netdata
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
            Error de métricas: {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <KpiCard
            title="CPU Usage"
            value={loading ? "--" : `${cpu}%`}
            subtitle="Uso total CPU"
            icon={Cpu}
          />
          <KpiCard
            title="Memory"
            value={loading ? "--" : `${ram}%`}
            subtitle="RAM utilizada"
            icon={MemoryStick}
          />
          <KpiCard
            title="Network I/O"
            value={loading ? "--" : formatBps(netIn)}
            subtitle={loading ? "Entrada / salida" : `OUT ${formatBps(netOut)}`}
            icon={Activity}
          />
          <KpiCard
            title="Threats Detected"
            value={loading ? "--" : `${threats}`}
            subtitle="Eventos críticos"
            icon={ShieldAlert}
          />
        </div>

        {/* Estado VLAN + Servicios */}
        <div className="grid lg:grid-cols-2 gap-6">
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

            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-slate-300 text-sm">Última actualización</p>
              <p className="text-emerald-300 font-semibold">
                {data?.updatedAt
                  ? new Date(data.updatedAt).toLocaleTimeString()
                  : "--:--:--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-5 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-5 h-5 text-cyan-300" />
        <span className="text-emerald-300 text-sm">LIVE</span>
      </div>
      <p className="text-4xl font-extrabold text-white">{value}</p>
      <p className="text-slate-400 mt-1">{title}</p>
      <p className="text-slate-500 text-sm">{subtitle}</p>
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
