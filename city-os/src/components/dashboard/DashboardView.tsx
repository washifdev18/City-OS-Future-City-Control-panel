"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, Radar, Scan, Zap } from "lucide-react";
import { Panel, MetricPill } from "@/components/ui/Panel";
import { RadialHealth } from "@/components/ui/RadialHealth";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

function Trend({ t }: { t: "up" | "down" | "steady" }) {
  if (t === "up") return <ArrowUpRight className="h-4 w-4 text-rose-300" />;
  if (t === "down") return <ArrowDownRight className="h-4 w-4 text-emerald-300" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

function alertBorder(sev: "normal" | "warning" | "critical") {
  if (sev === "critical") return "border-rose-500/40";
  if (sev === "warning") return "border-amber-400/30";
  return "border-emerald-500/25";
}

export function DashboardView() {
  const cityHealth = useCityStore((s) => s.cityHealth);
  const systemCards = useCityStore((s) => s.systemCards);
  const populationActivity = useCityStore((s) => s.populationActivity);
  const energyConsumptionPct = useCityStore((s) => s.energyConsumptionPct);
  const pollutionIndex = useCityStore((s) => s.pollutionIndex);
  const systemUptime = useCityStore((s) => s.systemUptime);
  const alerts = useCityStore((s) => s.alerts);
  const setModule = useCityStore((s) => s.setModule);
  const pushLiveUpdate = useCityStore((s) => s.pushLiveUpdate);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <Panel title="City Health Core" subtitle="Composite resilience index" className="lg:col-span-5">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <RadialHealth score={cityHealth} size={176} />
            <div className="w-full max-w-md space-y-3">
              <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Interpretation</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  City OS fuses mobility throughput, grid stability, atmospheric risk, and emergency posture into a
                  single operator-facing score.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-3 py-2">
                  <div className="font-mono text-[10px] uppercase text-cyan-200/70">Latency</div>
                  <div className="mt-1 font-mono text-sm text-white">12ms</div>
                </div>
                <div className="rounded-xl border border-fuchsia-500/15 bg-fuchsia-500/5 px-3 py-2">
                  <div className="font-mono text-[10px] uppercase text-fuchsia-200/70">Trust</div>
                  <div className="mt-1 font-mono text-sm text-white">0.991</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {systemCards.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-[#0d1324]/70 p-4 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{c.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{c.value}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30">
                  <Trend t={c.trend} />
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-rose-400"
                  initial={false}
                  animate={{ width: `${c.score}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>Load</span>
                <span className="tabular-nums text-slate-300">{c.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Panel title="Live Metrics" subtitle="Population · Power · Atmosphere · Uptime">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricPill label="Population activity" value={`${populationActivity}%`} />
          <MetricPill label="Energy consumption" value={`${energyConsumptionPct}%`} />
          <MetricPill label="Pollution index" value={`${pollutionIndex}`} />
          <MetricPill label="System uptime" value={`${systemUptime}%`} />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-12">
        <Panel title="Alert Stream" subtitle="Severity-coded municipal signals" className="lg:col-span-7">
          <div className="space-y-2">
            {alerts.slice(0, 8).map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "rounded-xl border bg-black/25 px-4 py-3",
                  alertBorder(a.severity),
                  a.severity === "critical" ? "shadow-[0_0_0_1px_rgba(244,63,94,0.25)]" : "",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-slate-300">{a.title}</div>
                  <div className="font-mono text-[10px] text-white/35">
                    {new Date(a.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-200">{a.message}</div>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Actions" subtitle="Jump to critical surfaces" className="lg:col-span-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModule("map")}
              className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-cyan-100"
            >
              Open Map
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModule("emergency")}
              className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-transparent px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-rose-100"
            >
              View Emergencies
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setModule("traffic");
                pushLiveUpdate({ label: "TRAFFIC", detail: "Heuristic optimization pass queued on mesh spine." });
              }}
              className="flex items-center justify-between gap-3 rounded-xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-transparent px-4 py-3 text-left"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-fuchsia-100">Optimize Traffic</span>
              <Zap className="h-4 w-4 text-fuchsia-200" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                pushLiveUpdate({
                  label: "SCAN",
                  detail: "Deep integrity sweep started — checksum across 18 subsystems.",
                })
              }
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-slate-200">Run System Scan</span>
              <Scan className="h-4 w-4 text-slate-200" />
            </motion.button>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-xs text-slate-400">
            <Radar className="h-4 w-4 text-cyan-300" />
            Tip: bind quick actions to hardware macro keys in production deployments.
          </div>
        </Panel>
      </div>
    </div>
  );
}
