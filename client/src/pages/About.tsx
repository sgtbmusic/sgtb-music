import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Boxes, Compass, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

const PRINCIPLES = [
  {
    icon: Compass,
    title: "AI A&R Incubation First",
    body: "Rapid commercial prototyping through our AI A&R Engine transforms raw ideas into verified Reference Demos before major label commitments.",
  },
  {
    icon: Gauge,
    title: "Analog Re-Tracking Standards",
    body: "Replacing digital placeholder vocals with clean, studio-recorded human vocalists for a radio-ready master that passes major label quality control.",
  },
  {
    icon: ShieldCheck,
    title: "Work-for-Hire Transparency",
    body: "Professional session vocalists and musicians are compensated via transparent flat-fee Vocal Realization agreements.",
  },
  {
    icon: Boxes,
    title: "The Blueprint Delivery System",
    body: "Delivering turn-key Blueprints to major labels for organic interpolation and signed artist re-tracking at scale.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Corporate Philosophy"
        title="Who"
        accent="SGTB Music Is"
        description="SGTB Music Group is an elite B2B enterprise bridging Suno algorithmic generation with major label distribution through professional Analog Re-Tracking and Dynamic Persona Engineering."
      />

      <section className="container pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Most algorithmic music generation stops at the initial prompt. The idea is exciting, but without professional engineering, vocal re-tracking, and structural alignment, the file sits unreleased. That gap — between raw Suno output and a finished, competitive major-label record — is the entire reason SGTB Music Group exists.
            </p>
            <p>
              We operate as a premier <span className="text-gold font-semibold">AI A&amp;R Incubation Engine</span>. We prototype full commercial arrangements into pristine Reference Demos, execute rigorous <span className="text-neon font-semibold">Analog Re-Tracking</span> with studio session vocalists, and deliver turn-key Blueprints to major label executives.
            </p>
            <p>
              As the showcase label for the Suno-to-Studio pipeline, we prove that AI-assisted workflows enhance human craftsmanship rather than replace it. When established artists re-record our catalog, we facilitate seamless <span className="text-gold font-semibold">Organic Interpolations</span> that keep professional session musicians fully employed during the final polish phase.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6 border border-gold/30">
            <h2 className="font-condensed text-xl tracking-[0.14em] text-gold uppercase">
              The Executive Glossary
            </h2>
            <div className="mt-5 space-y-4 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <p className="text-gold font-bold uppercase tracking-wider">Reference Demos</p>
                <p className="mt-1 font-sans text-xs text-muted-foreground">High-level commercial prototypes generated via Suno to validate song structure and market viability.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <p className="text-neon font-bold uppercase tracking-wider">Analog Re-Tracking</p>
                <p className="mt-1 font-sans text-xs text-muted-foreground">Replacing digital placeholder vocals with clean, studio-recorded human vocals for radio-ready masters.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <p className="text-gold font-bold uppercase tracking-wider">Vocal Realization</p>
                <p className="mt-1 font-sans text-xs text-muted-foreground">Flat-fee work-for-hire sessions where professional vocalists execute our lyric and melody blueprints.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/25">
        <div className="container py-16">
          <h2 className="font-display text-[clamp(1.8rem,4.5vw,3rem)] uppercase">
            Operating <span className="text-neon-gradient">Principles</span>
          </h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(item => (
              <article
                key={item.title}
                className="rounded-lg border border-border bg-background/60 p-5">
                <span className="grid size-10 place-items-center rounded-md border border-gold/35 bg-gold/10 text-gold">
                  <item.icon className="size-4.5" />
                </span>
                <h3 className="font-condensed mt-4 text-lg tracking-[0.1em] uppercase">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-gold/30 bg-gold/6 p-7">
          <div>
            <h2 className="font-condensed text-2xl tracking-[0.1em] uppercase">
              Ready to review the catalog?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore our Reference Demos and Pro Tools hybrid stems in the catalog.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/music">
              <Button className="font-condensed bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                Catalog Showcase
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="font-condensed border-border tracking-[0.16em] uppercase hover:bg-secondary">
                Contact Partnership Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
