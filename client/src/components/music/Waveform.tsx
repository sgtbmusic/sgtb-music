import { waveformBars } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";

type WaveformProps = {
  seed: number;
  /** 0 → 1 playback position. */
  progress: number;
  playing?: boolean;
  onSeek?: (ratio: number) => void;
  className?: string;
  barCount?: number;
};

/** BeatStars-style clickable waveform scrubber. */
export function Waveform({
  seed,
  progress,
  playing = false,
  onSeek,
  className,
  barCount = 72,
}: WaveformProps) {
  const bars = useMemo(() => waveformBars(seed, barCount), [seed, barCount]);
  const containerRef = useRef<HTMLDivElement>(null);

  function handlePointer(event: React.MouseEvent<HTMLDivElement>) {
    if (!onSeek || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    onSeek(Math.min(1, Math.max(0, ratio)));
  }

  const playedIndex = Math.round(progress * bars.length);

  return (
    <div
      ref={containerRef}
      role={onSeek ? "slider" : undefined}
      aria-label={onSeek ? "Seek position" : undefined}
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      aria-valuenow={onSeek ? Math.round(progress * 100) : undefined}
      tabIndex={onSeek ? 0 : undefined}
      onClick={handlePointer}
      onKeyDown={event => {
        if (!onSeek) return;
        if (event.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
        if (event.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
      }}
      className={cn(
        "flex h-14 items-end gap-[2px] select-none",
        onSeek && "cursor-pointer",
        className,
      )}>
      {bars.map((height, index) => {
        const played = index < playedIndex;
        const isHead = playing && index === playedIndex;
        return (
          <span
            key={index}
            className={cn(
              "flex-1 rounded-full transition-colors duration-150",
              played ? "bg-gold" : "bg-white/18",
              isHead && "bg-neon",
            )}
            style={{ height: `${Math.round(height * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

