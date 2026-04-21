"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Shield, Siren } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

const incidents = [
  { id: "i1", label: "Accident", zone: "C", sev: "high", x: 58, y: 44 },
  { id: "i2", label: "Delay", zone: "A", sev: "med", x: 22, y: 62 },
  { id: "i3", label: "Closure", zone: "D", sev: "crit", x: 78, y: 70 },
];

function congestionLabel(v: number) {
  if (v >= 85) return "critical";
  if (v >= 68) return "high";
  if (v >= 45) return "medium";
  return "low";
}

export function TrafficView() {
  const series = useCityStore((s) => s.trafficSeries);
  const aiOptimization = useCityStore((s) => s.aiOptimization);
  const emergencyRouting = useCityStore((s) => s.emergencyRouting);
  const setAiOptimization = useCityStore((s) => s.setAiOptimization);
  const setEmergencyRouting = useCityStore((s) => s.setEmergencyRouting);
  const intensity = series[series.length - 1]?.intensity ?? 50;

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Panel title="Traffic Heatfield" subtitle="Road glow · congestion coupling · incident beacons" className="xl:col-span-7">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(251,113,133,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(251,113,133,0.08) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="roadGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[
              { d: "M5,55 C25,52 35,48 55,55 S85,62 95,58", w: 3.2, a: 0.55 },
              { d: "M10,25 L90,30", w: 2.4, a: 0.35 },
              { d: "M18,78 C40,70 60,82 92,72", w: 2.8, a: 0.45 },
              { d: "M30,10 C45,35 55,65 70,92", w: 2.2, a: 0.4 },
              { d: "M8,40 L92,44", w: 2.0, a: 0.3 },
            ].map((road, idx) => {
              const heat = Math.min(1, Math.max(0, (intensity / 100) * (0.75 + idx * 0.07)));
              const stroke = `rgba(${34 + heat * 200},${211 - heat * 140},${238 - heat * 120},${0.25 + heat * 0.65})`;
              const isCrit = heat > 0.72;
              return (
                <motion.path
                  key={idx}
                  d={road.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={road.w + heat * 2.2}
                  strokeLinecap="round"
                  filter="url(#roadGlow)"
                  animate={
                    isCrit
                      ? {
                          strokeOpacity: [0.55, 1, 0.55],
                          strokeWidth: [road.w + heat * 2, road.w + heat * 2.8, road.w + heat * 2],
                        }
                      : { strokeOpacity: [0.35, 0.75, 0.35] }
                  }
                  transition={{ duration: isCrit ? 1.1 : 2.4, repeat: Infinity }}
                />
              );
            })}

            {incidents.map((inc) => (
              <g key={inc.id} transform={`translate(${inc.x},${inc.y})`}>
                <motion.circle
                  r={3.2}
                  fill={inc.sev === "crit" ? "#fb7185" : inc.sev === "high" ? "#fbbf24" : "#a78bfa"}
                  animate={{ opacity: [0.35, 1, 0.35], r: [2.8, 3.6, 2.8] }}
                  transition={{ duration: inc.sev === "crit" ? 0.9 : 1.6, repeat: Infinity }}
                />
                <circle r={6} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
              </g>
            ))}
          </svg>

          <div className="absolute left-4 top-4 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Congestion</div>
            <div className="mt-1 flex items-center gap-2">
              <div className={cn("text-sm font-semibold", intensity > 80 ? "text-rose-200" : "text-cyan-100")}>
                {congestionLabel(intensity).toUpperCase()}
              </div>
              <div className="font-mono text-xs text-white/50">{intensity}%</div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="space-y-6 xl:col-span-5">
        <Panel title="Controls" subtitle="Policy toggles (simulated)">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-slate-300">AI Traffic Optimization</div>
                </div>
                <div className="mt-1 text-xs text-slate-500">Re-routes demand pulses across arterial graph.</div>
              </div>
              <button
                type="button"
                onClick={() => setAiOptimization(!aiOptimization)}
                className={cn(
                  "relative h-9 w-16 shrink-0 rounded-full border transition-colors",
                  aiOptimization ? "border-cyan-400/40 bg-cyan-500/15" : "border-white/10 bg-black/30",
                )}
                aria-pressed={aiOptimization}
              >
                <motion.span
                  layout
                  className="absolute top-1 h-7 w-7 rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-400 shadow-lg"
                  animate={{ left: aiOptimization ? "calc(100% - 30px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Siren className="h-4 w-4 text-rose-300" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-slate-300">Emergency Priority Routing</div>
                </div>
                <div className="mt-1 text-xs text-slate-500">Reserves corridor bandwidth for response vectors.</div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyRouting(!emergencyRouting)}
                className={cn(
                  "relative h-9 w-16 shrink-0 rounded-full border transition-colors",
                  emergencyRouting ? "border-rose-400/40 bg-rose-500/15" : "border-white/10 bg-black/30",
                )}
                aria-pressed={emergencyRouting}
              >
                <motion.span
                  layout
                  className="absolute top-1 h-7 w-7 rounded-full bg-gradient-to-br from-rose-300 to-amber-300 shadow-lg"
                  animate={{ left: emergencyRouting ? "calc(100% - 30px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Incidents" subtitle="Synthetic markers">
          <div className="space-y-2">
            {incidents.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/25 px-3 py-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                  <div>
                    <div className="text-sm text-white">{i.label}</div>
                    <div className="text-xs text-slate-500">Zone {i.zone}</div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase text-slate-400">{i.sev}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Traffic Intensity" subtitle="Rolling window (simulated)" className="xl:col-span-12">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="t" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} />
              <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(7,11,20,0.92)",
                  border: "1px solid rgba(34,211,238,0.18)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="intensity" fill="url(#tiGrad)" radius={[10, 10, 0, 0]} />
              <defs>
                <linearGradient id="tiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
