"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

export function EnergyView() {
  const series = useCityStore((s) => s.energySeries);
  const renewablePct = useCityStore((s) => s.renewablePct);
  const gridLoad = useCityStore((s) => s.gridLoad);
  const productionMw = useCityStore((s) => s.productionMw);
  const consumptionMw = useCityStore((s) => s.consumptionMw);
  const blackoutRisk = useCityStore((s) => s.blackoutRisk);
  const plants = useCityStore((s) => s.plants);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Panel title="Production vs Consumption" subtitle="Dynamic grid coupling (simulated)" className="xl:col-span-8">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="t" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} />
              <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(7,11,20,0.92)",
                  border: "1px solid rgba(52,211,153,0.18)",
                  borderRadius: 12,
                  color: "#e2e8f0",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="production" stroke="#22d3ee" fill="url(#prod)" strokeWidth={2} />
              <Area type="monotone" dataKey="consumption" stroke="#34d399" fill="url(#cons)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="space-y-6 xl:col-span-4">
        <Panel title="Renewable Mix" subtitle="Target-aware portfolio">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-5xl font-semibold tabular-nums text-cyan-100">{renewablePct}%</div>
              <div className="mt-2 text-sm text-slate-400">Synthetic share of city load served by clean sources.</div>
            </div>
            <div className="h-24 w-24 rounded-full border border-emerald-400/25 bg-emerald-500/10 shadow-[0_0_40px_rgba(52,211,153,0.18)]" />
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              initial={false}
              animate={{ width: `${renewablePct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
        </Panel>

        <Panel title="Blackout Risk" subtitle="Critical system meter">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">Headroom collapse probability (mock)</div>
            <div className={cn("font-mono text-sm", blackoutRisk > 32 ? "text-rose-200" : "text-emerald-200")}>
              {blackoutRisk}%
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
            <motion.div
              className={cn(
                "h-full rounded-full",
                blackoutRisk > 32 ? "bg-gradient-to-r from-rose-400 to-amber-300" : "bg-gradient-to-r from-emerald-400 to-cyan-400",
              )}
              animate={{ width: `${blackoutRisk}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
              <div className="font-mono text-[10px] uppercase text-slate-500">Production</div>
              <div className="mt-1 font-mono text-sm text-cyan-100">{productionMw} MW</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
              <div className="font-mono text-[10px] uppercase text-slate-500">Consumption</div>
              <div className="mt-1 font-mono text-sm text-emerald-100">{consumptionMw} MW</div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Energy Flow" subtitle="Directional transport (visual simulation)" className="xl:col-span-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-cyan-500/15 bg-black/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(52,211,153,0.16),transparent_45%)]" />
          <svg viewBox="0 0 1000 420" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(34,211,238,0)" />
                <stop offset="45%" stopColor="rgba(34,211,238,0.85)" />
                <stop offset="100%" stopColor="rgba(52,211,153,0)" />
              </linearGradient>
            </defs>
            {[
              ["M40,210 C220,120 420,300 520,210 S820,120 960,210", 0],
              ["M40,260 C240,360 520,120 700,260 S880,360 960,260", 0.35],
              ["M40,150 C260,40 520,260 700,150 S900,40 960,150", 0.7],
            ].map(([d, delay], idx) => (
              <motion.path
                key={idx}
                d={d as string}
                fill="none"
                stroke="url(#flow)"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ opacity: 0.25 }}
                animate={{ opacity: [0.25, 0.85, 0.25], strokeWidth: [9, 12, 9] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: delay as number }}
              />
            ))}
          </svg>
          <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-300 backdrop-blur">
            Grid load coupling: <span className="font-mono text-cyan-100">{gridLoad}%</span>
          </div>
        </div>
      </Panel>

      <Panel title="Power Plants" subtitle="Fleet posture" className="xl:col-span-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {plants.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                  <div className="mt-1 font-mono text-xs text-slate-500">{p.outputMw} MW</div>
                </div>
                <div
                  className={cn(
                    "rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-widest",
                    p.status === "online" && "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
                    p.status === "degraded" && "border border-amber-500/25 bg-amber-500/10 text-amber-200",
                    p.status === "maintenance" && "border border-slate-500/25 bg-slate-500/10 text-slate-200",
                  )}
                >
                  {p.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
