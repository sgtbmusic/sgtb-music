import { CoverArt } from "@/components/music/CoverArt";
import { TrackAdminPanel } from "@/components/music/TrackAdminPanel";
import { Waveform } from "@/components/music/Waveform";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useOwner } from "@/hooks/useOwner";
import { formatTime } from "@/lib/site";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  Disc3,
  Music4,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Music() {
  const { isOwner } = useOwner();
  const { data: tracks, isLoading } = trpc.tracks.list.useQuery();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const list = useMemo(() => tracks ?? [], [tracks]);
  const current = list[currentIndex] ?? null;

  // Keep the audio element in sync with the selected track.
  useEffect(() => {
    const element = audioRef.current;
    if (!element || !current) return;
    if (element.dataset.trackId === String(current.id)) return;
    element.dataset.trackId = String(current.id);
    element.src = current.audioUrl;
    setCurrentTime(0);
    setDuration(current.durationSeconds ?? 0);
    if (playing) {
      void element.play().catch(() => setPlaying(false));
    }
  }, [current, playing]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    element.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const goTo = useCallback(
    (index: number) => {
      if (list.length === 0) return;
      const next = (index + list.length) % list.length;
      setCurrentIndex(next);
      setPlaying(true);
    },
    [list.length],
  );

  const togglePlay = useCallback(() => {
    const element = audioRef.current;
    if (!element || !current) return;
    if (element.paused) {
      void element.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      element.pause();
      setPlaying(false);
    }
  }, [current]);

  function handleSeek(ratio: number) {
    const element = audioRef.current;
    if (!element || !Number.isFinite(element.duration)) return;
    element.currentTime = ratio * element.duration;
    setCurrentTime(element.currentTime);
  }

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <SiteLayout>
      <section className="container py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.3em] text-neon uppercase">
              The Catalog
            </p>
            <h1 className="font-display mt-3 text-[clamp(2.4rem,7vw,4.8rem)] uppercase">
              <span className="text-foreground">SGTB </span>
              <span className="text-gold-gradient">Playlist</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Finished records from the SGTB pipeline. Press play, scrub the waveform, and
              hear how Reference Demos become release-ready masters through professional Analog Re-Tracking.
            </p>
          </div>

          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="font-condensed border-gold/40 tracking-[0.16em] text-gold uppercase hover:bg-gold/10"
                  onClick={() => setAdminOpen(true)}>
                  <Settings className="mr-1.5 size-4" />
                  Manage playlist
                </Button>
              </TooltipTrigger>
              <TooltipContent>Owner only</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* ---------------- Player ---------------- */}
        <div className="mt-10">
          {isLoading ? (
            <Skeleton className="h-80 w-full rounded-2xl" />
          ) : list.length === 0 ? (
            <div className="glass-panel grid place-items-center gap-3 rounded-2xl px-6 py-20 text-center">
              <span className="grid size-14 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                <Music4 className="size-6" />
              </span>
              <h2 className="font-condensed text-xl tracking-[0.14em] uppercase">
                Playlist is empty
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {isOwner
                  ? "Open the playlist manager to upload your first MP3 or WAV master."
                  : "New SGTB Music records are being finished. Check back shortly."}
              </p>
              {isOwner && (
                <Button
                  className="font-condensed mt-2 bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft"
                  onClick={() => setAdminOpen(true)}>
                  Upload a track
                </Button>
              )}
            </div>
          ) : (
            <div className="glass-panel overflow-hidden rounded-2xl">
              <div className="grid gap-0 lg:grid-cols-[22rem_1fr]">
                {/* Now playing artwork */}
                <div className="relative border-b border-border/60 p-6 lg:border-r lg:border-b-0">
                  <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl shadow-2xl">
                    <CoverArt
                      title={current?.title ?? "Untitled"}
                      coverUrl={current?.coverUrl}
                      variant={current?.coverVariant ?? 0}
                      size="lg"
                    />
                    {playing && (
                      <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-ink/70 backdrop-blur">
                        <Disc3 className="anim-spin-slow size-4 text-gold" />
                      </span>
                    )}
                  </div>

                  <div className="mt-5 text-center">
                    <h2 className="font-condensed text-2xl leading-tight tracking-[0.08em] uppercase">
                      {current?.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {current?.artist}
                      {current?.genre ? ` · ${current.genre}` : ""}
                      {current?.bpm ? ` · ${current.bpm} BPM` : ""}
                    </p>
                  </div>
                </div>

                {/* Controls + playlist */}
                <div className="flex flex-col">
                  <div className="border-b border-border/60 p-6">
                    <Waveform
                      seed={current?.id ?? 1}
                      progress={progress}
                      playing={playing}
                      onSeek={handleSeek}
                    />

                    <div className="font-mono mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Previous track"
                          onClick={() => goTo(currentIndex - 1)}>
                          <SkipBack className="size-5" />
                        </Button>
                        <Button
                          size="icon"
                          aria-label={playing ? "Pause" : "Play"}
                          onClick={togglePlay}
                          className="glow-gold size-12 rounded-full bg-gold text-primary-foreground hover:bg-gold-soft">
                          {playing ? (
                            <Pause className="size-5" />
                          ) : (
                            <Play className="size-5 translate-x-px" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Next track"
                          onClick={() => goTo(currentIndex + 1)}>
                          <SkipForward className="size-5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={muted ? "Unmute" : "Mute"}
                          onClick={() => setMuted(value => !value)}>
                          {muted ? (
                            <VolumeX className="size-4.5" />
                          ) : (
                            <Volume2 className="size-4.5" />
                          )}
                        </Button>
                        <Slider
                          value={[muted ? 0 : Math.round(volume * 100)]}
                          max={100}
                          step={1}
                          className="w-28"
                          aria-label="Volume"
                          onValueChange={value => {
                            setVolume((value[0] ?? 0) / 100);
                            setMuted((value[0] ?? 0) === 0);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Playlist */}
                  <ul className="thin-scroll max-h-[22rem] divide-y divide-border/50 overflow-y-auto">
                    {list.map((track, index) => {
                      const isCurrent = index === currentIndex;
                      return (
                        <li key={track.id}>
                          <button
                            type="button"
                            onClick={() => goTo(index)}
                            className={cn(
                              "group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150",
                              isCurrent ? "bg-gold/8" : "hover:bg-secondary/50",
                            )}>
                            <span className="font-mono w-6 shrink-0 text-center text-xs text-muted-foreground">
                              {isCurrent && playing ? (
                                <span className="anim-eq inline-flex h-3.5 items-end gap-[2px]">
                                  <span className="h-full w-[2px] origin-bottom bg-gold" />
                                  <span
                                    className="h-full w-[2px] origin-bottom bg-gold"
                                    style={{ animationDelay: "150ms" }}
                                  />
                                  <span
                                    className="h-full w-[2px] origin-bottom bg-gold"
                                    style={{ animationDelay: "300ms" }}
                                  />
                                </span>
                              ) : (
                                index + 1
                              )}
                            </span>

                            <span className="size-10 shrink-0 overflow-hidden rounded">
                              <CoverArt
                                title={track.title}
                                coverUrl={track.coverUrl}
                                variant={track.coverVariant}
                                size="sm"
                              />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "block truncate text-sm font-medium",
                                  isCurrent ? "text-gold" : "text-foreground",
                                )}>
                                {track.title}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {track.artist}
                                {track.genre ? ` · ${track.genre}` : ""}
                              </span>
                            </span>

                            <span className="font-mono shrink-0 text-xs text-muted-foreground">
                              {track.durationSeconds
                                ? formatTime(track.durationSeconds)
                                : "--:--"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <audio
          ref={audioRef}
          preload="metadata"
          onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={event => {
            const value = event.currentTarget.duration;
            if (Number.isFinite(value)) setDuration(value);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => goTo(currentIndex + 1)}
          className="hidden"
        />
      </section>

      {isOwner && (
        <TrackAdminPanel open={adminOpen} onOpenChange={setAdminOpen} tracks={list} />
      )}
    </SiteLayout>
  );
}
