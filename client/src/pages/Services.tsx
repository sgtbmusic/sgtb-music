import { PageHeader } from "@/components/PageHeader";
import { PipelineBlueprint } from "@/components/PipelineBlueprint";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  AudioWaveform,
  Check,
  Megaphone,
  Radio,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

const SERVICES = [
  {
    icon: Sparkles,
    name: "Suno Direction",
    summary:
      "Prompt strategy, generation passes, and take selection guided by a producer's ear.",
    points: [
      "Concept and reference breakdown",
      "Prompt and style engineering",
      "Take comparison and selection",
      "Stem and extension planning",
    ],
  },
  {
    icon: AudioWaveform,
    name: "Song Structure Rebuild",
    summary:
      "Arrangement work that turns a generated idea into a properly paced record.",
    points: [
      "Intro, verse, pre, hook, bridge, outro mapping",
      "Section timing and energy curve",
      "Hook placement and repetition strategy",
      "Radio-length and full-length versions",
    ],
  },
  {
    icon: SlidersHorizontal,
    name: "Pro Tools Engineering",
    summary: "The technical pass that makes a song competitive on real systems.",
    points: [
      "Vocal editing, tuning, and comping",
      "Humanized timing and dynamics",
      "Referenced mixing",
      "Commercial-level mastering",
    ],
  },
  {
    icon: Radio,
    name: "Distribution Routing",
    summary:
      "Deciding where the record lives — and getting it there cleanly.",
    points: [
      "Back into Suno for ecosystem release",
      "Blackbox exclusive placement",
      "DistroKid delivery to DSPs",
      "Metadata, splits, and release scheduling",
    ],
  },
  {
    icon: Megaphone,
    name: "Social Promotion & Growth",
    summary: "The rollout that keeps a finished record moving after release day.",
    points: [
      "Clip and short-form asset packaging",
      "Release-week content calendar",
      "Audience growth strategy",
      "Performance review and iteration",
    ],
  },
];

export default function Services() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="The"
        accent="Process"
        description="Every service maps to a stage in the SGTB pipeline. Take the whole chain or plug in at the point where your project needs help."
      />

      <section className="container pb-14">
        <PipelineBlueprint />
      </section>

      <section className="container pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          {SERVICES.map((service, index) => (
            <article
              key={service.name}
              className="glass-panel relative overflow-hidden rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1"
              style={{ transitionTimingFunction: "var(--ease-out)" }}>
              <span className="font-mono absolute top-5 right-6 text-3xl text-foreground/6">
                0{index + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-md border border-gold/35 bg-gold/10 text-gold">
                <service.icon className="size-5" />
              </span>
              <h2 className="font-condensed mt-4 text-xl tracking-[0.1em] uppercase">
                {service.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              <ul className="mt-5 space-y-2">
                {service.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span className="text-foreground/85">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="glass-panel flex flex-col justify-center gap-4 rounded-xl p-7 text-center lg:col-span-2">
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.6rem)] uppercase">
              Not sure which stage you need?
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
              Send the song or the idea. We will tell you exactly what it takes to get it
              to release quality — and what it does not need.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link href="/contact">
                <Button className="font-condensed bg-gold px-7 tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                  Request A Review
                </Button>
              </Link>
              <Link href="/suno">
                <span className="suno-nav-btn font-condensed inline-flex h-10 items-center gap-2 rounded-md px-6 text-sm tracking-[0.18em] text-white uppercase">
                  <Sparkles className="size-4 text-neon" />
                  Suno Business
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
