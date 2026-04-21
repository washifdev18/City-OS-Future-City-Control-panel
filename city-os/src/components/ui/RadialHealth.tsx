"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/utils/cn";

export function RadialHealth({
  score,
  size = 168,
  className,
}: {
  score: number;
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = (1 - pct) * c;
  const gradId = `rhGrad-${uid}`;
  const glowId = `rhGlow-${uid}`;

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.div
          key={Math.round(score)}
          initial={{ scale: 0.92, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center"
        >
          <div className="font-mono text-4xl font-semibold tabular-nums text-white">{Math.round(score)}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">Health</div>
        </motion.div>
      </div>
    </div>
  );
}
