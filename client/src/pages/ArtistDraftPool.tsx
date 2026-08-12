import { Link } from "wouter";
import { ArrowRight, Disc3, Headphones, LockKeyhole, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function ArtistDraftPool() {
  const { data: tracks, isLoading } = trpc.tracks.list.useQuery();

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-white/8 py-20 sm:py-28">
        <div aria-hidden className="grid-texture absolute inset-0 opacity-25" />
        <div aria-hidden className="absolute -left-32 top-0 size-[30rem] rounded-full bg-gold/10 blur-[130px]" />
        <div aria-hidden className="absolute -right-24 bottom-0 size-[28rem] rounded-full bg-neon-alt/10 blur-[140px]" />
        <div className="container relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold-soft">
              SGTB Music / Artist Draft Pool
            </Badge>
            <h1 className="mt-7 font-display text-[clamp(4rem,11vw,8rem)] uppercase leading-[0.82] text-white">
              Hear what is <span className="text-gold-gradient">becoming.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              A private working room for unfinished ideas, developing records, and the songs moving through the SGTB Music pipeline. Guests can explore the catalog; signed-in artists can return to the production conversation.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/music">
                <Button className="bg-gold text-[#17120a] hover:bg-gold-soft">
                  Open the catalog <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]">
                  Submit an idea
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neon">Current pool</p>
            <h2 className="mt-3 font-display text-4xl uppercase text-white sm:text-5xl">Drafts in motion</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <LockKeyhole className="size-3.5 text-gold" />
            Work-in-progress catalog
          </div>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-2xl p-8 text-sm text-muted-foreground">Loading the current draft pool…</div>
        ) : tracks && tracks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tracks.map((track) => (
              <Link key={track.id} href="/music" className="glass-panel group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-gold/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
                    <Disc3 className="size-5 transition-transform group-hover:rotate-12" />
                  </div>
                  <Badge variant="outline" className="border-neon/25 text-neon">Draft</Badge>
                </div>
                <h3 className="mt-7 font-display text-3xl uppercase text-white">{track.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{track.artist}</p>
                <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-soft">
                  <Headphones className="size-3.5" /> Listen in catalog
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-8 sm:p-12">
            <div aria-hidden className="absolute -right-12 -top-16 size-48 rounded-full bg-neon/10 blur-3xl" />
            <Sparkles className="size-7 text-gold" />
            <h3 className="mt-6 font-display text-4xl uppercase text-white">The pool is warming up.</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              No draft records are published yet. When the next track is cleared for listening, it will appear here and in the full music catalog.
            </p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
