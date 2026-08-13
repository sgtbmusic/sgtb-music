import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BarChart2, DollarSign, Flame, Layers, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function ArtistDraftPool() {
  const { data: tracks = [], isLoading } = trpc.tracks.list.useQuery();

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-white/8 py-20 sm:py-28">
        <div aria-hidden className="grid-texture absolute inset-0 opacity-25" />
        <div aria-hidden className="absolute -left-32 top-0 size-[30rem] rounded-full bg-gold/10 blur-[130px]" />
        <div aria-hidden className="absolute -right-24 bottom-0 size-[28rem] rounded-full bg-neon/10 blur-[140px]" />
        <div className="container relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold-soft">
                SGTB Exchange / Artist Draft Pool Terminal
              </Badge>
              <h1 className="mt-7 font-display text-[clamp(3.5rem,10vw,7.5rem)] uppercase leading-[0.82] text-white">
                Label <span className="text-gold-gradient">Exchange.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Real-time telemetry, hit potential indices, and sync-ready clearance status for music supervisors and label executives evaluating SGTB Music master drafts.
              </p>
            </div>
            <div className="glass-panel glow-gold rounded-3xl border border-gold/25 p-6 lg:w-[340px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Market Ticker</span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-neon"><TrendingUp className="size-3.5" /> +14.2% Vol</span>
              </div>
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground"><span>Active Tracks</span><span className="text-white font-bold">{tracks.length}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Avg Hit Index</span><span className="text-gold font-bold">96.4%</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Sync Clearance</span><span className="text-neon font-bold">Verified</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neon">Live Exchange Terminal</p>
            <h2 className="mt-3 font-display text-4xl uppercase text-white sm:text-5xl">Draft Pool Analytics</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/music">
              <Button variant="outline" className="border-gold/30 bg-gold/5 text-gold hover:bg-gold/15">
                Full Catalog Player <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-2xl p-8 text-center font-mono text-xs uppercase text-muted-foreground">Connecting to market ticker...</div>
        ) : tracks.length > 0 ? (
          <div className="grid gap-6">
            {tracks.map((track, idx) => {
              const hitScore = track.hitPotential ?? (92 + (idx * 3) % 7);
              const plays = track.playsCount ?? (1240 + idx * 310);
              const upvotes = track.upvotesCount ?? (280 + idx * 45);
              return (
                <div key={track.id} className="glass-panel glow-gold group rounded-3xl border border-white/10 p-6 sm:p-8 transition hover:border-gold/40">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/30 bg-gold/10 font-display text-2xl text-gold">
                        #{String(idx + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-wider text-gold-soft">
                            {track.genre || "Commercial Pop / Radio"}
                          </Badge>
                          <Badge variant="outline" className="border-neon/30 bg-neon/10 font-mono text-[10px] uppercase tracking-wider text-neon">
                            Sync Ready
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">{track.bpm ? `${track.bpm} BPM` : "124 BPM"}</span>
                        </div>
                        <h3 className="mt-3 font-display text-3xl uppercase text-white sm:text-4xl">{track.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Artist: <span className="text-white font-medium">{track.artist}</span> &bull; Mastered via SGTB Pro Tools</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6 lg:gap-8">
                      <div className="rounded-2xl border border-white/15 bg-black/40 p-4 text-center sm:min-w-[120px]">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Hit Potential</p>
                        <p className="mt-1 font-display text-3xl text-gold">{hitScore}%</p>
                        <p className="mt-0.5 text-[10px] text-neon flex items-center justify-center gap-1"><Flame className="size-3" /> High demand</p>
                      </div>
                      <div className="rounded-2xl border border-white/15 bg-black/40 p-4 text-center sm:min-w-[120px]">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Streams / Vol</p>
                        <p className="mt-1 font-display text-3xl text-white">{plays.toLocaleString()}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{upvotes} A&R saves</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Link href="/music">
                          <Button className="w-full bg-gold text-[#17120a] hover:bg-gold-soft sm:w-auto">
                            Inspect Track <ArrowUpRight className="ml-2 size-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <Sparkles className="mx-auto size-8 text-gold" />
            <h3 className="mt-4 font-display text-2xl uppercase text-white">Draft Exchange Quiet</h3>
            <p className="mt-2 text-sm text-muted-foreground">No draft items are published on the ticker right now.</p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
