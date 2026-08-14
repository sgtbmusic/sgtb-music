import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  Play,
  Pause,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  Radio,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ExecutiveHQ() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: catalog = [], isLoading } = trpc.executive.listCatalog.useQuery();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Meeting form state
  const [executiveName, setExecutiveName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingMeeting, setSubmittingMeeting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isExecutiveAccess = isAuthenticated && user && (user.role === "admin" || user.role === "rep");

  const meetingMutation = trpc.executive.requestMeeting.useMutation({
    onSuccess: () => {
      toast.success("Executive meeting requested successfully. Our partnership team will contact you within 2 hours.");
      setExecutiveName("");
      setOrganization("");
      setEmail("");
      setRequestedDate("");
      setNotes("");
      setSubmittingMeeting(false);
    },
    onError: (err) => {
      toast.error(`Failed to submit meeting request: ${err.message}`);
      setSubmittingMeeting(false);
    },
  });

  function handleMeetingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!executiveName || !organization || !email || !requestedDate) {
      toast.error("Please fill in all required meeting fields.");
      return;
    }
    setSubmittingMeeting(true);
    meetingMutation.mutate({
      executiveName,
      organization,
      email,
      requestedDate,
      notes,
    });
  }

  function togglePlay(id: number, url: string) {
    if (playingId === id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setPlayingId(id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }

  const categories = ["All", "Suno Voice Persona", "Hybrid Stems (Pro Tools Mix)", "Live Sync Concepts"];
  const filteredCatalog = activeCategory === "All" ? catalog : catalog.filter(item => item.category === activeCategory);

  return (
    <SiteLayout>
      <div className="container max-w-7xl py-12 sm:py-20">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-12">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-gold/40 bg-gold/10 font-mono text-xs uppercase tracking-[0.26em] text-gold">
                <ShieldCheck className="mr-1.5 size-3.5 text-gold" /> Suno Executive Portal (/suno-hq)
              </Badge>
              {isExecutiveAccess && (
                <Badge variant="outline" className="border-neon/40 bg-neon/10 font-mono text-xs uppercase tracking-wider text-neon">
                  Verified Executive Access ({user?.role.toUpperCase()})
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none text-white sm:text-7xl">
              Executive Pitch &amp; <span className="text-gold-gradient">Asset Portal.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              Curated master songs, pristine Pro Tools hybrid stems, voice persona matrices, and real-time catalog metrics designed exclusively for Suno leadership and label partners.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            {!isAuthenticated ? (
              <Button
                type="button"
                onClick={() => startLogin()}
                className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11 px-6"
              >
                <User className="mr-2 size-4" /> Sign In for Full Access
              </Button>
            ) : (
              <div className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-2.5 font-mono text-xs text-gold">
                Logged in as {user?.name || user?.email}
              </div>
            )}
          </div>
        </div>

        {/* Access Gate Warning if not Admin/Rep (or allow demo preview) */}
        {!isExecutiveAccess && (
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-4 sm:p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-gold shrink-0" />
              <p className="text-sm text-muted-foreground">
                You are currently viewing in guest preview mode. Sign in with an authorized <span className="text-gold">Admin</span> or <span className="text-gold">Suno Rep</span> account for priority stem package downloads.
              </p>
            </div>
            {!isAuthenticated && (
              <Button type="button" onClick={() => startLogin()} size="sm" className="bg-gold text-[#17120a] shrink-0 font-mono text-xs uppercase">
                Sign In
              </Button>
            )}
          </div>
        )}

        {/* Section 1: Catalog Showcase Player */}
        <section className="mt-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Curated Assets</p>
              <h2 className="mt-2 font-display text-3xl uppercase text-white sm:text-4xl">Executive Catalog Showcase</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition",
                    activeCategory === cat
                      ? "bg-gold text-[#17120a] font-bold shadow-[0_0_15px_rgba(244,191,55,0.3)]"
                      : "border border-white/10 bg-white/5 text-muted-foreground hover:border-gold/30 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />

          {isLoading ? (
            <div className="glass-panel mt-8 rounded-3xl p-12 text-center font-mono text-xs uppercase text-muted-foreground">Loading executive catalog...</div>
          ) : filteredCatalog.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((item) => {
                const isCurrent = playingId === item.id;
                return (
                  <div key={item.id} className="glass-panel glow-gold group relative rounded-3xl border border-gold/20 p-6 flex flex-col justify-between transition hover:border-gold/50">
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-gold/30 bg-gold/10 font-mono text-[10px] uppercase text-gold">
                          {item.category}
                        </Badge>
                        <span className="font-mono text-xs text-neon font-bold">Hit Index: {item.hitPotential}%</span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl uppercase text-white group-hover:text-gold transition-colors">{item.title}</h3>
                      <p className="font-mono text-xs text-gold">{item.artist}</p>
                      <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.description}</p>
                      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-white/55">
                        <span>{item.genre}</span>
                        <span>•</span>
                        <span>{item.bpm} BPM</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                      <Button
                        type="button"
                        onClick={() => togglePlay(item.id, item.audioUrl)}
                        className={cn("flex-1 font-mono text-xs uppercase tracking-wider", isCurrent && isPlaying ? "bg-neon text-black" : "bg-gold text-[#17120a] hover:bg-gold-soft")}
                      >
                        {isCurrent && isPlaying ? <><Pause className="mr-2 size-4" /> Pause Master</> : <><Play className="mr-2 size-4" /> Play Master</>}
                      </Button>

                      {item.stemPackageUrl && (
                        <Button
                          asChild
                          variant="outline"
                          className="border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 hover:text-gold-soft font-mono text-xs"
                        >
                          <a href={item.stemPackageUrl} download target="_blank" rel="noopener noreferrer" title="Download WAV/Stems">
                            <Download className="size-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel mt-8 rounded-3xl p-12 text-center font-mono text-xs uppercase text-muted-foreground">No executive tracks found in this category.</div>
          )}
        </section>

        {/* Section 2: Interactive Proof of Concept & Pipeline */}
        <section className="mt-24">
          <div className="border-b border-white/10 pb-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-neon">Catalog Metrics &amp; Architecture</p>
            <h2 className="mt-2 font-display text-4xl uppercase text-white sm:text-5xl">Proof of Concept &amp; Pipeline</h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Visual Metrics Widget */}
            <div className="glass-panel glow-gold rounded-3xl border border-gold/30 p-6 sm:p-8 lg:col-span-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Scale &amp; Distribution</span>
                <h3 className="mt-2 font-display text-2xl uppercase text-white">Catalog Telemetry</h3>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Total Master Catalog</p>
                    <p className="mt-1 font-display text-3xl text-gold">1,420 <span className="text-xs font-mono text-white/50">Songs</span></p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Pro Tools Hybrid Stems</p>
                    <p className="mt-1 font-display text-3xl text-neon">100% <span className="text-xs font-mono text-white/50">Export Ready</span></p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Average Hit Potential Index</p>
                    <p className="mt-1 font-display text-3xl text-white">96.4% <span className="text-xs font-mono text-gold">A+ Tier</span></p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>Verified by SGTB A&amp;R</span>
                <span className="text-neon">Live Sync Ready</span>
              </div>
            </div>

            {/* Interactive Pipeline Graphic */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">End-to-End Workflow</span>
                <h3 className="mt-2 font-display text-2xl uppercase text-white">Analog Re-Tracking at Scale</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our proprietary studio architecture takes high-level Reference Demos through Analog Re-Tracking and delivers radio-ready masters for label and sync review.</p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                {[
                  { step: "01", name: "Raw Suno Draft", desc: "Initial text-to-audio prompt composition & seed curation" },
                  { step: "02", name: "Stem Separation", desc: "Isolated vocal, drum, bass, and synth extraction" },
                  { step: "03", name: "Pro Tools Hybrid Mix", desc: "Analog outboard processing, vocal tuning, & master bus" },
                  { step: "04", name: "DistroKid Ingestion", desc: "Global streaming deployment & sync publishing" },
                ].map((item, idx) => (
                  <div key={item.step} className="rounded-2xl border border-gold/20 bg-gold/5 p-4 relative flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-gold">{item.step}</span>
                      <h4 className="font-display text-lg uppercase text-white mt-2">{item.name}</h4>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                    </div>
                    {idx < 3 && (
                      <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gold">
                        <ArrowRight className="size-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Meeting Request & Contact Form */}
        <section className="mt-24">
          <div className="glass-panel glow-gold rounded-3xl border border-gold/30 p-8 sm:p-12">
            <div className="max-w-2xl">
              <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                Priority Partnership Desk
              </Badge>
              <h2 className="mt-3 font-display text-4xl uppercase text-white sm:text-5xl">Request Executive Briefing</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Schedule a 1-on-1 strategy call with the SGTB Music executive team or submit an inquiry for custom Suno Voice Persona licensing.
              </p>
            </div>

            <form onSubmit={handleMeetingSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-white">Executive Name</Label>
                <Input value={executiveName} onChange={(e) => setExecutiveName(e.target.value)} placeholder="e.g. Sarah Jenkins" className="mt-2 border-white/15 bg-black/40 text-white" required />
              </div>
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-white">Organization / Label</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. Universal Music Group / Suno" className="mt-2 border-white/15 bg-black/40 text-white" required />
              </div>
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-white">Corporate Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sarah@label.com" className="mt-2 border-white/15 bg-black/40 text-white" required />
              </div>
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-white">Requested Date &amp; Time</Label>
                <Input value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} placeholder="e.g. Aug 18, 2026 @ 2:00 PM EST" className="mt-2 border-white/15 bg-black/40 text-white" required />
              </div>
              <div className="sm:col-span-2">
                <Label className="font-mono text-xs uppercase tracking-wider text-white">Strategic Notes / Licensing Focus</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mention specific voice personas, sync catalogs, or publishing inquiries..." className="mt-2 border-white/15 bg-black/40 text-white" rows={4} />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" disabled={submittingMeeting} className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-12 px-8">
                  {submittingMeeting ? "Submitting Request..." : "Request High-Priority Briefing"}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
