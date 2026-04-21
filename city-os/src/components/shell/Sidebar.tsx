"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Building2,
  LayoutDashboard,
  Leaf,
  Map,
  Siren,
  Waypoints,
  Zap,
} from "lucide-react";
import type { ModuleId } from "@/store/types";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

const NAV: { id: ModuleId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "City Map", icon: Map },
  { id: "traffic", label: "Traffic Control", icon: Waypoints },
  { id: "energy", label: "Energy Grid", icon: Zap },
  { id: "environment", label: "Environment", icon: Leaf },
  { id: "emergency", label: "Emergency System", icon: Siren },
  { id: "districts", label: "Districts", icon: Building2 },
  { id: "ai", label: "AI Assistant", icon: Bot },
];

export function Sidebar() {
  const active = useCityStore((s) => s.activeModule);
  const setModule = useCityStore((s) => s.setModule);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-dvh w-[72px] flex-col border-r border-cyan-500/10 bg-[#070b14]/95 py-4 backdrop-blur-xl lg:w-[220px]">
      <div className="px-3 lg:px-4">
        <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-black/40 px-2 py-2 lg:px-3">
          <div className="relative h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/25 ring-1 ring-cyan-400/40">
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                boxShadow: "0 0 24px rgba(34,211,238,0.45)",
              }}
            />
            <div className="relative grid h-full place-items-center font-mono text-xs font-bold text-cyan-100">
              CO
            </div>
          </div>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
              City OS
            </div>
            <div className="truncate text-[11px] text-slate-500">Future Control</div>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 px-2 lg:px-3" aria-label="Primary">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setModule(item.id)}
              title={item.label}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-2 py-2.5 text-left outline-none transition-colors lg:px-3",
                isActive
                  ? "bg-cyan-500/10 text-cyan-50"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-full transition-opacity",
                  isActive ? "bg-gradient-to-b from-cyan-300 to-fuchsia-400 opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  "relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-all",
                  isActive
                    ? "border-cyan-400/40 bg-black/40 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                    : "border-white/5 bg-black/20 group-hover:border-cyan-500/20",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-cyan-200" : "text-slate-300")} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="navGlow"
                      className="pointer-events-none absolute inset-0 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        boxShadow: "inset 0 0 24px rgba(34,211,238,0.12)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </span>
              <span className="hidden min-w-0 flex-1 lg:block">
                <span className="block truncate font-mono text-[11px] uppercase tracking-[0.14em]">{item.label}</span>
              </span>
              <span className="pointer-events-none absolute left-[76px] top-1/2 z-50 hidden -translate-y-1/2 rounded-md border border-white/10 bg-black/90 px-2 py-1 font-mono text-[10px] text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 lg:hidden">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <div className="hidden rounded-xl border border-white/5 bg-black/30 p-3 lg:block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Session</div>
          <div className="mt-2 font-mono text-xs text-cyan-200/80">Operator: ROOT</div>
          <div className="mt-1 text-[11px] text-slate-500">Encrypted uplink</div>
        </div>
      </div>
    </aside>
  );
}
