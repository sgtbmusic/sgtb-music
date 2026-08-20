import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { formatTime, coverTemplate } from "@/lib/site";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3, Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function PersistentAudioPlayer() {
  const { data: tracks = [] } = trpc.tracks.list.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const current = tracks[currentIndex] ?? null;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (el.dataset.trackId !== String(current.id)) {
      el.dataset.trackId = String(current.id);
      el.src = current.audioUrl;
      setCurrentTime(0);
      setDuration(current.durationSeconds || 180);
      if (playing) {
        el.play().catch(() => setPlaying(false));
      }
    }
  }, [current, playing]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    const next = (currentIndex + 1) % tracks.length;
    setCurrentIndex(next);
    setPlaying(true);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    const prev = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentIndex(prev);
    setPlaying(true);
  };

  if (!current) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/25 bg-[#0d0a06]/95 px-4 py-3 text-foreground shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
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

  const template = coverTemplate(current.id);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration || 180)}
        onEnded={handleNext}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0a06]/95 backdrop-blur-xl border-t border-gold/25 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] text-foreground">
        <div className="container max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Track Info */}
          <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
            {current.coverUrl ? (
              <img src={current.coverUrl} alt={current.title} className="size-12 rounded-xl object-cover border border-gold/30 shrink-0" />
            ) : (
              <div
                className="size-12 rounded-xl flex items-center justify-center border border-gold/30 shrink-0 shadow-inner"
                style={{ background: `linear-gradient(135deg, ${template.from}, ${template.to})` }}
              >
                <Disc3 className="size-6 text-gold animate-spin-slow" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-display text-sm uppercase text-white truncate tracking-wider">{current.title}</p>
              <p className="font-mono text-[11px] uppercase text-gold truncate">{current.artist || "SGTB Music Group"}</p>
            </div>
          </div>

          {/* Center: Controls & Scrubber */}
          <div className="flex-1 max-w-2xl w-full flex flex-col items-center gap-1.5 px-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="size-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="size-9 rounded-full bg-gold text-[#17120a] hover:bg-gold-soft flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Next track"
              >
                <SkipForward className="size-4" />
              </button>
            </div>

            <div className="w-full flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <div className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon via-gold to-gold rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = val;
                    setCurrentTime(val);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Status */}
          <div className="hidden sm:flex items-center gap-3 w-64 justify-end shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neon flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-neon animate-pulse" /> Master Feed
            </span>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              className="text-muted-foreground hover:text-white transition-colors"
            >
              {muted || volume === 0 ? <VolumeX className="size-4 text-red-400" /> : <Volume2 className="size-4" />}
            </button>
            <Slider
              value={[muted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(val) => {
                setVolume(val[0] / 100);
                if (muted) setMuted(false);
              }}
              className="w-24 accent-gold"
            />
          </div>

        </div>
      </div>
    </>
  );
}
