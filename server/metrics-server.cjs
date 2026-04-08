
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.METRICS_PORT || 3001;
const NEW_RELIC_API_KEY = process.env.NEW_RELIC_API_KEY || "";
const NEW_RELIC_ACCOUNT_ID = process.env.NEW_RELIC_ACCOUNT_ID || "";

// Función helper para hacer queries a New Relic
async function queryNewRelic(nrql) {
  if (!NEW_RELIC_API_KEY || !NEW_RELIC_ACCOUNT_ID) {
    throw new Error("Missing NEW_RELIC_API_KEY or NEW_RELIC_ACCOUNT_ID");
  }

  const url = `https://api.eu.newrelic.com/graphql`;
  const query = {
    query: `{
      actor {
        account(id: ${NEW_RELIC_ACCOUNT_ID}) {
          nrql(query: "${nrql}") {
            results
          }
        }
      }
    }`
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": NEW_RELIC_API_KEY
    },
    body: JSON.stringify(query)
  });

  if (!response.ok) {
    throw new Error(`New Relic API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`New Relic query error: ${JSON.stringify(data.errors)}`);
  }
  
  return data?.data?.actor?.account?.nrql?.results || [];
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "metrics-server" });
});

app.get("/api/metrics", async (_req, res) => {
  try {
    // Métricas del HOST
    const hostCpuNrql = "SELECT average(cpuPercent) as cpu FROM SystemSample SINCE 1 minute ago";
    const hostMemoryNrql = "SELECT average(memoryUsedPercent) as memory FROM SystemSample SINCE 1 minute ago";
    const hostDiskNrql = "SELECT average(diskUsedPercent) as disk FROM StorageSample SINCE 1 minute ago";
    const hostNetworkNrql = "SELECT average(receiveBytesPerSecond) as netIn, average(transmitBytesPerSecond) as netOut FROM NetworkSample SINCE 1 minute ago";
    const hostLoadNrql = "SELECT average(loadAverageOneMinute) as load1, average(loadAverageFiveMinute) as load5 FROM SystemSample SINCE 1 minute ago";

    // Métricas de CONTENEDORES (solo CPU y memoria) - usando 'name' en lugar de 'containerName'
    const containersNrql = "SELECT average(cpuPercent) as cpu, average(memoryResidentSizeBytes)/1024/1024 as memoryMB FROM ContainerSample FACET name SINCE 1 minute ago LIMIT 10";

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
      cpu: hostCpu[0]?.cpu?.toFixed(1) || "0.0",
      memory: hostMemory[0]?.memory?.toFixed(1) || "0.0",
      disk: hostDisk[0]?.disk?.toFixed(1) || "0.0",
      netInBps: hostNetwork[0]?.netIn || 0,
      netOutBps: hostNetwork[0]?.netOut || 0,
      load1: hostLoad[0]?.load1?.toFixed(2) || "0.00",
      load5: hostLoad[0]?.load5?.toFixed(2) || "0.00",
    };

    // Procesar datos de contenedores - el FACET 'name' aparece como 'name' en los resultados
    const containersList = containers.map(c => ({
      name: c.name || c.facet || "unknown",
      cpu: c.cpu?.toFixed(1) || "0.0",
      memory: c.memoryMB?.toFixed(0) || "0"
    }));

    res.json({
      ok: true,
      host,
      containers: containersList,
      threats: 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error fetching New Relic metrics:", e.message);
    // Devolver datos vacíos con warning en lugar de error
    res.json({
      ok: true,
      host: {
        cpu: "0.0",
        memory: "0.0",
        disk: "0.0",
        netInBps: 0,
        netOutBps: 0,
        load1: "0.00",
        load5: "0.00",
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
});
