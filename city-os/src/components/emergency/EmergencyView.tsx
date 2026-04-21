"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Hammer, HeartPulse, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import type { Incident, IncidentType } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

function typeMeta(t: IncidentType) {
  switch (t) {
    case "fire":
      return { label: "Fire", Icon: Flame, color: "text-rose-300" };
    case "medical":
      return { label: "Medical", Icon: HeartPulse, color: "text-cyan-300" };
    case "crime":
      return { label: "Crime", Icon: ShieldAlert, color: "text-fuchsia-300" };
    case "infrastructure":
    default:
      return { label: "Infrastructure", Icon: Hammer, color: "text-amber-300" };
  }
}

function severityLabel(s: Incident["severity"]) {
  if (s >= 4) return "CRITICAL";
  if (s === 3) return "HIGH";
  if (s === 2) return "MEDIUM";
  return "LOW";
}

export function EmergencyView() {
  const incidents = useCityStore((s) => s.incidents);
  const dispatchIncident = useCityStore((s) => s.dispatchIncident);
  const investigateIncident = useCityStore((s) => s.investigateIncident);
  const ignoreIncident = useCityStore((s) => s.ignoreIncident);

  const sorted = useMemo(
    () => [...incidents].sort((a, b) => b.severity - a.severity || b.ts - a.ts),
    [incidents],
  );

  return (
    <div className="space-y-6">
      <Panel title="Emergency Response" subtitle="Priority-sorted incident feed · auto-refresh via simulation">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <AnimatePresence mode="popLayout">
              {sorted.map((inc) => {
                const meta = typeMeta(inc.type);
                const Icon = meta.Icon;
                const crit = inc.severity >= 4;
                return (
                  <motion.article
                    key={inc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      boxShadow: crit
                        ? [
                            "0 0 0px rgba(244,63,94,0)",
                            "0 0 28px rgba(244,63,94,0.35)",
                            "0 0 0px rgba(244,63,94,0)",
                          ]
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: crit ? 1.1 : 0.35, repeat: crit ? Infinity : 0 }}
                    className={cn(
                      "rounded-2xl border bg-black/25 p-4",
                      crit ? "border-rose-500/45 bg-rose-500/5" : "border-white/10",
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <div className={cn("grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/30", meta.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold text-white">{inc.title}</div>
                            <div className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-300">
                              Zone {inc.zone}
                            </div>
                            <div
                              className={cn(
                                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                                crit ? "border border-rose-400/35 bg-rose-500/15 text-rose-100" : "border border-white/10 text-slate-200",
                              )}
                            >
                              {severityLabel(inc.severity)}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-slate-400">{inc.description}</div>
                          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                            {meta.label} · {new Date(inc.ts).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => dispatchIncident(inc.id)}
                          className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan-100"
                        >
                          Dispatch
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => investigateIncident(inc.id)}
                          className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-fuchsia-100"
                        >
                          Investigate
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => ignoreIncident(inc.id)}
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-200"
                        >
                          Ignore
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {sorted.length === 0 && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-sm text-emerald-100">
                No active incidents. Sentinel mesh is holding nominal posture.
              </div>
            )}
          </div>

          <div className="space-y-3 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Priority policy</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Critical events bubble to the top and acquire pulsing halos.</li>
                <li>Dispatch removes incidents from the live queue (simulated).</li>
                <li>Investigate reduces severity while keeping the record hot.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-200/80">Auto-update</div>
              <div className="mt-2 text-sm text-slate-200">
                Feed mutates on the global simulation tick, mirroring a websocket-driven operations floor.
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
