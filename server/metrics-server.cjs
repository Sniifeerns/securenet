
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.METRICS_PORT || 3001;
const NETDATA_URL = process.env.NETDATA_URL || "http://0.0.0.0:19999";

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${url}`);
  return r.json();
}

async function tryFetchJSON(url) {
  try {
    return await fetchJSON(url);
  } catch (_e) {
    return null;
  }
}

function normalizeSeries(json) {
  const labelsRaw = (json?.labels ?? []).map((x) => String(x).toLowerCase().trim());
  const rowRaw = json?.data?.[0] ?? [];

  const hasTime = labelsRaw[0] === "time";
  const labels = hasTime ? labelsRaw.slice(1) : labelsRaw;
  const row = hasTime ? rowRaw.slice(1) : rowRaw;

  return { labels, row };
}

function pickByNames(labels, row, names) {
  for (const n of names) {
    const idx = labels.findIndex((x) => x.includes(n));
    if (idx >= 0) return Number(row[idx] ?? 0);
  }
  return null;
}

async function fetchNetSeries() {
  const candidates = [
    "system.net",
    "system.ipv4",
    "net.eth0",
    "net.enp0s3",
    "net.ens18",
    "net.enp0s8",
  ];

  for (const chart of candidates) {
    const url = `${NETDATA_URL}/api/v1/data?chart=${chart}&format=json&points=1&after=-1`;
    const data = await tryFetchJSON(url);
    if (data?.data?.length) return normalizeSeries(data);
  }

  const chartsJson = await tryFetchJSON(`${NETDATA_URL}/api/v1/charts`);
  const chartNames = Object.keys(chartsJson?.charts ?? {});
  const ifaceChart = chartNames.find((name) => /^net\./.test(name));

  if (ifaceChart) {
    const url = `${NETDATA_URL}/api/v1/data?chart=${ifaceChart}&format=json&points=1&after=-1`;
    const data = await tryFetchJSON(url);
    if (data?.data?.length) return normalizeSeries(data);
  }

  return null;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "metrics-server" });
});

app.get("/api/metrics", async (_req, res) => {
  try {
    // =========================
    // CPU (tu Netdata no trae idle)
    // =========================
    const cpuUrl = `${NETDATA_URL}/api/v1/data?chart=system.cpu&format=json&points=1&after=-1&options=percentage`;
    const cpuJson = await fetchJSON(cpuUrl);
    const cpuSeries = normalizeSeries(cpuJson);

    const busyNames = [
      "user",
      "system",
      "nice",
      "iowait",
      "irq",
      "softirq",
      "steal",
      "guest",
      "guest_nice",
    ];

    let cpu = busyNames.reduce((acc, name) => {
      const idx = cpuSeries.labels.indexOf(name);
      if (idx >= 0) acc += Math.abs(Number(cpuSeries.row[idx] ?? 0));
      return acc;
    }, 0);

    cpu = Math.max(0, Math.min(100, cpu));

    // =========================
    // RAM
    // =========================
    const ramUrl = `${NETDATA_URL}/api/v1/data?chart=system.ram&format=json&points=1&after=-1`;
    const ramJson = await fetchJSON(ramUrl);
    const ramSeries = normalizeSeries(ramJson);

    let used = pickByNames(ramSeries.labels, ramSeries.row, ["used"]);
    let free = pickByNames(ramSeries.labels, ramSeries.row, ["free"]);

    // fallback si etiquetas distintas
    if (used === null) used = Number(ramSeries.row[0] ?? 0);
    if (free === null) free = Number(ramSeries.row[1] ?? 0);

    used = Math.abs(used);
    free = Math.abs(free);

    const ram = used + free > 0 ? (used / (used + free)) * 100 : 0;

    // =========================
    // NET
    // =========================
    let netInBps = 0;
    let netOutBps = 0;
    const netSeries = await fetchNetSeries();

    if (netSeries) {
      netInBps = pickByNames(netSeries.labels, netSeries.row, ["received", "recv", "in", "rx"]);
      netOutBps = pickByNames(netSeries.labels, netSeries.row, ["sent", "out", "tx"]);

      if (netInBps === null) netInBps = Number(netSeries.row[0] ?? 0);
      if (netOutBps === null) netOutBps = Number(netSeries.row[1] ?? 0);

      netInBps = Math.abs(netInBps);
      netOutBps = Math.abs(netOutBps);
    }

    res.json({
      ok: true,
      cpu: Number(cpu.toFixed(1)),
      ram: Number(ram.toFixed(1)),
      netInBps: Number(netInBps.toFixed(6)),
      netOutBps: Number(netOutBps.toFixed(6)),
      threats: 0,
      netDataAvailable: Boolean(netSeries),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    res.status(502).json({
      ok: false,
      error: e.message || "No se pudo consultar Netdata",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`metrics-server escuchando en http://0.0.0.0:${PORT}`);
  console.log(`NETDATA_URL=${NETDATA_URL}`);
});
