import { coverTemplate, formatTime } from "@/lib/site";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Disc3, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export { requestTrackPlayback } from "@/contexts/AudioPlayerContext";
export type { PlayerTrack } from "@/contexts/AudioPlayerContext";

export function PersistentAudioPlayer() {
  const {
    current,
    currentTime,
    duration,
    isPlaying,
    volume,
    muted,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
  } = useAudioPlayer();

  if (!current) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/25 bg-[#0d0a06]/95 px-3 py-2.5 text-foreground shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-4 sm:py-3">
        <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/5 text-gold"><Music2 className="size-5" /></div>
            <div className="min-w-0"><p className="font-display text-sm uppercase tracking-wider text-white">SGTB Master Feed</p><p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Choose a catalog track to begin playback</p></div>
          </div>
          <span className="hidden rounded-full border border-neon/20 bg-neon/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neon sm:inline-flex"><span className="mr-2 size-1.5 self-center rounded-full bg-neon" /> Ready</span>
        </div>
      </div>
    );
  }

  const template = coverTemplate(Number(current.id) || 0);
  const safeDuration = duration > 0 ? duration : 180;
  const progress = safeDuration > 0 ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100)) : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/25 bg-[#0d0a06]/95 px-3 py-2.5 text-foreground shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-4 sm:py-3">
      <div className="container mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-72 sm:shrink-0">
          {current.coverUrl ? (
            <img src={current.coverUrl} alt={`${current.title} cover art`} className="size-10 shrink-0 rounded-xl border border-gold/30 object-cover sm:size-12" />
          ) : (
            <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold/30 shadow-inner sm:size-12" style={{ background: `linear-gradient(135deg, ${template.from}, ${template.to})` }}>
              <Disc3 className={`size-5 text-gold sm:size-6 ${isPlaying ? "anim-spin-slow" : ""}`} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-sm uppercase tracking-wider text-white">{current.title}</p>
            <p className="truncate font-mono text-[10px] uppercase text-gold sm:text-[11px]">{current.artist || (current.kind === "podcast" ? "Suno Business Broadcast" : "SGTB Music Group")}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full border border-neon/20 bg-neon/5 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neon sm:hidden">{isPlaying ? "Live" : "Ready"}</span>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-1 px-0 sm:max-w-2xl sm:px-2">
          <div className="flex items-center gap-4">
            <button type="button" onClick={previous} className="text-muted-foreground transition-colors hover:text-gold" aria-label="Previous track"><SkipBack className="size-4" /></button>
            <button type="button" onClick={togglePlay} className="grid size-9 place-items-center rounded-full bg-gold text-[#17120a] shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 hover:bg-gold-soft" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
            </button>
            <button type="button" onClick={next} className="text-muted-foreground transition-colors hover:text-gold" aria-label="Next track"><SkipForward className="size-4" /></button>
          </div>
          <div className="flex w-full items-center gap-2 font-mono text-[10px] text-muted-foreground sm:gap-3">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <div className="group relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neon via-gold to-gold" style={{ width: `${progress}%` }} />
              <input type="range" min={0} max={safeDuration} step={0.1} value={Math.min(currentTime, safeDuration)} onChange={event => seek(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Seek in track" />
            </div>
            <span className="w-8">{formatTime(safeDuration)}</span>
          </div>
        </div>

        <div className="hidden w-64 shrink-0 items-center justify-end gap-3 sm:flex">
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-neon"><span className="size-1.5 animate-pulse rounded-full bg-neon" /> Master Feed</span>
          <button type="button" onClick={toggleMute} className="text-muted-foreground transition-colors hover:text-white" aria-label={muted ? "Unmute" : "Mute"}>{muted || volume === 0 ? <VolumeX className="size-4 text-red-400" /> : <Volume2 className="size-4" />}</button>
          <Slider value={[muted ? 0 : Math.round(volume * 100)]} max={100} step={1} onValueChange={value => setVolume((value[0] ?? 0) / 100)} className="w-24" aria-label="Volume" />
        </div>
      </div>
    </div>
  );
}
