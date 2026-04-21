"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GitCompare } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { DistrictCard } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

function spark(id: DistrictCard["id"]) {
  const base = id.charCodeAt(0) % 5;
  return Array.from({ length: 10 }).map((_, i) => ({
    x: i,
    v: 40 + ((i + base) * 7) % 45 + (i % 3) * 3,
  }));
}

export function DistrictsView() {
  const districts = useCityStore((s) => s.districts);
  const compare = useCityStore((s) => s.compareDistricts);
  const toggleCompare = useCityStore((s) => s.toggleCompareDistricts);
  const selected = useCityStore((s) => s.selectedDistrictId);
  const selectDistrict = useCityStore((s) => s.selectDistrict);

  const selectedDistrict = useMemo(() => districts.find((d) => d.id === selected) ?? null, [districts, selected]);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:col-span-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">Districts</div>
          <div className="mt-1 text-sm text-slate-300">A–E civic sectors with live KPI fusion.</div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleCompare()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-[10px] uppercase tracking-widest",
            compare ? "border-cyan-400/35 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-black/30 text-slate-200",
          )}
        >
          <GitCompare className="h-4 w-4" />
          Compare districts
        </motion.button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:col-span-8 xl:grid-cols-3">
        {districts.map((d, idx) => (
          <motion.button
            key={d.id}
            type="button"
            onClick={() => selectDistrict(d.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -4 }}
            className={cn(
              "rounded-2xl border bg-black/25 p-4 text-left shadow-[0_18px_60px_-34px_rgba(0,0,0,0.95)] backdrop-blur",
              selected === d.id ? "border-cyan-400/40 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]" : "border-white/10",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">District {d.id}</div>
                <div className="mt-1 text-base font-semibold text-white">{d.name}</div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] text-slate-300">
                POP {(d.population / 1_000_000).toFixed(2)}M
              </div>
            </div>

            <div className="mt-4 h-[84px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark(d.id)}>
                  <defs>
                    <linearGradient id={`g-${d.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="x" hide />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      background: "rgba(7,11,20,0.92)",
                      border: "1px solid rgba(34,211,238,0.18)",
                      borderRadius: 12,
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 11,
                      color: "#e2e8f0",
                    }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#22d3ee" fill={`url(#g-${d.id})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                <div className="text-[10px] uppercase text-slate-500">Safety</div>
                <div className="mt-1 font-mono text-sm text-cyan-100">{d.safetyIndex}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                <div className="text-[10px] uppercase text-slate-500">Infra</div>
                <div className="mt-1 font-mono text-sm text-fuchsia-100">{d.infrastructureHealth}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                <div className="text-[10px] uppercase text-slate-500">Economy</div>
                <div className="mt-1 font-mono text-sm text-emerald-100">{d.economicActivity}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                <div className="text-[10px] uppercase text-slate-500">Population</div>
                <div className="mt-1 font-mono text-sm text-white">{d.population.toLocaleString()}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Panel title="Drill-down" subtitle="Selected district" className="xl:col-span-4">
        <AnimatePresence mode="wait">
          {selectedDistrict ? (
            <motion.div
              key={selectedDistrict.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Selected</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {selectedDistrict.id} — {selectedDistrict.name}
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-sm text-slate-300">
                Use this surface for zoning overrides, infrastructure budgets, and inter-district load transfers.
              </div>
              <button
                type="button"
                onClick={() => selectDistrict(null)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-200"
              >
                Clear selection
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400">
              Select a district card to open the detail rail and staged interventions.
            </motion.div>
          )}
        </AnimatePresence>

        {compare && (
          <div className="mt-4 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3 text-xs text-cyan-100">
            Compare mode overlays percentile ranks across safety, infrastructure, and economic activity (visual-only in
            this build).
          </div>
        )}
      </Panel>
    </div>
  );
}
