import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PIPELINE } from "@/lib/site";
import { ArrowRight, Boxes, Compass, Gauge, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const PRINCIPLES = [
  {
    icon: Compass,
    title: "Producer First, Prompt Second",
    body: "The tool changed; the craft did not. Arrangement, tension, and hook placement still decide whether a song works.",
  },
  {
    icon: Gauge,
    title: "Release-Grade Or Not At All",
    body: "Every record is referenced against commercial material before it leaves the room. Loudness, balance, and clarity have to compete.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Ownership Path",
    body: "We keep the routing transparent — what stays in Suno, what goes exclusive, and what ships to DSPs.",
  },
  {
    icon: Boxes,
    title: "One Continuous Pipeline",
    body: "Idea, generation, structure, engineering, distribution, and promotion are handled as one workflow instead of six disconnected steps.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="Who"
        accent="SGTB Music Is"
        description="SGTB Music is a production and engineering operation built for the Suno era. We take AI-assisted ideas and finish them like records — structured, performed, engineered, released, and promoted."
      />

      <section className="container pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Most AI music stops at the moment of generation. The idea is exciting, the
              vocal is compelling, and then the file sits in a folder because nobody
              handled the parts that turn a generation into a release. That gap — between a
              promising output and a finished, competitive record — is the entire reason
              SGTB Music exists.
            </p>
            <p>
              Our work starts with intent. We treat a Suno session the way a producer treats
              a writing session: chase the strongest idea, keep what has character, and
              discard what merely sounds impressive. From there the song is rebuilt with
              real structure, then engineered in Pro Tools with the same discipline applied
              to any commercial project.
            </p>
            <p>
              The final stage is just as deliberate. Some records go back into Suno to live
              inside that ecosystem, some are placed exclusively, and others are
              distributed to streaming platforms — each followed by a social rollout built
              to actually move the song rather than simply announce it.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h2 className="font-condensed text-xl tracking-[0.14em] text-gold uppercase">
              How Work Moves
            </h2>
            <ol className="mt-5 space-y-4">
              {PIPELINE.map(stage => (
                <li key={stage.id} className="flex gap-3.5">
                  <span className="font-mono mt-0.5 text-xs text-gold/70">{stage.step}</span>
                  <div>
                    <p className="font-condensed text-base tracking-[0.08em] uppercase">
                      {stage.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {stage.caption}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
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
              Ready to hear it?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with the catalog, then tell us what you are building.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/music">
              <Button className="font-condensed bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
                Playlist
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="font-condensed border-border tracking-[0.16em] uppercase hover:bg-secondary">
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
