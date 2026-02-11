import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Network, Globe, Lock, Server, Wifi, 
  CheckCircle2, Activity, Cpu, HardDrive, 
  ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';

const statusItems = [
  { 
    label: "VLAN 10 - Admin", 
    status: "active", 
    icon: Shield, 
    subnet: "172.16.10.0/24",
    traffic: "2.4 GB/s",
    trend: "up"
  },
  { 
    label: "VLAN 20 - Users", 
    status: "active", 
    icon: Wifi, 
    subnet: "172.16.20.0/24",
    traffic: "5.1 GB/s",
    trend: "up"
  },
  { 
    label: "VLAN 30 - Servers", 
    status: "active", 
    icon: Server, 
    subnet: "172.16.30.0/24",
    traffic: "8.7 GB/s",
    trend: "up"
  },
  { 
    label: "DMZ", 
    status: "active", 
    icon: Globe, 
    subnet: "172.16.40.0/24",
    traffic: "12.3 GB/s",
    trend: "up"
  },
];

const systemStatus = [
  { label: "HTTPS/SSL", status: "active", icon: Lock },
  { label: "Tailscale VPN", status: "connected", icon: Network },
  { label: "n8n Automation", status: "running", icon: Zap },
  { label: "Firewall", status: "active", icon: Shield },
  { label: "DHCP Failover", status: "synced", icon: Server },
  { label: "Reverse Proxy", status: "active", icon: Globe },
];

function AnimatedMetric({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}{suffix}
    </motion.span>
  );
}

export default function DashboardSection() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="dashboard" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#050810] to-[#0a0a0f]" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Panel de Control</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Dashboard <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Demo</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simulación del panel SOC para monitoreo en tiempo real de la infraestructura
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          className="rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-900/50 border border-gray-800 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm font-mono">SecureNet Lab - SOC Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <span className="text-cyan-400 font-mono text-sm">
                {time.toLocaleTimeString('es-ES', { hour12: false })}
              </span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="text-green-400 text-xs flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> 12%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white"><AnimatedMetric value={24} suffix="%" /></p>
                <p className="text-gray-500 text-xs">CPU Usage</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                  <span className="text-green-400 text-xs flex items-center">
                    <ArrowDownRight className="w-3 h-3" /> 3%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white"><AnimatedMetric value={67} suffix="%" /></p>
                <p className="text-gray-500 text-xs">Memory</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-xs flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> 8%
                  </span>
                </div>
                <p className="text-2xl font-bold text-white"><AnimatedMetric value={28.5} suffix=" GB/s" /></p>
                <p className="text-gray-500 text-xs">Network I/O</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-white"><AnimatedMetric value={0} /></p>
                <p className="text-gray-500 text-xs">Threats Detected</p>
              </div>
            </div>

            {/* VLAN Status */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  Estado de VLANs
                </h3>
                <div className="space-y-3">
                  {statusItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <p className="text-gray-500 text-xs">{item.subnet}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-cyan-400 text-xs font-mono">{item.traffic}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400 text-xs uppercase">Active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Estado de Servicios
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {systemStatus.map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{item.label}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </motion.div>
                  ))}
                </div>

                {/* Security Score */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Security Score</p>
                      <p className="text-3xl font-bold text-green-400">98/100</p>
                    </div>
                    <Shield className="w-12 h-12 text-green-400/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Registro de Actividad</h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { time: "14:32:15", msg: "[FIREWALL] Connection accepted from 10.10.0.1 to DMZ", type: "info" },
                  { time: "14:32:10", msg: "[n8n] Workflow 'backup-daily' executed successfully", type: "success" },
                  { time: "14:31:58", msg: "[DHCP] Lease renewed for 172.16.20.45", type: "info" },
                  { time: "14:31:42", msg: "[SSL] Certificate renewal check: 45 days remaining", type: "warning" },
                  { time: "14:31:30", msg: "[TAILSCALE] Node 'admin-laptop' connected", type: "success" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 text-gray-400">
                    <span className="text-cyan-500">{log.time}</span>
                    <span className={
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-yellow-400' : 'text-gray-400'
                    }>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}