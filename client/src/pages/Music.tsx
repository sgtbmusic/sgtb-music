import { CoverArt } from "@/components/music/CoverArt";
import { TrackAdminPanel } from "@/components/music/TrackAdminPanel";
import { Waveform } from "@/components/music/Waveform";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOwner } from "@/hooks/useOwner";
import { IS_STATIC_DEPLOYMENT } from "@/lib/runtime";
import { formatTime } from "@/lib/site";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  Disc3,
  Music4,
  Pause,
  Radio,
  Sparkles,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PlaylistEmptyStateProps = {
  isOwner: boolean;
  onManage: () => void;
};

function PlaylistEmptyState({ isOwner, onManage }: PlaylistEmptyStateProps) {
  return (
    <div
      data-testid="playlist-empty-state"
      role="status"
      aria-live="polite"
      className="glass-panel relative isolate grid min-h-[22rem] place-items-center overflow-hidden rounded-2xl border border-gold/15 px-5 py-14 text-center sm:min-h-[26rem] sm:px-8 sm:py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,oklch(0.78_0.14_85/0.14),transparent_38%),linear-gradient(135deg,transparent_30%,oklch(0.72_0.16_190/0.05),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent"
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <div className="relative">
          <span className="grid size-16 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold shadow-[0_0_36px_oklch(0.78_0.14_85/0.14)] sm:size-[4.5rem]">
            <Music4 className="size-7 sm:size-8" aria-hidden />
          </span>
          <span className="absolute -top-1 -right-2 grid size-7 place-items-center rounded-full border border-neon/25 bg-ink/90 text-neon shadow-lg">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
        </div>

        <div
          aria-hidden
          className="anim-eq mt-6 inline-flex h-4 items-end gap-1 rounded-full border border-white/8 bg-white/[0.025] px-4 py-1.5"
        >
          {[0, 1, 2, 3, 4].map(index => (
            <span
              key={index}
              className="w-[3px] origin-bottom rounded-full bg-gold"
              style={{
                height: `${40 + ((index * 23) % 60)}%`,
                animationDelay: `${index * 110}ms`,
              }}
            />
          ))}
        </div>

        <p className="font-mono mt-5 text-[0.62rem] tracking-[0.28em] text-neon uppercase">
          The next release is in the lab
        </p>
        <h2 className="font-condensed mt-3 text-2xl tracking-[0.12em] uppercase sm:text-3xl">
          Playlist is being prepared
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {isOwner
            ? "Your catalog is ready for its first release. Open the playlist manager to add an MP3 or WAV master."
            : "New SGTB Music records are being finished for release. The player will come alive as soon as the first master lands."}
        </p>

        {isOwner ? (
          <Button
            className="font-condensed mt-6 bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft"
            onClick={onManage}
          >
            <Music4 className="mr-1.5 size-4" aria-hidden />
            Upload a track
          </Button>
        ) : (
          <div className="mt-6 flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-3.5 py-2 text-xs text-muted-foreground">
            <Radio className="size-3.5 text-gold" aria-hidden />
            <span>Release-quality masters coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Music() {
  const { isOwner } = useOwner();
  const { data: tracks } = trpc.tracks.list.useQuery(undefined, {
    enabled: !IS_STATIC_DEPLOYMENT,
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

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
    [list.length]
  );

  const togglePlay = useCallback(() => {
    const element = audioRef.current;
    if (!element || !current) return;
    if (element.paused) {
      void element
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
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
              Finished records from the SGTB pipeline. Press play, scrub the
              waveform, and hear what humanized Suno production sounds like at
              release quality.
            </p>
          </div>

          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="font-condensed border-gold/40 tracking-[0.16em] text-gold uppercase hover:bg-gold/10"
                  onClick={() => setAdminOpen(true)}
                >
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
          {list.length === 0 ? (
            <PlaylistEmptyState
              isOwner={isOwner}
              onManage={() => setAdminOpen(true)}
            />
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
                          onClick={() => goTo(currentIndex - 1)}
                        >
                          <SkipBack className="size-5" />
                        </Button>
                        <Button
                          size="icon"
                          aria-label={playing ? "Pause" : "Play"}
                          onClick={togglePlay}
                          className="glow-gold size-12 rounded-full bg-gold text-primary-foreground hover:bg-gold-soft"
                        >
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
                          onClick={() => goTo(currentIndex + 1)}
                        >
                          <SkipForward className="size-5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={muted ? "Unmute" : "Mute"}
                          onClick={() => setMuted(value => !value)}
                        >
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
                              isCurrent ? "bg-gold/8" : "hover:bg-secondary/50"
                            )}
                          >
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
                                  isCurrent ? "text-gold" : "text-foreground"
                                )}
                              >
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
          onTimeUpdate={event =>
            setCurrentTime(event.currentTarget.currentTime)
          }
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
        <TrackAdminPanel
          open={adminOpen}
          onOpenChange={setAdminOpen}
          tracks={list}
        />
      )}
    </SiteLayout>
  );
}
