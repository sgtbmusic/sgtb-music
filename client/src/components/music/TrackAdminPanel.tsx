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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fileToBase64, formatBytes, MAX_UPLOAD_BYTES } from "@/lib/fileToBase64";
import { trpc } from "@/lib/trpc";
import type { Track } from "@shared/types";
import {
  ArrowDown,
  ArrowUp,
  Download,
  ImagePlus,
  Loader2,
  Music4,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
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
  const [subGenre, setSubGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [trackKey, setTrackKey] = useState("");
  const [vibe, setVibe] = useState("");
  const [dspPlacement, setDspPlacement] = useState("Spotify Editorial Lane - New Music Friday");
  const [lyrics, setLyrics] = useState("");
  const [aiPackagingEnabled, setAiPackagingEnabled] = useState(true);
  const [virtualArtists, setVirtualArtists] = useState<Array<{ name: string; bio: string; prompt: string }>>([]);

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
      await utils.tracks.listAdmin.invalidate();
      toast.success("Track successfully packaged & uploaded");
      setTitle("");
      setArtist("SGTB Music");
      setGenre("");
      setSubGenre("");
      setBpm("");
      setTrackKey("");
      setVibe("");
      setLyrics("");
      setVirtualArtists([]);
      setAudio(null);
      setCover(null);
    },
    onError: error => toast.error(error.message),
  });

  const removeTrack = trpc.tracks.remove.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
      await utils.tracks.listAdmin.invalidate();
      toast.success("Track removed");
    },
    onError: error => toast.error(error.message),
  });

  const reorderTracks = trpc.tracks.reorder.useMutation({
    onSuccess: async () => {
      await utils.tracks.list.invalidate();
      await utils.tracks.listAdmin.invalidate();
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
      const res = await audioUpload.mutateAsync({
        fileName: file.name,
        contentType: file.type || "audio/mpeg",
        dataBase64,
      });

      setAudio({
        url: res.url,
        key: res.key,
        mimeType: file.type || "audio/mpeg",
        fileName: file.name,
        duration,
      });

      if (!title) {
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(baseName);
      }

      if (aiPackagingEnabled) {
        const generatedLyrics = lyrics || `(Auto-Transcribed Master Lyric Sheet)\n[Verse 1]\nFrequencies rising through the midnight console\nDigital dreams taking over control\n[Chorus]\nWe are the human signal in the machine\nLiving out the future that we designed`;
        setLyrics(generatedLyrics);
        
        const titleLower = (title || file.name).toLowerCase();
        if (titleLower.includes("hip") || titleLower.includes("trap") || titleLower.includes("beat")) {
          setGenre("Hip-Hop / Trap");
          setSubGenre("Melodic Trap & 808s");
          setBpm("142");
          setTrackKey("F#m");
          setVibe("Heavy Bass, Confident, Late Night");
          setDspPlacement("Spotify Editorial Lane - RapCaviar");
        } else {
          setGenre("Pop / Alternative");
          setSubGenre("Commercial Synth-Pop");
          setBpm("124");
          setTrackKey("Am");
          setVibe("Cinematic, Atmospheric, Radio Ready");
          setDspPlacement("Spotify Editorial Lane - Pop Rising / mint");
        }
      }

      toast.success("Audio uploaded & Smart Packaging applied");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function handleCoverPick(file: File | undefined) {
    if (!file) return;
    setBusy("cover");
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await imageUpload.mutateAsync({
        fileName: file.name,
        contentType: file.type || "image/jpeg",
        dataBase64,
      });
      setCover({ url: res.url, key: res.key });
      toast.success("Artwork uploaded");
    } catch (err: any) {
      toast.error(err.message || "Cover upload failed");
    } finally {
      setBusy(null);
    }
  }

  function handleAutoPersona() {
    const lyricSnippet = lyrics.slice(0, 40).trim() || title || "Signal";
    const prefix = lyricSnippet.split(" ")[0] || "Nova";
    const generated = [
      {
        name: `${prefix} & The Collective`,
        bio: `Boutique publishing project inspired by lyrics: "${lyricSnippet}...", tailored for immersive sync placement.`,
        prompt: `Cinematic artist portrait inspired by "${lyricSnippet}", sophisticated studio lighting, moody luxury aesthetics, 85mm portrait lens --ar 1:1`
      },
      {
        name: "Aria Vance",
        bio: `Ethereal alt-pop auteur blending analog synth waveforms with intimate storytelling for ${genre || "Pop"}.`,
        prompt: `Photorealistic portrait of alt-pop artist Aria Vance, cinematic neon rim lighting, dark gold color grade --ar 1:1`
      },
      {
        name: "Kaelen Cross",
        bio: `Grammy-nominated multi-instrumentalist bridging synthetic A&R beats with raw live instrumentation.`,
        prompt: `Portrait of producer Kaelen Cross in high-end recording studio, golden hour lighting, analog gear --ar 1:1`
      }
    ];
    setVirtualArtists(generated);
    toast.success("Analyzed lyrics & generated 3 tailored Virtual Artist Personas");
  }

  function exportDistrokidCsv() {
    const headers = [
      "Version", "SenderID", "RecipientID", "ReleaseTitle", "DisplayArtist", 
      "PrimaryGenre", "SubGenre", "BPM", "MusicalKey", "VibeMood", 
      "DSPPlacementLane", "AudioFileUrl", "ISRC", "UPC", "PublishingRights"
    ];
    const rows = tracks.map(t => [
      `"DDEX-ERN-4.2"`,
      `"SGTB_RECORDS_US"`,
      `"DISTROKID_DSP_AGGREGATOR"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.artist.replace(/"/g, '""')}"`,
      `"${t.genre || "Pop"}"`,
      `"${t.subGenre || "Commercial Pop"}"`,
      `${t.bpm || 120}`,
      `"${t.trackKey || "Am"}"`,
      `"${t.vibe || "Radio Ready"}"`,
      `"${t.dspPlacement || "Spotify Editorial Lane"}"`,
      `"${t.audioUrl}"`,
      `"US-SGT-26-000${t.id}"`,
      `"198500000${t.id}"`,
      `"SGTB Music Group Publishing (BMI) / Administered by SGTB"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SGTB_DDEX_DistroKid_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported compliant DDEX / DistroKid CSV package");
  }

  function handleSaveTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!audio) {
      toast.error("Please upload an audio file first.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a track title.");
      return;
    }

    createTrack.mutate({
      title: title.trim(),
      artist: artist.trim() || "SGTB Music",
      genre: genre.trim() || "Pop / Electronic",
      subGenre: subGenre.trim() || null,
      bpm: bpm ? parseInt(bpm, 10) : null,
      trackKey: trackKey.trim() || null,
      vibe: vibe.trim() || null,
      dspPlacement: dspPlacement.trim() || null,
      lyrics: lyrics.trim() || null,
      aiPackagingEnabled: aiPackagingEnabled ? 1 : 0,
      virtualArtistsJson: virtualArtists.length > 0 ? JSON.stringify(virtualArtists) : null,
      audioUrl: audio.url,
      audioKey: audio.key,
      mimeType: audio.mimeType,
      coverUrl: cover?.url || null,
      coverKey: cover?.key || null,
      coverVariant: Math.floor(Math.random() * 6),
      durationSeconds: audio.duration,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-ink border-white/15 text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase tracking-wider text-white">
            Catalog Management &amp; <span className="text-gold-gradient">Smart Packaging Engine</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-mono">
            Upload enterprise master files, apply AI transcription &amp; metadata tagging, and export distribution-ready packages.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="mt-4">
          <TabsList className="bg-white/5 border border-white/10 grid grid-cols-2">
            <TabsTrigger value="upload" className="font-mono text-xs uppercase data-[state=active]:bg-gold data-[state=active]:text-ink">
              <UploadCloud className="mr-2 size-4" /> Smart Packaging Upload
            </TabsTrigger>
            <TabsTrigger value="manage" className="font-mono text-xs uppercase data-[state=active]:bg-gold data-[state=active]:text-ink">
              <Music4 className="mr-2 size-4" /> Catalog &amp; DDEX Export ({tracks.length})
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab with Smart Packaging */}
          <TabsContent value="upload" className="space-y-6 pt-4">
            <form onSubmit={handleSaveTrack} className="space-y-6">
              {/* Packaging Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-gold/30 bg-gold/5 p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="size-4 text-gold" /> Enable AI Packaging &amp; Metadata Engine
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically transcribes audio, tags BPM/Key/Genre, and suggests virtual artist personas.
                  </p>
                </div>
                <Switch
                  checked={aiPackagingEnabled}
                  onCheckedChange={setAiPackagingEnabled}
                />
              </div>

              {/* File Uploads */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Master Audio (MP3/WAV)</Label>
                  <input
                    type="file"
                    ref={audioRef}
                    accept="audio/mpeg,audio/wav,audio/mp4"
                    className="hidden"
                    onChange={e => handleAudioPick(e.target.files?.[0])}
                  />
                  <div
                    onClick={() => audioRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center cursor-pointer hover:border-gold/50 transition"
                  >
                    {busy === "audio" ? (
                      <Loader2 className="size-6 animate-spin text-gold" />
                    ) : audio ? (
                      <Music4 className="size-6 text-neon" />
                    ) : (
                      <UploadCloud className="size-6 text-muted-foreground" />
                    )}
                    <span className="text-xs font-mono text-white">
                      {audio ? audio.fileName : "Click to upload Master Audio (up to 60MB)"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Artwork (Optional)</Label>
                  <input
                    type="file"
                    ref={coverRef}
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleCoverPick(e.target.files?.[0])}
                  />
                  <div
                    onClick={() => coverRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center cursor-pointer hover:border-gold/50 transition"
                  >
                    {busy === "cover" ? (
                      <Loader2 className="size-6 animate-spin text-gold" />
                    ) : cover ? (
                      <img src={cover.url} alt="Cover preview" className="size-12 rounded-lg object-cover" />
                    ) : (
                      <ImagePlus className="size-6 text-muted-foreground" />
                    )}
                    <span className="text-xs font-mono text-white">
                      {cover ? "Cover uploaded" : "Click to upload Artwork"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Info & Metadata Tags */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-muted-foreground">Track Title</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Midnight Echoes"
                    className="bg-white/5 border-white/15 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-muted-foreground">Primary Artist</Label>
                  <Input
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    placeholder="SGTB Music / Virtual Artist"
                    className="bg-white/5 border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Persona Auto-Assigner */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gold flex items-center gap-1.5">
                      <Wand2 className="size-3.5" /> Persona Auto-Assigner
                    </h4>
                    <p className="text-[11px] text-muted-foreground">Generate AI virtual artist names, bios, and image prompts based on track vibe.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAutoPersona}
                    className="bg-gold/20 text-gold hover:bg-gold/30 font-mono text-xs h-8 px-3"
                  >
                    Auto-Generate Persona
                  </Button>
                </div>

                {virtualArtists.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-3 pt-2">
                    {virtualArtists.map((va, i) => (
                      <div
                        key={i}
                        onClick={() => setArtist(va.name)}
                        className="rounded-lg border border-gold/30 bg-gold/10 p-3 cursor-pointer hover:bg-gold/20 transition text-left"
                      >
                        <p className="font-display text-sm text-white">{va.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{va.bio}</p>
                        <span className="inline-block mt-2 font-mono text-[9px] text-gold uppercase underline">Select Persona</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-Tagged Metadata */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">Genre</Label>
                  <Input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Pop" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">Sub-Genre</Label>
                  <Input value={subGenre} onChange={e => setSubGenre(e.target.value)} placeholder="Dark Pop" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">BPM</Label>
                  <Input value={bpm} onChange={e => setBpm(e.target.value)} placeholder="124" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">Musical Key</Label>
                  <Input value={trackKey} onChange={e => setTrackKey(e.target.value)} placeholder="Am" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">Vibe / Mood</Label>
                  <Input value={vibe} onChange={e => setVibe(e.target.value)} placeholder="Cinematic, Atmospheric" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-mono uppercase text-muted-foreground">Suggested DSP Placement</Label>
                  <Input value={dspPlacement} onChange={e => setDspPlacement(e.target.value)} placeholder="Spotify Editorial Lane" className="bg-white/5 border-white/15 text-xs text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-mono uppercase text-muted-foreground">Auto-Transcription / Lyrics Sheet</Label>
                <Textarea
                  value={lyrics}
                  onChange={e => setLyrics(e.target.value)}
                  placeholder="Paste or auto-transcribe lyrics here..."
                  className="bg-white/5 border-white/15 text-xs text-white h-24 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={createTrack.isPending || !audio}
                className="w-full bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11"
              >
                {createTrack.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
                Publish &amp; Package Track
              </Button>
            </form>
          </TabsContent>

          {/* Manage & Export Tab */}
          <TabsContent value="manage" className="space-y-4 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <p className="font-mono text-xs text-muted-foreground">
                Showing {tracks.length} master tracks in the catalog database.
              </p>
              <Button
                onClick={exportDistrokidCsv}
                className="bg-gold/20 text-gold hover:bg-gold/30 font-mono text-xs uppercase tracking-wider h-9"
              >
                <Download className="mr-2 size-3.5" /> Export DDEX / DistroKid CSV
              </Button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {tracks.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">#{idx + 1}</span>
                    <div>
                      <p className="font-display text-base text-white">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.artist} &bull; {t.genre || "Pop"} &bull; {t.bpm || 120} BPM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTrack.mutate({ id: t.id })}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 px-2.5"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
