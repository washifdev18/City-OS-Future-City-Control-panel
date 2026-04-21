"use client";

import { create } from "zustand";
import {
  INITIAL_ALERTS,
  INITIAL_DISTRICTS,
  INITIAL_INCIDENTS,
  INITIAL_PLANTS,
  INITIAL_ZONES,
  randomJitter,
  type CityAlert,
  type DistrictCard,
  type Incident,
  type PowerPlant,
  type ZoneStats,
} from "@/data/mock";
import type { LiveUpdate, ModuleId } from "@/store/types";

export interface SystemStatusCard {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "steady";
  score: number;
}

interface CityState {
  activeModule: ModuleId;
  cityHealth: number;
  populationActivity: number;
  energyConsumptionPct: number;
  pollutionIndex: number;
  systemUptime: number;
  zones: ZoneStats[];
  districts: DistrictCard[];
  alerts: CityAlert[];
  incidents: Incident[];
  plants: PowerPlant[];
  liveUpdates: LiveUpdate[];
  notifications: string[];
  aiOptimization: boolean;
  emergencyRouting: boolean;
  renewablePct: number;
  gridLoad: number;
  productionMw: number;
  consumptionMw: number;
  blackoutRisk: number;
  aqi: number;
  weather: { condition: string; tempC: number; windKph: number; humidity: number };
  mapZoom: number;
  selectedZoneId: ZoneStats["id"] | null;
  compareDistricts: boolean;
  selectedDistrictId: DistrictCard["id"] | null;
  trafficSeries: { t: string; intensity: number }[];
  energySeries: { t: string; production: number; consumption: number }[];
  envSeries: { t: string; aqi: number }[];
  systemCards: SystemStatusCard[];
  setModule: (m: ModuleId) => void;
  setMapZoom: (z: number) => void;
  selectZone: (id: ZoneStats["id"] | null) => void;
  toggleCompareDistricts: () => void;
  selectDistrict: (id: DistrictCard["id"] | null) => void;
  setAiOptimization: (v: boolean) => void;
  setEmergencyRouting: (v: boolean) => void;
  tickSimulation: () => void;
  pushLiveUpdate: (u: Omit<LiveUpdate, "id" | "ts">) => void;
  dispatchIncident: (id: string) => void;
  investigateIncident: (id: string) => void;
  ignoreIncident: (id: string) => void;
}

const hours = ["T-6h", "T-5h", "T-4h", "T-3h", "T-2h", "T-1h", "Now"];

function seedSeries() {
  return hours.map((t, i) => ({
    t,
    intensity: 40 + i * 6 + Math.round(Math.random() * 8),
  }));
}

function seedEnergySeries() {
  return hours.map((t, i) => ({
    t,
    production: 3200 + i * 40 + Math.round(Math.random() * 60),
    consumption: 3000 + i * 35 + Math.round(Math.random() * 80),
  }));
}

function seedEnvSeries() {
  return hours.map((t, i) => ({
    t,
    aqi: 38 + i * 3 + Math.round(Math.random() * 6),
  }));
}

