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
import { PreGenerationPipelineSelector } from "@/components/PreGenerationPipelineSelector";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { CURATED_HERO_ASSET } from "@/lib/visualAssets";
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
import { useState } from "react";
import { toast } from "sonner";

export default function ExecutiveHQ() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: catalog = [], isLoading } = trpc.executive.listCatalog.useQuery();
  const audio = useAudioPlayer();

  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Meeting form state
  const [executiveName, setExecutiveName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingMeeting, setSubmittingMeeting] = useState(false);

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

  function togglePlay(item: (typeof catalog)[number]) {
    audio.toggleTrack({ ...item, kind: "track" });
  }

  const categories = ["All", "Suno Voice Persona", "Hybrid Stems (Pro Tools Mix)", "Live Sync Concepts"];
  const filteredCatalog = activeCategory === "All" ? catalog : catalog.filter(item => item.category === activeCategory);
  const featuredItem = filteredCatalog[0] ?? catalog[0] ?? null;
  const featuredIsCurrent = Boolean(featuredItem && audio.isCurrent({ id: featuredItem.id, kind: "track" }));
  const featuredIsPlaying = featuredIsCurrent && audio.isPlaying;

  return (
    <SiteLayout>
      <div className="container max-w-7xl py-12 sm:py-20">
        {/* Top-fold hero + featured master player */}
        <section className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#0f0a07] shadow-[0_28px_100px_rgba(0,0,0,0.45)]">
          <img src={CURATED_HERO_ASSET.src} alt="SGTB Visual DNA editorial board" className="absolute inset-0 size-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,7,0.98)_0%,rgba(8,7,7,0.9)_44%,rgba(8,7,7,0.48)_100%),linear-gradient(0deg,rgba(8,7,7,0.92),transparent_45%)]" />
          <div className="noise-texture pointer-events-none absolute inset-0 opacity-15" />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:items-end lg:p-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-gold/40 bg-black/40 font-mono text-[10px] uppercase tracking-[0.26em] text-gold-soft backdrop-blur">
                  <ShieldCheck className="mr-1.5 size-3.5 text-gold" /> Suno Executive Portal
                </Badge>
                {isExecutiveAccess && (
                  <Badge variant="outline" className="border-neon/40 bg-neon/10 font-mono text-[10px] uppercase tracking-wider text-neon">
                    Verified {user?.role.toUpperCase()} Access
                  </Badge>
                )}
              </div>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-gold">AI A&amp;R Engine / Blueprint Delivery System</p>
              <h1 className="mt-4 max-w-3xl font-display text-[clamp(3.3rem,8vw,7.25rem)] uppercase leading-[0.82] text-white">
                Hear the <span className="text-gold-gradient">next release.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Curated master songs, pristine Pro Tools hybrid stems, voice persona matrices, and commercial proof points prepared for Suno leadership and label partners.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <Button type="button" onClick={() => startLogin()} className="h-11 bg-gold px-5 font-mono text-xs uppercase tracking-wider text-[#17120a] hover:bg-gold-soft">
                    <User className="mr-2 size-4" /> Sign In for Full Access
                  </Button>
                ) : (
                  <span className="inline-flex max-w-full items-center rounded-2xl border border-gold/30 bg-black/40 px-4 py-2.5 font-mono text-xs text-gold backdrop-blur">Logged in as {user?.name || user?.email}</span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/65 backdrop-blur"><span className="size-1.5 rounded-full bg-neon shadow-[0_0_12px_#64f7db]" /> Master assets online</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gold/35 bg-[#0b0908]/90 p-5 shadow-[0_0_50px_rgba(212,175,55,0.14)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Top-fold showcase</p><p className="mt-1 text-xs text-white/55">The first thing an executive should hear.</p></div>
                <span className="rounded-full border border-neon/25 bg-neon/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-neon">HQ / 01</span>
              </div>
              {featuredItem ? (
                <div className="pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{featuredItem.category}</p>
                  <h2 className="mt-3 line-clamp-2 font-display text-3xl uppercase leading-none text-white sm:text-4xl">{featuredItem.title}</h2>
                  <p className="mt-2 truncate font-mono text-xs uppercase tracking-wider text-gold">{featuredItem.artist}</p>
                  <p className="mt-4 line-clamp-3 text-xs leading-6 text-white/60">{featuredItem.description}</p>
                  <div className="mt-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-white/50"><span>{featuredItem.genre}</span><span>•</span><span>{featuredItem.bpm} BPM</span><span className="ml-auto text-neon">{featuredItem.hitPotential}% index</span></div>
                  <Button type="button" onClick={() => togglePlay(featuredItem)} className={cn("mt-6 h-11 w-full font-mono text-xs uppercase tracking-wider", featuredIsPlaying ? "bg-neon text-black hover:bg-neon/90" : "bg-gold text-[#17120a] hover:bg-gold-soft")}>
                    {featuredIsPlaying ? <><Pause className="mr-2 size-4" /> Pause Master</> : <><Play className="mr-2 size-4" /> Play Master</>}
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="py-12 text-center font-mono text-xs uppercase text-white/50">Loading showcase master…</div>
              ) : (
                <div className="py-10 text-center"><p className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">No executive master published</p><p className="mt-2 text-xs leading-5 text-white/35">The top-fold player will activate as soon as an authorized admin publishes a curated master.</p></div>
              )}
            </div>
          </div>
        </section>

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

          {isLoading ? (
            <div className="glass-panel mt-8 rounded-3xl p-12 text-center font-mono text-xs uppercase text-muted-foreground">Loading executive catalog...</div>
          ) : filteredCatalog.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((item) => {
                const isCurrent = audio.isCurrent({ id: item.id, kind: "track" });
                const itemIsPlaying = isCurrent && audio.isPlaying;
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
                        onClick={() => togglePlay(item)}
                        className={cn("flex-1 font-mono text-xs uppercase tracking-wider", itemIsPlaying ? "bg-neon text-black" : "bg-gold text-[#17120a] hover:bg-gold-soft")}
                      >
                        {itemIsPlaying ? <><Pause className="mr-2 size-4" /> Pause Master</> : <><Play className="mr-2 size-4" /> Play Master</>}
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

              <PreGenerationPipelineSelector />
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
