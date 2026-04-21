"use client";

import { AiAssistantView } from "@/components/ai/AiAssistantView";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DistrictsView } from "@/components/districts/DistrictsView";
import { EmergencyView } from "@/components/emergency/EmergencyView";
import { EnergyView } from "@/components/energy/EnergyView";
import { EnvironmentView } from "@/components/environment/EnvironmentView";
import { CityMapView } from "@/components/map/CityMapView";
import { TrafficView } from "@/components/traffic/TrafficView";
import { useCityStore } from "@/store/useCityStore";

export function MainModuleRouter() {
  const m = useCityStore((s) => s.activeModule);

  switch (m) {
    case "dashboard":
      return <DashboardView />;
    case "map":
      return <CityMapView />;
    case "traffic":
      return <TrafficView />;
    case "energy":
      return <EnergyView />;
    case "environment":
      return <EnvironmentView />;
    case "emergency":
      return <EmergencyView />;
    case "districts":
      return <DistrictsView />;
    case "ai":
      return <AiAssistantView />;
    default:
      return <DashboardView />;
  }
}
