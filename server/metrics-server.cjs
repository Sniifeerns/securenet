
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.METRICS_PORT || 3001;
const NEW_RELIC_API_KEY = process.env.NEW_RELIC_API_KEY || "";
const NEW_RELIC_ACCOUNT_ID = Number(process.env.NEW_RELIC_ACCOUNT_ID || 0);
const NEW_RELIC_REGION = (process.env.NEW_RELIC_REGION || "us").toLowerCase();
const METRICS_LOOKBACK_MINUTES = Number(process.env.METRICS_LOOKBACK_MINUTES || 5);
const NEW_RELIC_QUERY_TIMEOUT_MS = Number(process.env.NEW_RELIC_QUERY_TIMEOUT_MS || 8000);

const NEW_RELIC_ENDPOINTS = process.env.NEW_RELIC_API_URL
  ? [process.env.NEW_RELIC_API_URL]
  : NEW_RELIC_REGION === "eu"
    ? ["https://api.eu.newrelic.com/graphql", "https://api.newrelic.com/graphql"]
    : ["https://api.newrelic.com/graphql", "https://api.eu.newrelic.com/graphql"];

// Función helper para hacer queries a New Relic
async function queryNewRelic(nrql) {
  if (!NEW_RELIC_API_KEY || !NEW_RELIC_ACCOUNT_ID) {
    throw new Error("Missing NEW_RELIC_API_KEY or NEW_RELIC_ACCOUNT_ID");
  }

  const payload = {
    query: `
      query GetNrql($accountId: Int!, $nrql: Nrql!) {
        actor {
          account(id: $accountId) {
            nrql(query: $nrql) {
              results
            }
          }
        }
      }
    `,
    variables: {
      accountId: NEW_RELIC_ACCOUNT_ID,
      nrql,
    },
  };

  let lastError = null;
  for (const url of NEW_RELIC_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NEW_RELIC_QUERY_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": NEW_RELIC_API_KEY,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`New Relic API error ${response.status} at ${url}`);
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(`New Relic query error at ${url}: ${JSON.stringify(data.errors)}`);
      }

      return data?.data?.actor?.account?.nrql?.results || [];
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Unknown New Relic error");
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "metrics-server" });
});

app.get("/api/metrics", async (_req, res) => {
  try {
    const sinceClause = `SINCE ${METRICS_LOOKBACK_MINUTES} minutes ago`;

    // Métricas del HOST
    const hostCpuNrql = `SELECT average(cpuPercent) as cpu FROM SystemSample ${sinceClause}`;
    const hostMemoryNrql = `SELECT average(memoryUsedPercent) as memory FROM SystemSample ${sinceClause}`;
    const hostDiskNrql = `SELECT average(diskUsedPercent) as disk FROM StorageSample ${sinceClause}`;
    const hostNetworkNrql = `SELECT average(receiveBytesPerSecond) as netIn, average(transmitBytesPerSecond) as netOut FROM NetworkSample ${sinceClause}`;
    const hostLoadNrql = `SELECT average(loadAverageOneMinute) as load1, average(loadAverageFiveMinute) as load5 FROM SystemSample ${sinceClause}`;

    // Métricas de CONTENEDORES (solo CPU y memoria) - usando 'name' en lugar de 'containerName'
    const containersNrql = `SELECT average(cpuPercent) as cpu, average(memoryResidentSizeBytes)/1024/1024 as memoryMB FROM ContainerSample FACET name ${sinceClause} LIMIT 10`;

    const [hostCpu, hostMemory, hostDisk, hostNetwork, hostLoad, containers] = await Promise.all([
      queryNewRelic(hostCpuNrql),
      queryNewRelic(hostMemoryNrql),
      queryNewRelic(hostDiskNrql),
      queryNewRelic(hostNetworkNrql),
      queryNewRelic(hostLoadNrql),
      queryNewRelic(containersNrql)
    ]);

    // Procesar datos del host
    const host = {
      cpu: hostCpu[0]?.cpu == null ? null : hostCpu[0].cpu.toFixed(1),
      memory: hostMemory[0]?.memory == null ? null : hostMemory[0].memory.toFixed(1),
      disk: hostDisk[0]?.disk == null ? null : hostDisk[0].disk.toFixed(1),
      netInBps: hostNetwork[0]?.netIn || 0,
      netOutBps: hostNetwork[0]?.netOut || 0,
      load1: hostLoad[0]?.load1 == null ? null : hostLoad[0].load1.toFixed(2),
      load5: hostLoad[0]?.load5 == null ? null : hostLoad[0].load5.toFixed(2),
    };

    // Procesar datos de contenedores - el FACET 'name' aparece como 'name' en los resultados
    const containersList = containers.map(c => ({
      name: c.name || c.facet || "unknown",
      cpu: c.cpu == null ? null : c.cpu.toFixed(1),
      memory: c.memoryMB == null ? null : c.memoryMB.toFixed(0)
    })).filter(c => c.name !== "unknown");

    res.json({
      ok: true,
      host,
      containers: containersList,
      threats: 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error fetching New Relic metrics:", e.message);
    // Devolver warning explícito y métricas vacías (sin "falsos 0")
    res.json({
      ok: true,
      host: {
        cpu: null,
        memory: null,
        disk: null,
        netInBps: 0,
        netOutBps: 0,
        load1: null,
        load5: null,
      },
      containers: [],
      threats: 0,
      updatedAt: new Date().toISOString(),
      warning: e.message || "Error consultando New Relic"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`metrics-server escuchando en http://0.0.0.0:${PORT}`);
  console.log(`NEW_RELIC_ACCOUNT_ID=${NEW_RELIC_ACCOUNT_ID}`);
  console.log(`NEW_RELIC_API_KEY=${NEW_RELIC_API_KEY ? "configurado" : "NO CONFIGURADO"}`);
  console.log(`NEW_RELIC_REGION=${NEW_RELIC_REGION}`);
  console.log(`METRICS_LOOKBACK_MINUTES=${METRICS_LOOKBACK_MINUTES}`);
});
