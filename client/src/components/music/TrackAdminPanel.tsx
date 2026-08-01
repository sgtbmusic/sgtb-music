import { CoverArt } from "@/components/music/CoverArt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fileToBase64, formatBytes, MAX_UPLOAD_BYTES } from "@/lib/fileToBase64";
import { trpc } from "@/lib/trpc";
import type { Track } from "@shared/types";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Music4,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type TrackAdminPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tracks: Track[];
};

export function TrackAdminPanel({ open, onOpenChange, tracks }: TrackAdminPanelProps) {
  const utils = trpc.useUtils();
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("SGTB Music");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [audio, setAudio] = useState<{
    url: string;
    key: string;
    mimeType: string;
    fileName: string;
    duration: number | null;
  } | null>(null);
  const [cover, setCover] = useState<{ url: string; key: string } | null>(null);
  const [busy, setBusy] = useState<"audio" | "cover" | null>(null);

  const audioUpload = trpc.uploads.audio.useMutation();
  const imageUpload = trpc.uploads.image.useMutation();

  const createTrack = trpc.tracks.create.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
      toast.success("Track added to the playlist");
      setTitle("");
      setGenre("");
      setBpm("");
      setAudio(null);
      setCover(null);
    },
    onError: error => toast.error(error.message),
  });

  const removeTrack = trpc.tracks.remove.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
      toast.success("Track removed");
    },
    onError: error => toast.error(error.message),
  });

  const reorderTracks = trpc.tracks.reorder.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const updateTrack = trpc.tracks.update.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
      toast.success("Cover updated");
    },
    onError: error => toast.error(error.message),
  });

  async function readDuration(file: File) {
    return new Promise<number | null>(resolve => {
      const url = URL.createObjectURL(file);
      const element = new Audio();
      element.preload = "metadata";
      element.onloadedmetadata = () => {
        const value = Number.isFinite(element.duration)
          ? Math.round(element.duration)
          : null;
        URL.revokeObjectURL(url);
        resolve(value);
      };
      element.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      element.src = url;
    });
  }

  async function handleAudioPick(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`${file.name} is ${formatBytes(file.size)}. Limit is 60MB.`);
      return;
    }
    setBusy("audio");
    try {
      const [dataBase64, duration] = await Promise.all([
        fileToBase64(file),
        readDuration(file),
      ]);
      const contentType =
        file.type || (file.name.toLowerCase().endsWith(".wav") ? "audio/wav" : "audio/mpeg");
      const result = await audioUpload.mutateAsync({
        fileName: file.name,
        contentType,
        dataBase64,
      });
      setAudio({
        url: result.url,
        key: result.key,
        mimeType: contentType,
        fileName: file.name,
        duration,
      });
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
      toast.success("Audio uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Audio upload failed");
    } finally {
      setBusy(null);
      if (audioRef.current) audioRef.current.value = "";
    }
  }

  async function handleCoverPick(file: File | undefined, trackId?: number) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Image is ${formatBytes(file.size)}. Limit is 60MB.`);
      return;
    }
    setBusy("cover");
    try {
      const dataBase64 = await fileToBase64(file);
      const result = await imageUpload.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        dataBase64,
        folder: "covers",
      });
      if (trackId) {
        updateTrack.mutate({ id: trackId, coverUrl: result.url, coverKey: result.key });
      } else {
        setCover({ url: result.url, key: result.key });
        toast.success("Cover uploaded");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cover upload failed");
    } finally {
      setBusy(null);
      if (coverRef.current) coverRef.current.value = "";
    }
  }

  function handleCreate() {
    if (!audio) {
      toast.error("Upload an MP3 or WAV first");
      return;
    }
    if (!title.trim()) {
      toast.error("Give the track a title");
      return;
    }
    const parsedBpm = bpm.trim() ? Number.parseInt(bpm, 10) : null;
    createTrack.mutate({
      title: title.trim(),
      artist: artist.trim() || "SGTB Music",
      genre: genre.trim() || null,
      bpm: Number.isFinite(parsedBpm) ? parsedBpm : null,
      audioUrl: audio.url,
      audioKey: audio.key,
      mimeType: audio.mimeType,
      coverUrl: cover?.url ?? null,
      coverKey: cover?.key ?? null,
      coverVariant: tracks.length % 6,
      durationSeconds: audio.duration,
    });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...tracks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderTracks.mutate({ orderedIds: next.map(track => track.id) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase">
            Playlist Manager
          </DialogTitle>
          <DialogDescription>
            Upload MP3 or WAV masters, set titles and cover art, and control the order
            listeners hear. Visible to you only.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1">
              Upload track
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">
              Manage playlist ({tracks.length})
            </TabsTrigger>
          </TabsList>

          {/* ---------- Upload ---------- */}
          <TabsContent value="upload" className="space-y-5 pt-5">
            <input
              ref={audioRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,.mp3,.wav"
              className="hidden"
              onChange={event => void handleAudioPick(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => audioRef.current?.click()}
              disabled={busy === "audio"}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-6 py-8 text-center transition-colors duration-150 hover:border-gold/50 hover:bg-card/70">
              {busy === "audio" ? (
                <Loader2 className="size-7 animate-spin text-gold" />
              ) : (
                <UploadCloud className="size-7 text-gold" />
              )}
              <span className="font-condensed text-base tracking-[0.14em] uppercase">
                {audio ? audio.fileName : "Select MP3 or WAV"}
              </span>
              <span className="text-xs text-muted-foreground">
                Up to 60MB per file{audio?.duration ? ` · ${audio.duration}s detected` : ""}
              </span>
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="track-title">Title</Label>
                <Input
                  id="track-title"
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  placeholder="Song title"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="track-artist">Artist</Label>
                <Input
                  id="track-artist"
                  value={artist}
                  onChange={event => setArtist(event.target.value)}
                  placeholder="SGTB Music"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="track-genre">Genre</Label>
                <Input
                  id="track-genre"
                  value={genre}
                  onChange={event => setGenre(event.target.value)}
                  placeholder="R&B / Pop / Drill"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="track-bpm">BPM</Label>
                <Input
                  id="track-bpm"
                  value={bpm}
                  inputMode="numeric"
                  onChange={event => setBpm(event.target.value)}
                  placeholder="140"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-border bg-card/40 p-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-md">
                <CoverArt
                  title={title || "Untitled"}
                  coverUrl={cover?.url}
                  variant={tracks.length % 6}
                  size="sm"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Cover art</p>
                <p className="text-xs text-muted-foreground">
                  Optional. A generated template is used when empty.
                </p>
              </div>
              <input
                ref={coverRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="hidden"
                onChange={event => void handleCoverPick(event.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy === "cover"}
                onClick={() => coverRef.current?.click()}>
                <ImagePlus className="mr-1.5 size-4" />
                {cover ? "Replace" : "Upload"}
              </Button>
            </div>

            <Button
              type="button"
              className="font-condensed w-full bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft"
              disabled={createTrack.isPending || busy !== null}
              onClick={handleCreate}>
              {createTrack.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Add to playlist
            </Button>
          </TabsContent>

          {/* ---------- Manage ---------- */}
          <TabsContent value="manage" className="pt-5">
            {tracks.length === 0 ? (
              <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
                <Music4 className="size-7 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No tracks yet. Upload your first master.
                </p>
              </div>
            ) : (
              <ul className="thin-scroll max-h-[26rem] space-y-2 overflow-y-auto pr-1">
                {tracks.map((track, index) => (
                  <li
                    key={track.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-2.5">
                    <span className="font-mono w-6 text-center text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="size-11 shrink-0 overflow-hidden rounded">
                      <CoverArt
                        title={track.title}
                        coverUrl={track.coverUrl}
                        variant={track.coverVariant}
                        size="sm"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{track.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {track.artist}
                        {track.genre ? ` · ${track.genre}` : ""}
                        {track.bpm ? ` · ${track.bpm} BPM` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Move up"
                        disabled={index === 0 || reorderTracks.isPending}
                        onClick={() => move(index, -1)}>
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Move down"
                        disabled={index === tracks.length - 1 || reorderTracks.isPending}
                        onClick={() => move(index, 1)}>
                        <ArrowDown className="size-4" />
                      </Button>
                      <label className="inline-flex">
                        <span className="sr-only">Replace cover for {track.title}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/avif"
                          className="hidden"
                          onChange={event =>
                            void handleCoverPick(event.target.files?.[0], track.id)
                          }
                        />
                        <span className="hover:bg-accent inline-grid size-9 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:text-foreground">
                          <ImagePlus className="size-4" />
                        </span>
                      </label>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete track"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={removeTrack.isPending}
                        onClick={() => removeTrack.mutate({ id: track.id })}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
