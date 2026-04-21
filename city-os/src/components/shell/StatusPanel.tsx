"use client";

import { motion } from "framer-motion";
import { Activity, Bell, ShieldAlert } from "lucide-react";
import { RadialHealth } from "@/components/ui/RadialHealth";
import { useCityStore } from "@/store/useCityStore";
import { cn } from "@/utils/cn";

function severityStyles(sev: "normal" | "warning" | "critical") {
  if (sev === "critical") return "border-rose-500/35 bg-rose-500/10 text-rose-100";
  if (sev === "warning") return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-100";
}

export function StatusPanel() {
  const cityHealth = useCityStore((s) => s.cityHealth);
  const alerts = useCityStore((s) => s.alerts);
  const notifications = useCityStore((s) => s.notifications);
  const liveUpdates = useCityStore((s) => s.liveUpdates);

  return (
    <aside className="hidden h-dvh w-[320px] shrink-0 border-l border-cyan-500/10 bg-[#070b14]/70 backdrop-blur-xl xl:block">
      <div className="flex h-full flex-col">
        <header className="border-b border-white/5 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">System Status</div>
              <div className="mt-1 text-sm font-medium text-slate-200">Live city mesh</div>
            </div>
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-500/20 bg-black/30 text-cyan-200"
            >
              <Activity className="h-4 w-4" />
            </motion.div>
          </div>
        </header>

        <div className="border-b border-white/5 px-5 py-5">
          <div className="flex items-center gap-4">
            <RadialHealth score={cityHealth} size={132} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Composite</div>
              <div className="mt-2 text-sm text-slate-300">
                Multi-domain fusion index across traffic, energy, environment, and emergency posture.
              </div>
            </div>
          </div>
        </div>

        <section className="border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldAlert className="h-4 w-4 text-fuchsia-300" />
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Active Alerts</div>
          </div>
          <div className="mt-3 space-y-2">
            {alerts.slice(0, 5).map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("rounded-xl border px-3 py-2", severityStyles(a.severity))}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-mono text-[10px] uppercase tracking-widest">{a.title}</div>
                  <div className="shrink-0 font-mono text-[10px] text-white/40">
                    {new Date(a.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="mt-1 text-xs text-white/80">{a.message}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Bell className="h-4 w-4 text-cyan-300" />
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Notifications</div>
          </div>
          <ul className="mt-3 space-y-2">
            {notifications.map((n, idx) => (
              <li key={idx} className="rounded-xl border border-white/5 bg-black/25 px-3 py-2 text-xs text-slate-300">
                {n}
              </li>
            ))}
          </ul>
        </section>

        <section className="min-h-0 flex-1 overflow-hidden px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Live Updates</div>
          <div className="mt-3 h-full space-y-2 overflow-auto pr-1">
            {liveUpdates.map((u) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-mono text-[10px] uppercase tracking-widest text-cyan-200/80">
                    {u.label}
                  </div>
                  <div className="shrink-0 font-mono text-[10px] text-white/35">
                    {new Date(u.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-300">{u.detail}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
