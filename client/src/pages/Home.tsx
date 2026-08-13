import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PipelineBlueprint } from "@/components/PipelineBlueprint";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Sparkles, Radio, Layers, Music2, Cpu, Mic2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <SiteLayout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="container max-w-7xl pt-12 pb-20 sm:pt-20 sm:pb-32">
          <div className="flex flex-col items-center text-center">
            <Badge variant="outline" className="border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.28em] text-gold shadow-[0_0_20px_rgba(244,191,55,0.25)]">
              <Sparkles className="mr-2 size-3.5 text-gold" /> The Elite B2B Bridge for Major Label Distribution
            </Badge>

            <h1 className="mt-8 font-display text-5xl uppercase tracking-tight text-white sm:text-7xl lg:text-8xl max-w-5xl leading-none">
              Engineering Radio-Ready Hits from <span className="text-gold-gradient">Suno Reference Demos.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans">
              SGTB Music Group operates as a premier <span className="text-gold font-semibold">AI A&amp;R Incubation Engine</span>. We prototype full commercial arrangements into pristine Reference Demos, execute rigorous <span className="text-neon font-semibold">Analog Re-Tracking</span> with studio session vocalists, and deliver turn-key Blueprints to major labels.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suno">
                <Button className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-12 px-8 shadow-[0_0_25px_rgba(244,191,55,0.35)]">
                  Explore Suno Business <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/artist-draft-pool">
                <Button variant="outline" className="border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 hover:text-gold-soft font-mono text-xs uppercase tracking-wider h-12 px-8">
                  View Artist Draft Pool
                </Button>
              </Link>
              <Link href="/suno-hq">
                <Button variant="outline" className="border-neon/30 bg-neon/5 text-neon hover:bg-neon/15 hover:text-neon-soft font-mono text-xs uppercase tracking-wider h-12 px-8">
                  Executive HQ Portal
                </Button>
              </Link>
            </div>

            {/* Live Trust Banner */}
            <div className="mt-16 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="glass-panel glow-gold rounded-2xl border border-gold/20 p-5 text-left">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Core Strategy</p>
                <p className="mt-2 font-display text-xl uppercase text-white">AI A&amp;R Engine</p>
                <p className="mt-1 text-xs text-muted-foreground">Rapid commercial prototyping</p>
              </div>
              <div className="glass-panel glow-gold rounded-2xl border border-gold/20 p-5 text-left">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Studio Standard</p>
                <p className="mt-2 font-display text-xl uppercase text-gold">Analog Re-Tracking</p>
                <p className="mt-1 text-xs text-muted-foreground">Prine human vocal replacement</p>
              </div>
              <div className="glass-panel glow-gold rounded-2xl border border-gold/20 p-5 text-left">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Session Delivery</p>
                <p className="mt-2 font-display text-xl uppercase text-white">Work-for-Hire</p>
                <p className="mt-1 text-xs text-muted-foreground">Flat-fee vocal realization</p>
              </div>
              <div className="glass-panel glow-gold rounded-2xl border border-gold/20 p-5 text-left">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Label Scaling</p>
                <p className="mt-2 font-display text-xl uppercase text-neon">Dynamic Persona</p>
                <p className="mt-1 text-xs text-muted-foreground">Tailored market cadences</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Blueprint Workflow Section */}
        <section className="container max-w-7xl py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Enterprise Architecture</span>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
              The Suno-to-Studio <span className="text-gold-gradient">Blueprint Delivery System.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We do not replace studio talent; we eliminate creative friction. SGTB acts as the ultimate starting line, providing major labels with fully arranged Reference Demos that streamline A&amp;R validation before committing live session musicians.
            </p>
          </div>

          <PipelineBlueprint />
        </section>

        {/* Bridging the Gap / Business Model Section */}
        <section className="container max-w-7xl py-20 border-t border-white/10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="border-neon/30 bg-neon/10 font-mono text-xs uppercase tracking-wider text-neon">
                Industry Integration
              </Badge>
              <h2 className="mt-4 font-display text-4xl uppercase text-white sm:text-5xl leading-tight">
                Bridging the Gap Between <span className="text-gold-gradient">AI Scale &amp; Major Standards.</span>
              </h2>
              <p className="mt-6 text-base text-muted-foreground leading-8">
                As the premiere showcase label for AI-assisted commercial releases, SGTB Music bridges the gap between rapid algorithmic incubation and elite radio mastering. When established artists re-record our catalog in their own voice, we facilitate seamless <span className="text-gold font-semibold">Organic Interpolations</span>.
              </p>
              <p className="mt-4 text-base text-muted-foreground leading-8">
                For emerging vocalists, our <span className="text-neon font-semibold">Vocal Realization</span> sessions provide reliable work-for-hire opportunities that keep professional session musicians fully employed during the final polish phase.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/services">
                  <Button className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11 px-6">
                    View Enterprise Services
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-mono text-xs uppercase tracking-wider h-11 px-6">
                    Our Corporate Philosophy
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-panel glow-gold rounded-3xl border border-gold/30 p-8 sm:p-10 relative">
              <div className="absolute -top-4 -right-4 rounded-2xl bg-gold text-[#17120a] px-4 py-2 font-mono text-xs uppercase font-bold shadow-lg">
                Showcase Label
              </div>
              <h3 className="font-display text-3xl uppercase text-white">Dynamic Persona Engineering</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Through our advanced CAMG workflow, we deliver <span className="text-gold">Dynamic Persona Engineering</span>—mass-producing tailored cadences, vocal textures, and instrumentals calibrated precisely to match a label's target demographic and market positioning.
              </p>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Cpu className="size-5 text-gold shrink-0" />
                  <span className="text-white">Algorithmic A&amp;R Incubation &amp; Reference Demos</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Mic2 className="size-5 text-neon shrink-0" />
                  <span className="text-white">Pristine Analog Re-Tracking &amp; Session Vocalists</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Music2 className="size-5 text-gold shrink-0" />
                  <span className="text-white">Global Distribution via DistroKid &amp; Sync Licensing</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
