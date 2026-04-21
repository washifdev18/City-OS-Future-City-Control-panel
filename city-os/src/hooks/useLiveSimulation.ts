"use client";

import { useEffect } from "react";
import { useCityStore } from "@/store/useCityStore";

export function useLiveSimulation(intervalMs = 4000) {
  const tick = useCityStore((s) => s.tickSimulation);
  const push = useCityStore((s) => s.pushLiveUpdate);

  useEffect(() => {
    const id = window.setInterval(() => {
      tick();
      if (Math.random() > 0.65) {
        const labels = [
          ["PHASE LOCK", "Distributed clocks aligned to 0.3µs skew."],
          ["SENTINEL", "Anomaly classifier retrained on edge shard 7."],
          ["AURORA", "Ionospheric mirror stable — comms margin +6 dB."],
          ["GRIDLINE", "Reactive load following within SLA band."],
        ] as const;
        const pick = labels[Math.floor(Math.random() * labels.length)];
        push({ label: pick[0], detail: pick[1] });
      }
    }, intervalMs);
    return () => {
      window.clearInterval(id);
    };
  }, [intervalMs, tick, push]);
}
