import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Radio, Play, Pause, Plus, Trash2, Mic, Sparkles, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/fileToBase64";
import { cn } from "@/lib/utils";

export function SunoPodcastSection() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: episodes = [], isLoading } = trpc.sunoEpisodes.list.useQuery();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [host, setHost] = useState("Rosie Nguyen & Guests");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isAdmin = user && user.role === "admin";

  const createMutation = trpc.sunoEpisodes.create.useMutation({
    onSuccess: () => {
      toast.success("Podcast episode published successfully.");
      utils.sunoEpisodes.list.invalidate();
      setAddOpen(false);
      setTitle("");
      setDescription("");
      setAudioFile(null);
      setUploading(false);
    },
    onError: (err) => {
      toast.error(`Failed to publish episode: ${err.message}`);
      setUploading(false);
    },
  });

  const removeMutation = trpc.sunoEpisodes.remove.useMutation({
    onSuccess: () => {
      toast.success("Episode removed.");
      utils.sunoEpisodes.list.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to remove episode: ${err.message}`);
    },
  });

  async function handleAddEpisode(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !audioFile) {
      toast.error("Please provide an episode title and an audio file.");
      return;
    }

    setUploading(true);
    try {
      const base64Data = await fileToBase64(audioFile);
      const res = await utils.client.uploads.audio.mutate({
        fileName: audioFile.name,
        contentType: audioFile.type || "audio/mpeg",
        dataBase64: base64Data,
      });

      createMutation.mutate({
        title,
        host,
        description,
        audioUrl: res.url,
        audioKey: res.key,
        durationSeconds: 180,
      });
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
    }
  }

  const activeEpisode = episodes.find((ep) => ep.id === activeId) || episodes[0];

  function togglePlay(id: number, url: string) {
    if (activeId === id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setActiveId(id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }

  return (
    <section className="mt-20 border-t border-white/10 pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold-soft">
            Suno Business Audio Broadcast
          </Badge>
          <h2 className="mt-4 font-display text-4xl uppercase text-white sm:text-5xl">
            Podcasts & <span className="text-gold-gradient">Radio Talks.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Exclusive executive briefings, creator growth discussions, and insider sessions hosted by Rosie Nguyen and Suno leadership.
          </p>
        </div>

        {isAdmin && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider">
                <Plus className="mr-2 size-4" /> Upload Episode (Admin)
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel glow-gold max-w-lg border-gold/30 bg-background/95 p-6 backdrop-blur-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl uppercase text-white">Publish Suno Broadcast</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">Upload MP3/WAV podcast episodes or radio talks for the Suno Business page.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEpisode} className="mt-4 space-y-4">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-white">Episode Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ep 04: The Future of Creator Economics" className="mt-1.5 border-white/15 bg-black/40 text-white" required />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-white">Host / Speaker</Label>
                  <Input value={host} onChange={(e) => setHost(e.target.value)} className="mt-1.5 border-white/15 bg-black/40 text-white" required />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-white">Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Summary of the conversation..." className="mt-1.5 border-white/15 bg-black/40 text-white" rows={3} />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-white">Audio File (MP3 / WAV)</Label>
                  <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="mt-1.5 border-white/15 bg-black/40 text-white file:text-gold" required />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="border-white/15 text-muted-foreground">Cancel</Button>
                  <Button type="submit" disabled={uploading} className="bg-gold text-[#17120a] hover:bg-gold-soft">
                    {uploading ? "Uploading to S3..." : "Publish Episode"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {isLoading ? (
        <div className="glass-panel mt-8 rounded-3xl p-8 text-center font-mono text-xs uppercase text-muted-foreground">Loading audio broadcasts...</div>
      ) : episodes.length > 0 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main sleek podcast player */}
          <div className="glass-panel glow-gold rounded-3xl border border-gold/30 p-6 sm:p-8 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                  <Radio className="size-3.5 animate-pulse text-neon" /> Live Broadcast
                </span>
                <span className="font-mono text-[10px] text-gold">Suno Radio</span>
              </div>
              <div className="mt-6 flex size-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <Mic className="size-8" />
              </div>
              <h3 className="mt-6 font-display text-2xl uppercase text-white line-clamp-2">{activeEpisode?.title || "Select an episode"}</h3>
              <p className="mt-1.5 text-xs text-gold">{activeEpisode?.host}</p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground line-clamp-3">{activeEpisode?.description || "Select a podcast or radio talk from the list to begin streaming."}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-gold" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">SGTB Master Stream</span>
              </div>
              {activeEpisode && (
                <Button
                  type="button"
                  onClick={() => togglePlay(activeEpisode.id, activeEpisode.audioUrl)}
                  className="size-12 rounded-full bg-gold text-[#17120a] hover:bg-gold-soft p-0 flex items-center justify-center shadow-[0_0_20px_rgba(244,191,55,0.4)]"
                >
                  {isPlaying && activeId === activeEpisode.id ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
                </Button>
              )}
            </div>
          </div>

          {/* Episode playlist */}
          <div className="grid gap-4 lg:col-span-2">
            {episodes.map((ep, idx) => {
              const isCurrent = activeId === ep.id;
              return (
                <div key={ep.id} className={cn("glass-panel rounded-2xl border p-5 flex items-center justify-between gap-4 transition", isCurrent ? "border-gold/50 bg-gold/5" : "border-white/10 hover:border-white/20")}>
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      onClick={() => togglePlay(ep.id, ep.audioUrl)}
                      className={cn("grid size-12 shrink-0 place-items-center rounded-xl transition", isCurrent && isPlaying ? "bg-neon text-black" : "bg-gold/10 text-gold hover:bg-gold/20")}
                    >
                      {isCurrent && isPlaying ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase text-muted-foreground">Ep #{idx + 1}</span>
                        <span className="font-mono text-[10px] text-gold">{ep.host}</span>
                      </div>
                      <h4 className="font-display text-lg uppercase text-white truncate">{ep.title}</h4>
                      {ep.description && <p className="text-xs text-muted-foreground truncate">{ep.description}</p>}
                    </div>
                  </div>

                  {isAdmin && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMutation.mutate({ id: ep.id })}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Remove episode"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-panel mt-8 rounded-3xl p-12 text-center">
          <Sparkles className="mx-auto size-8 text-gold" />
          <h3 className="mt-4 font-display text-2xl uppercase text-white">No Episodes Published</h3>
          <p className="mt-2 text-sm text-muted-foreground">Admin and Suno Rep accounts can upload podcast episodes and radio talks using the button above.</p>
        </div>
      )}
    </section>
  );
}
