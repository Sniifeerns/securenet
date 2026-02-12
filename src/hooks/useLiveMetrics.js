import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_METRICS_API || "/api";

export function useLiveMetrics(intervalMs = 5000) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let timer;
    let alive = true;

    const load = async () => {
      try {
        const url = `${API_BASE}/metrics`;
        const r = await fetch(url, { cache: "no-store" });
        const text = await r.text();

        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
        }

        let j;
        try {
          j = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta no JSON en ${url}: ${text.slice(0, 80)}`);
        }

        if (!j.ok) {
          throw new Error(j.error || "Error de métricas");
        }

        if (!alive) return;
        setState({ loading: false, error: "", data: j });
      } catch (e) {
        if (!alive) return;
        setState({
          loading: false,
          error: e.message || "Error de métricas",
          data: null,
        });
      }
    };

    load();
    timer = setInterval(load, intervalMs);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return state;
}

export function formatBps(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  const abs = Math.abs(n);

  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} GB/s`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} MB/s`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(2)} KB/s`;
  return `${n.toFixed(0)} B/s`;
}
