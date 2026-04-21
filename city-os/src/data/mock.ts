import type { AlertSeverity } from "@/store/types";

export type IncidentType = "fire" | "medical" | "crime" | "infrastructure";

export interface CityAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  ts: number;
}

export interface ZoneStats {
  id: "A" | "B" | "C" | "D" | "E";
  label: string;
  populationDensity: number;
  traffic: number;
  pollution: number;
  energyConsumption: number;
}

export interface DistrictCard {
  id: "A" | "B" | "C" | "D" | "E";
  name: string;
  population: number;
  safetyIndex: number;
  infrastructureHealth: number;
  economicActivity: number;
}

export interface Incident {
  id: string;
  type: IncidentType;
  zone: string;
  severity: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  ts: number;
}

export interface PowerPlant {
  id: string;
  name: string;
  outputMw: number;
  status: "online" | "maintenance" | "degraded";
}

export const INITIAL_ZONES: ZoneStats[] = [
  {
    id: "A",
    label: "Nexus Core",
    populationDensity: 82,
    traffic: 64,
    pollution: 38,
    energyConsumption: 71,
  },
  {
    id: "B",
    label: "Harbor Arcology",
    populationDensity: 58,
    traffic: 44,
    pollution: 52,
    energyConsumption: 49,
  },
  {
    id: "C",
    label: "Skyline Ring",
    populationDensity: 91,
    traffic: 88,
    pollution: 61,
    energyConsumption: 84,
  },
  {
    id: "D",
    label: "Industrial Veil",
    populationDensity: 44,
    traffic: 72,
    pollution: 79,
    energyConsumption: 93,
  },
  {
    id: "E",
    label: "Green Perimeter",
    populationDensity: 36,
    traffic: 28,
    pollution: 22,
    energyConsumption: 31,
  },
];

export const INITIAL_DISTRICTS: DistrictCard[] = [
  {
    id: "A",
    name: "Nexus Core",
    population: 1_240_000,
    safetyIndex: 88,
    infrastructureHealth: 91,
    economicActivity: 94,
  },
  {
    id: "B",
    name: "Harbor Arcology",
    population: 890_000,
    safetyIndex: 82,
    infrastructureHealth: 79,
    economicActivity: 76,
  },
  {
    id: "C",
    name: "Skyline Ring",
    population: 1_050_000,
    safetyIndex: 74,
    infrastructureHealth: 85,
    economicActivity: 89,
  },
  {
    id: "D",
    name: "Industrial Veil",
    population: 620_000,
    safetyIndex: 69,
    infrastructureHealth: 72,
    economicActivity: 81,
  },
  {
    id: "E",
    name: "Green Perimeter",
    population: 410_000,
    safetyIndex: 92,
    infrastructureHealth: 88,
    economicActivity: 64,
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    type: "fire",
    zone: "D",
    severity: 4,
    title: "Substation thermal runaway",
    description: "Grid node D-12 venting excess heat. Automated dampers engaged.",
    ts: Date.now() - 120_000,
  },
  {
    id: "inc-2",
    type: "medical",
    zone: "C",
    severity: 2,
    title: "Mass transit medical assist",
    description: "Skyline Ring maglev — passenger sync alert.",
    ts: Date.now() - 340_000,
  },
  {
    id: "inc-3",
    type: "crime",
    zone: "A",
    severity: 3,
    title: "Unauthorized drone swarm",
    description: "Sector A-7 — counter-UAS deploying.",
    ts: Date.now() - 900_000,
  },
  {
    id: "inc-4",
    type: "infrastructure",
    zone: "B",
    severity: 2,
    title: "Harbor floodgate drift",
    description: "Calibration offset 0.4° — maintenance window suggested.",
    ts: Date.now() - 1_800_000,
  },
];

export const INITIAL_ALERTS: CityAlert[] = [
  {
    id: "al-1",
    title: "GRID SYNC",
    message: "Neural load balancer holding steady at 94.2% efficiency.",
    severity: "normal",
    ts: Date.now() - 5_000,
  },
  {
    id: "al-2",
    title: "TRAFFIC ORBIT",
    message: "Skyline Ring experiencing elevated merge latency (+18%).",
    severity: "warning",
    ts: Date.now() - 45_000,
  },
  {
    id: "al-3",
    title: "THERMAL NODE",
    message: "Industrial Veil substation approaching caution threshold.",
    severity: "warning",
    ts: Date.now() - 120_000,
  },
];

export const INITIAL_PLANTS: PowerPlant[] = [
  { id: "p1", name: "Fusion Prime", outputMw: 1240, status: "online" },
  { id: "p2", name: "Tidal Array — East", outputMw: 620, status: "online" },
  { id: "p3", name: "Solar Crown", outputMw: 410, status: "degraded" },
  { id: "p4", name: "Geothermal Spine", outputMw: 880, status: "online" },
  { id: "p5", name: "Micro-reactor Cluster", outputMw: 290, status: "maintenance" },
];

export function randomJitter(value: number, delta: number, min = 0, max = 100) {
  const n = value + (Math.random() * 2 - 1) * delta;
  return Math.round(Math.min(max, Math.max(min, n)));
}
