import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";

export type PlayerTrackKind = "track" | "podcast" | "feed";

export type PlayerTrack = {
  id: number | string;
  title: string;
  artist?: string | null;
  audioUrl: string;
  coverUrl?: string | null;
  coverVariant?: number | null;
  durationSeconds?: number | null;
  genre?: string | null;
  bpm?: number | null;
  kind?: PlayerTrackKind;
};

type AudioPlayerContextValue = {
  current: PlayerTrack | null;
  playlist: PlayerTrack[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playTrack: (track: PlayerTrack) => void;
  toggleTrack: (track: PlayerTrack) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isCurrent: (track: Pick<PlayerTrack, "id" | "kind">) => boolean;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function playerTrackKey(track: Pick<PlayerTrack, "id" | "kind">) {
  return `${track.kind ?? "track"}:${String(track.id)}`;
}

export function requestTrackPlayback(track: PlayerTrack) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PlayerTrack>("sgtb:play-track", { detail: track }));
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const { data: tracks = [] } = trpc.tracks.list.useQuery();
  const [externalTrack, setExternalTrack] = useState<PlayerTrack | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlist = useMemo<PlayerTrack[]>(() => {
    const catalogTracks = tracks.map(track => ({ ...track, kind: "track" as const }));
    if (!externalTrack) return catalogTracks;
    return [externalTrack, ...catalogTracks.filter(track => playerTrackKey(track) !== playerTrackKey(externalTrack))];
  }, [externalTrack, tracks]);

  const current = playlist.find(track => playerTrackKey(track) === currentKey) ?? playlist[0] ?? null;

  useEffect(() => {
    if (!currentKey && playlist[0]) setCurrentKey(playerTrackKey(playlist[0]));
  }, [currentKey, playlist]);

  const playTrack = useCallback((track: PlayerTrack) => {
    if (!track.audioUrl) return;
    const normalized = { ...track, kind: track.kind ?? "track" };
    const isCatalogTrack = normalized.kind === "track" && tracks.some(track => track.id === normalized.id);
    setExternalTrack(isCatalogTrack ? null : normalized);
    setCurrentKey(playerTrackKey(normalized));
    setIsPlaying(true);
  }, [tracks]);

  const toggleTrack = useCallback((track: PlayerTrack) => {
    const normalized = { ...track, kind: track.kind ?? "track" };
    if (current && playerTrackKey(current) === playerTrackKey(normalized)) {
      setIsPlaying(value => !value);
      return;
    }
    playTrack(normalized);
  }, [current, playTrack]);

  useEffect(() => {
    const handleTrackRequest = (event: Event) => {
      const requestedTrack = (event as CustomEvent<PlayerTrack>).detail;
      if (requestedTrack?.audioUrl) playTrack(requestedTrack);
    };
    window.addEventListener("sgtb:play-track", handleTrackRequest);
    return () => window.removeEventListener("sgtb:play-track", handleTrackRequest);
  }, [playTrack]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element || !current) return;
    const nextKey = playerTrackKey(current);
    if (element.dataset.trackKey !== nextKey) {
      element.dataset.trackKey = nextKey;
      element.src = current.audioUrl;
      element.load();
      setCurrentTime(0);
      setDuration(current.durationSeconds && current.durationSeconds > 0 ? current.durationSeconds : 180);
    }
    if (isPlaying && element.paused) {
      void element.play().catch(() => setIsPlaying(false));
    }
  }, [current, isPlaying]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    element.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const togglePlay = useCallback(() => {
    const element = audioRef.current;
    if (!element || !current) return;
    if (element.paused) {
      void element.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      element.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const moveTo = useCallback((offset: number) => {
    if (!playlist.length || !current) return;
    const index = playlist.findIndex(track => playerTrackKey(track) === playerTrackKey(current));
    const nextIndex = (index + offset + playlist.length) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (!nextTrack) return;
    setCurrentKey(playerTrackKey(nextTrack));
    setIsPlaying(true);
  }, [current, playlist]);

  const seek = useCallback((seconds: number) => {
    const element = audioRef.current;
    if (!element || !Number.isFinite(seconds)) return;
    element.currentTime = Math.max(0, seconds);
    setCurrentTime(element.currentTime);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const safeVolume = Math.min(1, Math.max(0, nextVolume));
    setVolumeState(safeVolume);
    setMuted(safeVolume === 0);
  }, []);

  const value = useMemo<AudioPlayerContextValue>(() => ({
    current,
    playlist,
    currentTime,
    duration,
    isPlaying,
    volume,
    muted,
    playTrack,
    toggleTrack,
    togglePlay,
    next: () => moveTo(1),
    previous: () => moveTo(-1),
    seek,
    setVolume,
    toggleMute: () => setMuted(value => !value),
    isCurrent: track => Boolean(current && playerTrackKey(current) === playerTrackKey(track)),
  }), [current, playlist, currentTime, duration, isPlaying, volume, muted, playTrack, toggleTrack, togglePlay, moveTo, seek, setVolume]);

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={event => {
          const loadedDuration = event.currentTarget.duration;
          if (Number.isFinite(loadedDuration) && loadedDuration > 0) setDuration(loadedDuration);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => moveTo(1)}
        className="hidden"
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
  return context;
}
