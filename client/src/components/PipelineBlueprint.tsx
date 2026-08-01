import { PIPELINE } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  Disc3,
  ListMusic,
  Radio,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = [Sparkles, Disc3, ListMusic, SlidersHorizontal, Radio, Share2];

/**
 * The signature homepage blueprint. Stages light up in sequence and the
 * connective tracing advances with them, reading like a studio signal chain.
 */
export function PipelineBlueprint({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);

  // Initial cascade reveal, then a continuous cycling highlight.
  useEffect(() => {
    const reveals = PIPELINE.map((_, index) =>
      window.setTimeout(() => setRevealed(index + 1), 140 + index * 110),
    );
    return () => reveals.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % PIPELINE.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden rounded-xl p-5 sm:p-7",
        className,
      )}>
      <div aria-hidden className="grid-texture absolute inset-0 opacity-40" />

      <div className="relative mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] tracking-[0.3em] text-neon uppercase">
            Blueprint / Signal Chain
          </p>
          <h3 className="font-display mt-1.5 text-2xl text-foreground sm:text-3xl">
            IDEA TO <span className="text-gold-gradient">INDUSTRY</span>
          </h3>
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
          6 stages · 1 record
        </span>
      </div>

      <ol className="relative grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {PIPELINE.map((stage, index) => {
          const Icon = ICONS[index];
          const isActive = index === activeIndex;
          const isVisible = index < revealed;
          const isPast = index < activeIndex;

          return (
            <li
              key={stage.id}
              className={cn(
                "group relative flex flex-col gap-2.5 rounded-lg border p-3.5 transition-all duration-300",
                isActive
                  ? "border-gold/55 bg-gold/8"
                  : isPast
                    ? "border-neon/25 bg-neon/4"
                    : "border-border bg-card/50",
              )}
              style={{
                transitionTimingFunction: "var(--ease-out)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(14px)",
              }}>
              {/* Connector: horizontal on wide grids, vertical when stacked. */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-1/2 -right-3 hidden h-px w-3 transition-colors duration-300 xl:block",
                  index === PIPELINE.length - 1 && "xl:hidden",
                  isPast || isActive ? "bg-gold/70" : "bg-border",
                )}
              />

              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-md border transition-colors duration-300",
                    isActive
                      ? "border-gold/60 bg-gold/15 text-gold"
                      : "border-border bg-secondary/60 text-muted-foreground",
                  )}>
                  <Icon className="size-4" />
                </span>
                <span
                  className={cn(
                    "font-mono text-[0.65rem] tracking-[0.2em] transition-colors duration-300",
                    isActive ? "text-gold" : "text-muted-foreground/70",
                  )}>
                  {stage.step}
                </span>
              </div>

              <div>
                <p
                  className={cn(
                    "font-condensed text-base leading-tight tracking-[0.08em] uppercase transition-colors duration-300",
                    isActive ? "text-foreground" : "text-foreground/80",
                  )}>
                  {stage.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {stage.caption}
                </p>
              </div>

              {isActive && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-gold/30"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Progress rail mirrors the active stage. */}
      <div className="relative mt-6 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neon via-gold to-gold transition-[width] duration-500"
          style={{
            width: `${((activeIndex + 1) / PIPELINE.length) * 100}%`,
            transitionTimingFunction: "var(--ease-in-out)",
          }}
        />
      </div>
      <p className="font-mono mt-2.5 text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
        Now tracing: <span className="text-gold">{PIPELINE[activeIndex].label}</span>
      </p>
    </div>
  );
}
