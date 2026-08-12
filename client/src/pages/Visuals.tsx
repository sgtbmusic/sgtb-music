import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { INTRO_CLIPS, TRANSITION_CLIPS, type IntroClip } from "@/lib/introMedia";
import { ArrowUpRight, Film, Play, Sparkles } from "lucide-react";

function ClipCard({ clip, index, family }: { clip: IntroClip; index: number; family: "intro" | "transition" }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-card/70 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_24px_80px_rgba(244,191,55,0.12)]">
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          controls
          playsInline
          preload="metadata"
          poster={clip.poster}
          src={clip.src}
          aria-label={`${clip.label} ${family} video`}
        />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft backdrop-blur">
          <Film className="size-3" /> {family}
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Frame {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 font-display text-2xl uppercase leading-none text-white">{clip.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Preview this {family} asset on demand from the SGTB Records vault.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition group-hover:bg-gold group-hover:text-black">
          <Play className="size-4 fill-current" />
        </span>
      </div>
    </article>
  );
}

function ClipSection({ title, eyebrow, description, clips, family }: { title: string; eyebrow: string; description: string; clips: IntroClip[]; family: "intro" | "transition" }) {
  return (
    <section className="mt-16">
      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-none text-white sm:text-5xl">{title}</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {clips.map((clip, index) => (
          <ClipCard key={clip.id} clip={clip} index={index} family={family} />
        ))}
      </div>
    </section>
  );
}

export default function Visuals() {
  return (
    <SiteLayout>
      <div className="container py-12 sm:py-16">
        <PageHeader
          eyebrow="Cinematic Vault / On demand"
          title="The Visuals vault."
          accent="Visuals"
          description="Every entry frame, transition beat, and gold-dust handoff is now available to preview on demand. Press play when you want the signal—not only when you enter."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-soft">Vault protocol</p>
                <h2 className="mt-2 font-display text-3xl uppercase leading-none text-white">Ten cuts. One frequency.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">The entry gateway chooses one intro and one transition at random. Here, you control the sequence—use each player to inspect the visual language, timing, and atmosphere of the full SGTB Records experience.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-neon/20 bg-neon/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Workflow note</p>
            <p className="mt-3 text-sm leading-6 text-white/80">Need the intro again? Use <strong className="text-gold">Watch Intro</strong> in the header from any major page.</p>
            <Button asChild variant="outline" className="mt-5 border-neon/30 bg-transparent text-neon hover:bg-neon/10 hover:text-white">
              <a href="/home">Back to the bridge <ArrowUpRight className="ml-2 size-4" /></a>
            </Button>
          </div>
        </div>

        <ClipSection
          eyebrow="Sequence 01"
          title="Intro cuts"
          description="The five opening clips used when a visitor chooses to enter SGTB Records. Each player is manual and does not autoplay."
          clips={INTRO_CLIPS}
          family="intro"
        />
        <ClipSection
          eyebrow="Sequence 02"
          title="Transition cuts"
          description="The five handoff clips that move the experience from cinematic entry into the access terminal."
          clips={TRANSITION_CLIPS}
          family="transition"
        />
      </div>
    </SiteLayout>
  );
}
