"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { useCityStore } from "@/store/useCityStore";

type Role = "system" | "user";

interface ChatLine {
  id: string;
  role: Role;
  text: string;
  ts: number;
}

function synthesizeReply(input: string, ctx: { traffic: number; energy: number; incidents: number }) {
  const q = input.toLowerCase();
  if (q.includes("traffic") || q.includes("route") || q.includes("congest")) {
    return `Traffic mesh is at ${ctx.traffic}% intensity. ${ctx.traffic > 75 ? "Recommend enabling emergency routing corridors and de-prioritizing freight merges." : "Hold AI optimization — margins are healthy."}`;
  }
  if (q.includes("energy") || q.includes("grid") || q.includes("power")) {
    return `Grid headroom sits around ${100 - ctx.energy}% under modeled peaks. ${ctx.energy > 75 ? "Shift discretionary loads from Industrial Veil to Green Perimeter buffers." : "Renewable mix can absorb forecast noise without curtailment."}`;
  }
  if (q.includes("emergency") || q.includes("incident") || q.includes("fire")) {
    return `Active incidents in queue: ${ctx.incidents}. ${ctx.incidents > 0 ? "Keep emergency surface pinned; dispatch latency is sensitive to priority sorting." : "No hot incidents — maintain sentinel coverage on Skyline Ring."}`;
  }
  if (q.startsWith("/")) {
    return `Command "${input}" acknowledged. Routed to offline sandbox — no municipal actuators touched.`;
  }
  return `Acknowledged. I can correlate traffic, energy, and emergency domains. Try: "traffic", "energy", "emergency", or a slash command like "/scan sectors".`;
}

export function AiAssistantView() {
  const traffic = useCityStore((s) => s.trafficSeries.at(-1)?.intensity ?? 50);
  const gridLoad = useCityStore((s) => s.gridLoad);
  const incidents = useCityStore((s) => s.incidents.length);
  const pushLiveUpdate = useCityStore((s) => s.pushLiveUpdate);

  const [lines, setLines] = useState<ChatLine[]>(() => {
    const ts = Date.now();
    return [
      {
        id: "m1",
        role: "system",
        ts,
        text: "City cognition online. I am monitoring traffic harmonics, grid torque, and emergency posture.",
      },
      {
        id: "m2",
        role: "system",
        ts,
        text: "Suggestion: run a traffic optimization pass if Skyline Ring intensity stays above 78% for two ticks.",
      },
      {
        id: "m3",
        role: "system",
        ts,
        text: "Suggestion: if renewable share dips below 55%, pre-stage Harbor tidal array to full duty.",
      },
      {
        id: "m4",
        role: "system",
        ts,
        text: "Warning: emergency queue non-empty — keep human operators in the loop for severity-4 events.",
      },
    ];
  });
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const userLine: ChatLine = { id: `u-${Math.random().toString(36).slice(2)}`, role: "user", text, ts: Date.now() };
    const reply = synthesizeReply(text, { traffic, energy: gridLoad, incidents });
    const sysLine: ChatLine = {
      id: `s-${Math.random().toString(36).slice(2)}`,
      role: "system",
      text: reply,
      ts: Date.now(),
    };
    setLines((prev) => [...prev, userLine, sysLine]);
    setDraft("");
    pushLiveUpdate({ label: "AI", detail: "Advisory response emitted to local operator channel." });
    queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Panel title="AI City Assistant" subtitle="Simulated cognition · advisory only" className="xl:col-span-8">
        <div
          ref={listRef}
          className="max-h-[560px] space-y-3 overflow-auto rounded-2xl border border-white/5 bg-black/25 p-4"
        >
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div
                key={l.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={l.role === "system" ? "mr-10" : "ml-10"}
              >
                <div
                  className={
                    l.role === "system"
                      ? "rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/10 to-transparent px-4 py-3 text-sm text-slate-200"
                      : "rounded-2xl border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/10 to-transparent px-4 py-3 text-sm text-slate-100"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      {l.role === "system" ? (
                        <>
                          <Bot className="h-4 w-4 text-cyan-200" />
                          City OS / AI
                        </>
                      ) : (
                        <>Operator</>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-white/35">
                      {new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap leading-relaxed">{l.text}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <div className="flex-1">
            <label className="sr-only" htmlFor="ai-input">
              Command input
            </label>
            <input
              id="ai-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder='Try "traffic", "/scan sectors", or "energy"...'
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-sm text-white outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-500/30"
            />
            <div className="mt-2 text-xs text-slate-500">
              Command-like input supported (leading slash routes to sandboxed handlers).
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={send}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-100"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </Panel>

      <Panel title="Advisory Signals" subtitle="What the assistant is weighting" className="xl:col-span-4">
        <div className="space-y-3 text-sm text-slate-300">
          <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
            <div className="font-mono text-[10px] uppercase text-slate-500">Traffic intensity</div>
            <div className="mt-1 font-mono text-lg text-cyan-100">{traffic}%</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
            <div className="font-mono text-[10px] uppercase text-slate-500">Grid load</div>
            <div className="mt-1 font-mono text-lg text-emerald-100">{gridLoad}%</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2">
            <div className="font-mono text-[10px] uppercase text-slate-500">Open incidents</div>
            <div className="mt-1 font-mono text-lg text-rose-100">{incidents}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
