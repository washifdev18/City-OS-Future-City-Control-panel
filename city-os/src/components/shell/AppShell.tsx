"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import { useCityStore } from "@/store/useCityStore";
import type { ModuleId } from "@/store/types";
import { Sidebar } from "@/components/shell/Sidebar";
import { StatusPanel } from "@/components/shell/StatusPanel";

const titles: Record<ModuleId, { kicker: string; title: string }> = {
  dashboard: { kicker: "Overview", title: "City Command — Primary Surface" },
  map: { kicker: "Spatial", title: "City Map — Zone Telemetry" },
  traffic: { kicker: "Mobility", title: "Traffic Control — Neural Mesh" },
  energy: { kicker: "Power", title: "Energy Grid — Flow Dynamics" },
  environment: { kicker: "Climate", title: "Environment — Atmospheric Stack" },
  emergency: { kicker: "Response", title: "Emergency System — Priority Feed" },
  districts: { kicker: "Civic", title: "District Management — Comparative" },
  ai: { kicker: "Cognition", title: "AI City Assistant — Advisory Loop" },
};

export function AppShell({ children }: { children: ReactNode }) {
  useLiveSimulation(4200);
  const active = useCityStore((s) => s.activeModule);
  const meta = titles[active];

  return (
    <div className="relative min-h-dvh bg-[#0B0F1A] text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-[0.55]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.12),transparent_55%)]" />
      </div>

      <Sidebar />

      <div className="pl-[72px] lg:pl-[220px]">
        <div className="mx-auto flex min-h-dvh max-w-[1920px]">
          <main className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0B0F1A]/70 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">{meta.kicker}</div>
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={active}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl"
                    >
                      {meta.title}
                    </motion.h1>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Simulated Live
                  </div>
                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200">
                    Uplink Secure
                  </div>
                </div>
              </div>
            </header>

            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <StatusPanel />
        </div>
      </div>
    </div>
  );
}