export const useCityStore = create<CityState>((set, get) => ({
  activeModule: "dashboard",
  cityHealth: 87,
  populationActivity: 72,
  energyConsumptionPct: 68,
  pollutionIndex: 44,
  systemUptime: 99.94,
  zones: INITIAL_ZONES,
  districts: INITIAL_DISTRICTS,
  alerts: INITIAL_ALERTS,
  incidents: INITIAL_INCIDENTS,
  plants: INITIAL_PLANTS,
  liveUpdates: [
    {
      id: "lu-1",
      label: "ORBITAL SYNC",
      detail: "Weather mesh reconciled with LEO relay cluster.",
      ts: Date.now() - 8_000,
    },
    {
      id: "lu-2",
      label: "PULSE HANDSHAKE",
      detail: "District telemetry checksum OK across 5 sectors.",
      ts: Date.now() - 22_000,
    },
  ],
  notifications: [
    "Neural traffic mesh: calibration drift < 0.2%",
    "Citizen sentiment index stable (Δ +0.1)",
  ],
  aiOptimization: true,
  emergencyRouting: false,
  renewablePct: 61,
  gridLoad: 74,
  productionMw: 3840,
  consumptionMw: 3560,
  blackoutRisk: 18,
  aqi: 52,
  weather: { condition: "Ionized drizzle", tempC: 19, windKph: 24, humidity: 63 },
  mapZoom: 1,
  selectedZoneId: null,
  compareDistricts: false,
  selectedDistrictId: null,
  trafficSeries: seedSeries(),
  energySeries: seedEnergySeries(),
  envSeries: seedEnvSeries(),
  systemCards: [
    { id: "traffic", label: "Traffic", value: "Elevated", trend: "up", score: 72 },
    { id: "energy", label: "Energy", value: "Stable", trend: "steady", score: 81 },
    { id: "environment", label: "Environment", value: "Moderate", trend: "steady", score: 66 },
    { id: "emergency", label: "Emergency", value: "Watch", trend: "up", score: 58 },
  ],
  setModule: (m) => set({ activeModule: m }),
  setMapZoom: (z) => set({ mapZoom: Math.min(1.35, Math.max(0.85, z)) }),
  selectZone: (id) => set({ selectedZoneId: id }),
  toggleCompareDistricts: () => set((s) => ({ compareDistricts: !s.compareDistricts })),
  selectDistrict: (id) => set({ selectedDistrictId: id }),
  setAiOptimization: (v) => set({ aiOptimization: v }),
  setEmergencyRouting: (v) => set({ emergencyRouting: v }),
  pushLiveUpdate: (u) =>
    set((s) => ({
      liveUpdates: [
        { ...u, id: `lu-${Math.random().toString(36).slice(2, 9)}`, ts: Date.now() },
        ...s.liveUpdates,
      ].slice(0, 24),
    })),
  dispatchIncident: (id) => {
    get().pushLiveUpdate({
      label: "DISPATCH",
      detail: `Response units vectored to incident ${id}.`,
    });
    set((s) => ({
      incidents: s.incidents.filter((i) => i.id !== id),
    }));
  },
  investigateIncident: (id) => {
    get().pushLiveUpdate({
      label: "INVESTIGATE",
      detail: `Forensic mesh locked on incident ${id}.`,
    });
    set((s) => ({
      incidents: s.incidents.map((i) => {
        if (i.id !== id) return i;
        const next = Math.max(1, i.severity - 1) as Incident["severity"];
        return { ...i, severity: next };
      }),
    }));
  },
  ignoreIncident: (id) => {
    get().pushLiveUpdate({ label: "IGNORE", detail: `Incident ${id} archived to cold storage.` });
    set((s) => ({ incidents: s.incidents.filter((i) => i.id !== id) }));
  },
  tickSimulation: () => {
    const s = get();
    const cityHealth = randomJitter(s.cityHealth, 2, 72, 96);
    const populationActivity = randomJitter(s.populationActivity, 4, 40, 98);
    const energyConsumptionPct = randomJitter(s.energyConsumptionPct, 3, 45, 92);
    const pollutionIndex = randomJitter(s.pollutionIndex, 3, 18, 88);
    const systemUptime = Number((99.7 + Math.random() * 0.29).toFixed(2));
    const renewablePct = randomJitter(s.renewablePct, 2, 48, 72);
    const gridLoad = randomJitter(s.gridLoad, 4, 38, 94);
    const productionMw = randomJitter(s.productionMw, 80, 3200, 4200);
    const consumptionMw = randomJitter(s.consumptionMw, 90, 3000, 4000);
    const blackoutRisk = randomJitter(s.blackoutRisk, 5, 4, 42);
    const aqi = randomJitter(s.aqi, 4, 28, 120);

    const zones = s.zones.map((z) => ({
      ...z,
      populationDensity: randomJitter(z.populationDensity, 3),
      traffic: randomJitter(z.traffic, 4),
      pollution: randomJitter(z.pollution, 3),
      energyConsumption: randomJitter(z.energyConsumption, 3),
    }));

    const nextTraffic = s.trafficSeries.map((row, idx) => ({
      ...row,
      intensity: randomJitter(row.intensity, idx === s.trafficSeries.length - 1 ? 8 : 3, 20, 100),
    }));

    const nextEnergy = s.energySeries.map((row, idx) => ({
      ...row,
      production: randomJitter(row.production, idx === s.energySeries.length - 1 ? 70 : 25, 2800, 4400),
      consumption: randomJitter(row.consumption, idx === s.energySeries.length - 1 ? 80 : 30, 2700, 4100),
    }));

    const nextEnv = s.envSeries.map((row, idx) => ({
      ...row,
      aqi: randomJitter(row.aqi, idx === s.envSeries.length - 1 ? 6 : 2, 25, 140),
    }));

    const maybeAlertRoll = Math.random();
    let alerts = [...s.alerts];
    if (maybeAlertRoll > 0.55) {
      const pool: CityAlert[] = [
        {
          id: `al-${Math.random().toString(36).slice(2, 7)}`,
          title: "MESH HEARTBEAT",
          message: "Telemetry parity verified across arterial sensors.",
          severity: "normal",
          ts: Date.now(),
        },
        {
          id: `al-${Math.random().toString(36).slice(2, 7)}`,
          title: "LOAD SHEDDER",
          message: "Optional curtailment window suggested for Sector D.",
          severity: "warning",
          ts: Date.now(),
        },
        {
          id: `al-${Math.random().toString(36).slice(2, 7)}`,
          title: "CRITICAL PATH",
          message: "Emergency bandwidth reservation engaged on spine routes.",
          severity: "critical",
          ts: Date.now(),
        },
      ];
      alerts = [pool[Math.floor(Math.random() * pool.length)], ...alerts].slice(0, 18);
    }

    const systemCards: SystemStatusCard[] = s.systemCards.map((c) => {
      const prev = c.score;
      const score = randomJitter(c.score, 4, 35, 96);
      let value = c.value;
      const trend: SystemStatusCard["trend"] =
        score > prev + 1 ? "up" : score < prev - 1 ? "down" : "steady";
      if (c.id === "traffic") {
        value = score > 78 ? "Congested" : score > 60 ? "Elevated" : "Fluid";
      }
      if (c.id === "energy") {
        value = score > 80 ? "Stable" : score > 65 ? "Balanced" : "Strained";
      }
      if (c.id === "environment") {
        value = score > 70 ? "Moderate" : score > 50 ? "Caution" : "Hazardous";
      }
      if (c.id === "emergency") {
        value = score > 70 ? "Nominal" : score > 50 ? "Watch" : "Critical";
      }
      return { ...c, score, value, trend };
    });

    set({
      cityHealth,
      populationActivity,
      energyConsumptionPct,
      pollutionIndex,
      systemUptime,
      zones,
      renewablePct,
      gridLoad,
      productionMw,
      consumptionMw,
      blackoutRisk,
      aqi,
      trafficSeries: nextTraffic,
      energySeries: nextEnergy,
      envSeries: nextEnv,
      alerts,
      systemCards,
      weather: {
        ...s.weather,
        tempC: randomJitter(s.weather.tempC, 1, 12, 28),
        windKph: randomJitter(s.weather.windKph, 3, 8, 40),
        humidity: randomJitter(s.weather.humidity, 2, 40, 82),
      },
    });
  },
}));
