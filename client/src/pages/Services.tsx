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
    name: "AI A&R Incubation & Reference Demos",
    summary:
      "Rapid commercial prototyping through our AI A&R Engine to establish hook placement, arrangement, and market viability.",
    points: [
      "Concept and Suno Reference Demo breakdown",
      "Prompt and style engineering",
      "Commercial take comparison and selection",
      "Stem and extension planning",
    ],
  },
  {
    icon: AudioWaveform,
    name: "Song Structure & Blueprint Delivery",
    summary:
      "Arrangement work that turns generated ideas into verified major label Blueprints.",
    points: [
      "Intro, verse, pre, hook, bridge, outro mapping",
      "Section timing and energy curve for radio formats",
      "Hook placement and repetition strategy",
      "Turn-key deliverable packaging for label A&R",
    ],
  },
  {
    icon: SlidersHorizontal,
    name: "Analog Re-Tracking & Pro Tools Mix",
    summary: "Replacing digital placeholder vocals with clean, studio-recorded human vocalists and analog mixing.",
    points: [
      "Vocal Realization with professional session vocalists",
      "Analog outboard processing and hybrid mixing",
      "Organic Interpolation facilitation",
      "Commercial-level mastering for major distribution",
    ],
  },
  {
    icon: Radio,
    name: "Distribution & Showcase Routing",
    summary:
      "Deciding where the record lives — and deploying it cleanly to global streaming networks.",
    points: [
      "Ecosystem release integration",
      "Exclusive sync licensing and placement",
      "DistroKid delivery to DSPs",
      "Metadata, splits, and release scheduling",
    ],
  },
  {
    icon: Megaphone,
    name: "Dynamic Persona Engineering",
    summary: "Mass-producing tailored cadences and instrumentals calibrated to match target market branding.",
    points: [
      "Tailored vocal texture generation",
      "Release-week marketing asset packaging",
      "Audience growth and sync strategy",
      "Performance review and iteration",
    ],
  },
];

export default function Services() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Enterprise Services"
        title="B2B Production"
        accent="&amp; Workflow Tiers"
        description="Every service maps to an executive stage in the SGTB pipeline. From AI A&amp;R Incubation to Analog Re-Tracking and Blueprint delivery."
      />

      <section className="container pb-14">
        <PipelineBlueprint />
      </section>

      <section className="container pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          {SERVICES.map((service, index) => (
            <article
              key={service.name}
              className="glass-panel relative overflow-hidden rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1 border border-gold/20"
              style={{ transitionTimingFunction: "var(--ease-out)" }}>
              <span className="font-mono absolute top-5 right-6 text-3xl text-foreground/10">
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

          <div className="glass-panel flex flex-col justify-center gap-4 rounded-xl p-7 text-center lg:col-span-2 border border-gold/30">
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.6rem)] uppercase">
              Ready to Commission a Reference Demo?
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
              Submit your project brief to our AI A&amp;R Engine. We will provide an executive assessment on reference generation, analog re-tracking, and label blueprint delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link href="/contact">
                <Button className="font-condensed bg-gold px-7 tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                  Request Partnership Review
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
