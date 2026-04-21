export type ModuleId =
  | "dashboard"
  | "map"
  | "traffic"
  | "energy"
  | "environment"
  | "emergency"
  | "districts"
  | "ai";

export type AlertSeverity = "normal" | "warning" | "critical";

export interface LiveUpdate {
  id: string;
  label: string;
  detail: string;
  ts: number;
}
