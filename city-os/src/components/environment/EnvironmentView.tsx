"use client";

import { motion } from "framer-motion";
import { CloudLightning, Droplets, Wind } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

function aqiStatus(aqi: number) {
  if (aqi <= 50) return { label: "Good", cls: "text-emerald-200" };
  if (aqi <= 100) return { label: "Moderate", cls: "text-amber-200" };
  return { label: "Hazardous", cls: "text-rose-200" };
}

export function EnvironmentView() {
  const aqi = useCityStore((s) => s.aqi);
  const weather = useCityStore((s) => s.weather);
  const zones = useCityStore((s) => s.zones);
  const series = useCityStore((s) => s.envSeries);
  const status = aqiStatus(aqi);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Panel title="Air Quality Index" subtitle="City-wide atmospheric risk" className="xl:col-span-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={cn("font-mono text-6xl font-semibold tabular-nums", status.cls)}>{aqi}</div>
            <div className="mt-2 inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-300">
              {status.label}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              AQI synthesizes particulate sensors, ionospheric scatter, and industrial plume models into a single operator
              index.
            </p>
          </div>
          <motion.div
            className="h-20 w-20 rounded-2xl border border-cyan-500/20 bg-cyan-500/10"
            animate={{ boxShadow: ["0 0 0px rgba(34,211,238,0)", "0 0 40px rgba(34,211,238,0.25)", "0 0 0px rgba(34,211,238,0)"] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
        </div>
      </Panel>

      <Panel title="Pollution Heatfield" subtitle="District-weighted overlay (mock)" className="xl:col-span-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div
            className="absolute inset-0 opacity-70 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at 25% 35%, rgba(251,113,133,${0.12 + zones[0]!.pollution / 500}), transparent 40%),
                radial-gradient(circle at 70% 30%, rgba(168,85,247,${0.12 + zones[2]!.pollution / 450}), transparent 42%),
                radial-gradient(circle at 55% 70%, rgba(34,211,238,${0.08 + zones[4]!.pollution / 600}), transparent 46%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="absolute left-4 top-4 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-xs text-slate-200 backdrop-blur">
            Heatmap layers recomputed on <span className="font-mono text-cyan-200">4.2s</span> cadence.
          </div>
        </div>
      </Panel>

      <Panel title="Weather" subtitle="Animated civic microclimate" className="xl:col-span-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Condition</div>
              <div className="mt-2 text-lg font-semibold text-white">{weather.condition}</div>
            </div>
            <motion.div animate={{ rotate: [0, 6, -6, 0], y: [0, -2, 0] }} transition={{ duration: 4.2, repeat: Infinity }}>
              <CloudLightning className="h-10 w-10 text-cyan-200" />
            </motion.div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Wind className="h-4 w-4 text-cyan-300" />
                Wind
              </div>
              <div className="mt-1 font-mono text-sm text-white">{weather.windKph} km/h</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
              <div className="text-xs text-slate-400">Temp</div>
              <div className="mt-1 font-mono text-sm text-white">{weather.tempC}°C</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Droplets className="h-4 w-4 text-fuchsia-300" />
                RH
              </div>
              <div className="mt-1 font-mono text-sm text-white">{weather.humidity}%</div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Climate Alerts" subtitle="Policy-relevant anomalies" className="xl:col-span-4">
        <div className="space-y-2">
          {[
            { t: "Inversion cap", d: "Stable layer forming over Harbor Arcology — venting advised.", s: "warning" },
            { t: "UV spike", d: "Transient solar scatter — citizen advisory broadcast queued.", s: "normal" },
            { t: "Particulate burst", d: "Industrial Veil scrubbers at 92% duty — watch AQI slope.", s: "critical" },
          ].map((a) => (
            <div
              key={a.t}
              className={cn(
                "rounded-xl border px-3 py-2",
                a.s === "critical" && "border-rose-500/35 bg-rose-500/10",
                a.s === "warning" && "border-amber-400/25 bg-amber-400/10",
                a.s === "normal" && "border-emerald-500/20 bg-emerald-500/10",
              )}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-200">{a.t}</div>
              <div className="mt-1 text-xs text-slate-200/90">{a.d}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Environmental Trend" subtitle="AQI window" className="xl:col-span-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="t" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} />
              <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(7,11,20,0.92)",
                  border: "1px solid rgba(168,85,247,0.18)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
