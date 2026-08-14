import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getPipelineMode,
  PRE_GENERATION_MODES,
  PRE_GENERATION_WORKFLOW_STAGES,
  type PipelineMode,
} from "@/lib/preGenerationPipeline";

export function PreGenerationPipelineSelector() {
  const [activeMode, setActiveMode] = useState<PipelineMode>("multimodal");
  const mode = getPipelineMode(activeMode);
  const ModeIcon = mode.icon;

  const selectMode = (id: PipelineMode) => {
    setActiveMode(id);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-gold/20 bg-black/30 p-3 shadow-[0_0_40px_rgba(212,175,55,0.08)] sm:p-4">
        <div className="flex items-center justify-between gap-3 px-2 pb-3 sm:px-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Pre-generation control layer</p>
            <p className="mt-1 text-xs text-muted-foreground">Select the signal architecture before the first Reference Demo is rendered.</p>
          </div>
          <div className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neon sm:flex">
            <span className="size-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(45,226,184,0.9)]" /> Live routing
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Pre-generation pipeline modes">
          {PRE_GENERATION_MODES.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeMode;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectMode(item.id)}
                className={cn(
                  "group relative min-h-16 overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-300 sm:min-h-20 sm:px-4",
                  isActive
                    ? "border-gold/65 bg-gold/12 text-white shadow-[0_0_24px_rgba(212,175,55,0.14)]"
                    : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-gold/30 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5 transition-all duration-300",
                    isActive ? "bg-gradient-to-b from-neon via-gold to-gold" : "bg-transparent group-hover:bg-gold/40",
                  )}
                />
                <span className="flex items-start gap-2.5">
                  <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border transition-colors duration-300", isActive ? "border-gold/50 bg-gold/15 text-gold" : "border-white/10 bg-black/20 text-muted-foreground group-hover:text-gold")}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="hidden font-mono text-[10px] uppercase leading-4 tracking-[0.12em] sm:block">{item.label}</span>
                    <span className="font-mono text-[10px] uppercase leading-4 tracking-[0.12em] sm:hidden">{item.shortLabel}</span>
                    <span className={cn("mt-1 block text-[10px] uppercase tracking-wider transition-colors duration-300", isActive ? "text-neon" : "text-muted-foreground/60")}>{isActive ? "Active signal" : "Route signal"}</span>
                  </span>
                </span>
                {isActive && <span aria-hidden className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />}
              </button>
            );
          })}
        </div>
      </div>

      <div key={activeMode} className="relative overflow-hidden rounded-2xl border border-neon/25 bg-neon/[0.045] px-5 py-5 shadow-[0_0_35px_rgba(45,226,184,0.08)] animate-[pipelineReveal_450ms_var(--ease-out)] sm:px-7 sm:py-6">
        <div aria-hidden className="absolute -right-12 -top-14 size-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-gold/45 bg-gold/10 text-gold shadow-[0_0_22px_rgba(212,175,55,0.18)]">
            <ModeIcon className="size-5" />
            <span aria-hidden className="absolute -right-1 -top-1 size-2 rounded-full bg-neon shadow-[0_0_10px_rgba(45,226,184,0.95)]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Signal selected</span>
              <span className="text-white/20">/</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">{mode.label}</span>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/85 sm:text-[15px] sm:leading-7">{mode.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="relative flex flex-col justify-between overflow-visible rounded-2xl border border-gold/55 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-4 shadow-[0_0_28px_rgba(212,175,55,0.13)] transition-all duration-500 sm:p-5">
          <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-gold xl:block"><ArrowRight className="size-4" /></span>
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">00</span>
              <span className="rounded-full border border-neon/25 bg-neon/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neon">Live input</span>
            </div>
            <h4 className="mt-3 font-display text-lg uppercase leading-tight text-white">Audio Pipeline Initiation</h4>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-gold/85">{mode.initiation}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{mode.initiationDetail}</p>
          </div>
          <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neon">
            <span className="size-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(45,226,184,0.8)]" /> Feed accepted
          </div>
        </div>

        {PRE_GENERATION_WORKFLOW_STAGES.map((item, idx) => (
          <div key={item.step} className="relative flex flex-col justify-between rounded-2xl border border-gold/20 bg-gold/5 p-4 transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 sm:p-5">
            {idx < PRE_GENERATION_WORKFLOW_STAGES.length - 1 && <div aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-gold xl:block"><ArrowRight className="size-4" /></div>}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{item.step}</span>
              <h4 className="mt-3 font-display text-lg uppercase leading-tight text-white">{item.name}</h4>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
