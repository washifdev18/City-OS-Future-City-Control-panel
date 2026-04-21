"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ZoneStats } from "@/data/mock";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";

function heatColor(v: number) {
  const t = v / 100;
  if (t < 0.35) return "rgba(34,211,238,0.22)";
  if (t < 0.65) return "rgba(168,85,247,0.28)";
  return "rgba(251,113,133,0.30)";
}

export function CityMapView() {
  const zones = useCityStore((s) => s.zones);
  const mapZoom = useCityStore((s) => s.mapZoom);
  const setMapZoom = useCityStore((s) => s.setMapZoom);
  const selected = useCityStore((s) => s.selectedZoneId);
  const selectZone = useCityStore((s) => s.selectZone);

  const [hovered, setHovered] = useState<ZoneStats["id"] | null>(null);
  const hoverZone = useMemo(() => zones.find((z) => z.id === hovered) ?? null, [zones, hovered]);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Panel title="City Map" subtitle="Zone mesh · heat telemetry · operator drill-down" className="xl:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setMapZoom(mapZoom - 0.06)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30"
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setMapZoom(mapZoom + 0.06)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
            <div className="rounded-full border border-cyan-500/15 bg-cyan-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200/80">
              Zoom {Math.round(mapZoom * 100)}%
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            SVG grid · simulated parallax
          </div>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl border border-cyan-500/15 bg-black/40">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <motion.div
            className="relative aspect-[16/10] w-full"
            animate={{ scale: mapZoom }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            style={{ transformOrigin: "50% 45%" }}
          >
            <svg viewBox="0 0 1000 620" className="h-full w-full">
              <defs>
                <filter id="zGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="10" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {zones.map((z) => {
                const paths: Record<ZoneStats["id"], string> = {
                  A: "M120,120 L520,90 L560,300 L160,340 Z",
                  B: "M520,90 L900,140 L880,320 L560,300 Z",
                  C: "M160,340 L560,300 L600,520 L200,560 Z",
                  D: "M560,300 L880,320 L840,520 L600,520 Z",
                  E: "M200,560 L600,520 L760,600 L240,600 Z",
                };
                const avg = (z.populationDensity + z.traffic + z.pollution + z.energyConsumption) / 4;
                const isSel = selected === z.id;
                const isHov = hovered === z.id;
                return (
                  <g key={z.id}>
                    <motion.path
                      d={paths[z.id]}
                      fill={heatColor(avg)}
                      stroke={isSel ? "rgba(34,211,238,0.85)" : "rgba(255,255,255,0.12)"}
                      strokeWidth={isSel ? 3 : 2}
                      filter={isHov || isSel ? "url(#zGlow)" : undefined}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(z.id)}
                      onMouseLeave={() => setHovered((h) => (h === z.id ? null : h))}
                      onClick={() => selectZone(z.id)}
                      animate={{
                        opacity: hovered && hovered !== z.id ? 0.55 : 1,
                      }}
                      whileTap={{ scale: 0.995 }}
                      style={{ transformOrigin: "center" }}
                    />
                    <motion.circle
                      cx={0}
                      cy={0}
                      r={10}
                      fill="rgba(34,211,238,0.35)"
                      className="pointer-events-none"
                      style={{
                        translate:
                          z.id === "A"
                            ? "320px 215px"
                            : z.id === "B"
                              ? "720px 205px"
                              : z.id === "C"
                                ? "380px 430px"
                                : z.id === "D"
                                  ? "720px 410px"
                                  : "420px 555px",
                      }}
                      animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.9, 1.15, 0.9] }}
                      transition={{ duration: 2.4 + z.id.charCodeAt(0) * 0.05, repeat: Infinity }}
                    />
                    <text
                      x={
                        z.id === "A"
                          ? 320
                          : z.id === "B"
                            ? 720
                            : z.id === "C"
                              ? 360
                              : z.id === "D"
                                ? 720
                                : 420
                      }
                      y={
                        z.id === "A"
                          ? 230
                          : z.id === "B"
                            ? 220
                            : z.id === "C"
                              ? 450
                              : z.id === "D"
                                ? 430
                                : 540
                      }
                      textAnchor="middle"
                      className="fill-white font-mono text-[22px]"
                      style={{ textShadow: "0 0 18px rgba(34,211,238,0.55)" }}
                    >
                      {z.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            <AnimatePresence>
              {hoverZone && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="pointer-events-none absolute left-4 top-4 w-[280px] rounded-xl border border-cyan-500/20 bg-[#070b14]/90 p-4 shadow-2xl backdrop-blur"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-200/80">
                    Zone {hoverZone.id}
                  </div>
                  <div className="mt-1 text-sm text-white">{hoverZone.label}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                    <div className="rounded-lg border border-white/5 bg-black/30 px-2 py-2">
                      <div className="text-[10px] uppercase text-slate-500">Population</div>
                      <div className="tabular-nums">{hoverZone.populationDensity}%</div>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/30 px-2 py-2">
                      <div className="text-[10px] uppercase text-slate-500">Traffic</div>
                      <div className="tabular-nums">{hoverZone.traffic}%</div>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/30 px-2 py-2">
                      <div className="text-[10px] uppercase text-slate-500">Pollution</div>
                      <div className="tabular-nums">{hoverZone.pollution}%</div>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/30 px-2 py-2">
                      <div className="text-[10px] uppercase text-slate-500">Energy</div>
                      <div className="tabular-nums">{hoverZone.energyConsumption}%</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Panel>

      <div className="space-y-6 xl:col-span-4">
        <Panel title="Zone Detail" subtitle="Click a zone on the map">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                {(() => {
                  const z = zones.find((x) => x.id === selected)!;
                  return (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Selected</div>
                          <div className="mt-1 text-lg font-semibold text-white">
                            Zone {z.id} — {z.label}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectZone(null)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/30"
                          aria-label="Close zone detail"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-2">
                        {[
                          ["Population density", `${z.populationDensity}%`],
                          ["Traffic level", `${z.traffic}%`],
                          ["Pollution level", `${z.pollution}%`],
                          ["Energy consumption", `${z.energyConsumption}%`],
                        ].map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/25 px-3 py-2"
                          >
                            <div className="text-xs text-slate-400">{k}</div>
                            <div className="font-mono text-sm text-cyan-100">{v}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400">
                Select any glowing sector to open live telemetry, routing overrides, and maintenance windows.
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>

        <Panel title="Heatmap Legend" subtitle="Fused intensity (simulated)">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-3 w-10 rounded" style={{ background: heatColor(25) }} />
              Low stress
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-10 rounded" style={{ background: heatColor(55) }} />
              Elevated coupling
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-10 rounded" style={{ background: heatColor(85) }} />
              Critical coupling
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
