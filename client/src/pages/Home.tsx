import { PipelineBlueprint } from "@/components/PipelineBlueprint";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  AudioWaveform,
  Headphones,
  Mic2,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";
import { Link } from "wouter";

const HUMANIZE = [
  {
    icon: Mic2,
    title: "Humanized Performance",
    body: "Generated vocals get timing, tuning, breath, and dynamic treatment so the take reads as a performance instead of an output.",
  },
  {
    icon: AudioWaveform,
    title: "Real Song Structure",
    body: "Arrangements are rebuilt into intro, verse, pre, hook, bridge, and outro with the pacing radio programmers expect.",
  },
  {
    icon: Headphones,
    title: "Industry Standard Mixes",
    body: "Pro Tools sessions, referenced mixes, and competitive masters that hold up next to commercial releases.",
  },
  {
    icon: TrendingUp,
    title: "Release and Growth",
    body: "Distribution routing plus a social rollout so finished records actually find listeners.",
  },
];

const STATS = [
  { value: "Suno", label: "Native workflow" },
  { value: "Pro Tools", label: "Engineering suite" },
  { value: "DSP", label: "Distribution ready" },
  { value: "24/7", label: "Studio pipeline" },
];

export default function Home() {
  return (
    <SiteLayout>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,oklch(0.82_0.15_88_/_14%),transparent_55%),radial-gradient(circle_at_82%_78%,oklch(0.66_0.26_305_/_12%),transparent_55%)]"
        />

        <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <span className="glass-panel font-mono inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.65rem] tracking-[0.22em] text-neon uppercase">
              <Waves className="size-3.5" />
              Suno-native production house
            </span>

            <h1 className="font-display mt-6 text-[clamp(2.75rem,8.5vw,6rem)] uppercase">
              <span className="block text-foreground">SGTB Music</span>
              <span className="block text-gold-gradient text-glow-gold">
                Bridges The Gap
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We humanize Suno songs and carry them all the way to industry standard —
              or take your finished ideas back into Suno with a producer's ear. Radio
              ready. Industry ready. Every single time.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/music">
                <Button
                  size="lg"
                  className="font-condensed bg-gold px-7 tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                  Hear The Catalog
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
              <Link href="/suno">
                <span className="suno-nav-btn font-condensed inline-flex h-11 items-center gap-2 rounded-md px-6 text-sm tracking-[0.18em] text-white uppercase">
                  <Sparkles className="size-4 text-neon" />
                  Suno Business
                </span>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-condensed border-border px-7 tracking-[0.16em] uppercase hover:bg-secondary">
                  The Process
                </Button>
              </Link>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {STATS.map(stat => (
                <div key={stat.label} className="border-l border-gold/30 pl-3">
                  <dt className="font-condensed text-lg tracking-[0.08em] text-gold uppercase">
                    {stat.value}
                  </dt>
                  <dd className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Marquee-style vertical statement panel */}
          <div className="relative">
            <div className="glass-panel anim-float relative overflow-hidden rounded-xl p-7">
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-56 rounded-full bg-gold/12 blur-3xl"
              />
              <p className="font-mono text-[0.65rem] tracking-[0.28em] text-gold uppercase">
                The Gap
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-border bg-card/60 p-4">
                  <p className="font-condensed text-sm tracking-[0.16em] text-muted-foreground uppercase">
                    What Suno Gives You
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/85">
                    A fast, inspired idea with real commercial potential.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="relative grid size-10 place-items-center rounded-full border border-gold/50 bg-gold/10">
                    <span
                      aria-hidden
                      className="anim-pulse-ring absolute inset-0 rounded-full border border-gold/40"
                    />
                    <ArrowRight className="size-4 rotate-90 text-gold" />
                  </span>
                </div>
                <div className="rounded-lg border border-gold/40 bg-gold/8 p-4">
                  <p className="font-condensed text-sm tracking-[0.16em] text-gold uppercase">
                    What SGTB Delivers
                  </p>
                  <p className="mt-1.5 text-sm text-foreground">
                    A structured, engineered, distributed, promoted record.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Blueprint ---------------- */}
      <section className="container pb-16 lg:pb-24">
        <PipelineBlueprint />
      </section>

      {/* ---------------- Humanizing transition ---------------- */}
      <section className="relative border-y border-border bg-card/25">
        <div className="container py-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.65rem] tracking-[0.28em] text-neon uppercase">
              The Transition
            </p>
            <h2 className="font-display mt-3 text-[clamp(2rem,5vw,3.4rem)] uppercase">
              Humanizing Suno,{" "}
              <span className="text-neon-gradient">Then Raising The Standard</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              A generated song and a finished record are two different products. Our work
              lives in the space between them: we keep the spark that made the idea
              exciting, then apply the structural, technical, and commercial discipline
              that a release actually requires.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {HUMANIZE.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-border bg-background/60 p-5",
                  "transition-transform duration-200 hover:-translate-y-1",
                )}
                style={{ transitionTimingFunction: "var(--ease-out)" }}>
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span className="grid size-10 place-items-center rounded-md border border-gold/35 bg-gold/10 text-gold">
                  <item.icon className="size-4.5" />
                </span>
                <h3 className="font-condensed mt-4 text-lg tracking-[0.1em] uppercase">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
                <span className="font-mono absolute right-4 bottom-3 text-2xl text-foreground/6">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="container py-16 lg:py-24">
        <div className="glass-panel relative overflow-hidden rounded-xl px-6 py-12 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.82_0.15_88_/_16%),transparent_60%)]"
          />
          <h2 className="font-display relative text-[clamp(1.9rem,5vw,3.2rem)] uppercase">
            Bring The Idea. <span className="text-gold-gradient">We Finish The Record.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Whether you start in Suno or bring a concept from scratch, SGTB Music handles
            structure, engineering, distribution, and rollout.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button
                size="lg"
                className="font-condensed bg-gold px-8 tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                Start A Project
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="font-condensed border-border px-8 tracking-[0.16em] uppercase hover:bg-secondary">
                About SGTB Music
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
