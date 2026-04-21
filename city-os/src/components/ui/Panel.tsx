"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-[#0d1324]/80 shadow-[0_0_0_1px_rgba(0,240,255,0.04)_inset,0_20px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(0,240,255,0.06),transparent_45%,rgba(168,85,247,0.05))] before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
        className,
      )}
    >
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-white/5 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </motion.section>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[140px] flex-col gap-1 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      <span className="font-mono text-lg text-cyan-100">{value}</span>
    </div>
  );
}
