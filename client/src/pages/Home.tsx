import { useAuth } from "@/_core/hooks/useAuth";
import { SiteLayout } from "@/components/SiteLayout";
import { PipelineBlueprint } from "@/components/PipelineBlueprint";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ShieldCheck, Sparkles, TrendingUp, Music4, Cpu, Layers } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/8 py-20 sm:py-32">
        <div aria-hidden className="grid-texture absolute inset-0 opacity-25" />
        <div aria-hidden className="absolute -left-32 top-0 size-[32rem] rounded-full bg-gold/10 blur-[140px]" />
        <div aria-hidden className="absolute -right-24 bottom-0 size-[30rem] rounded-full bg-neon/10 blur-[150px]" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="safe-wrap max-w-full border-gold/30 bg-gold/5 px-3 py-1.5 text-center font-mono text-[9px] leading-4 uppercase tracking-[0.14em] text-gold-soft sm:text-[10px] sm:tracking-[0.24em]">
              SGTB Records / The Analog-to-Digital Bridge
            </Badge>
            
            <h1 className="safe-wrap mt-8 max-w-full font-display text-[clamp(3rem,14vw,8rem)] uppercase leading-[0.86] text-white">
              SGTB Music <span className="text-gold-gradient">Bridges The Gap.</span>
            </h1>
            
            <p className="safe-wrap mx-auto mt-8 max-w-3xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-9">
              We operate as the premier A&R incubation engine, taking high-level Reference Demos generated via Suno and elevating them through professional Analog Re-Tracking. Replacing digital placeholder tracks with clean, studio-recorded vocals and live session musicians to deliver radio-ready masters for major label distribution.
            </p>

            {/* Playlist Consideration Banner */}
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-[#12141a] to-gold/10 p-5 text-left shadow-xl shadow-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gold/20 text-gold shrink-0">
                  <Music4 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Get On The Official SGTB Playlist</h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Submit your Suno reference demos for A&R evaluation. Owner uploads are auto-approved; creator submissions are reviewed promptly!
                  </p>
                </div>
              </div>
              <Link href="/upload">
                <Button className="bg-gold text-black hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-10 px-6 shrink-0 font-bold">
                  Submit Song Now <ArrowUpRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/music">
                <Button className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-12 px-8">
                  Explore Catalog Player <ArrowUpRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/suno">
                <Button variant="outline" className="border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 font-mono text-xs uppercase tracking-wider h-12 px-8">
                  Suno Business &amp; Roster <Sparkles className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/suno-hq">
                <Button variant="outline" className="border-neon/30 bg-neon/10 text-neon hover:bg-neon/20 font-mono text-xs uppercase tracking-wider h-12 px-8">
                  Executive HQ <ShieldCheck className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Blueprint Workflow Section */}
      <section className="py-24 sm:py-32 bg-ink-dark/40 border-b border-white/8">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">End-to-End Enterprise Architecture</p>
            <h2 className="mt-3 font-display text-4xl uppercase text-white sm:text-5xl">The SGTB Production Pipeline</h2>
            <p className="mt-4 text-base text-muted-foreground">
              From initial AI A&R prototyping to Pro Tools hybrid engineering, analog session re-tracking, and global DSP deployment.
            </p>
          </div>
          <PipelineBlueprint />
        </div>
      </section>

      {/* Corporate Strategy & Glossary Section */}
      <section className="py-24 sm:py-32 container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <Badge variant="outline" className="border-neon/30 bg-neon/5 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
              Industry Nomenclature &amp; Standards
            </Badge>
            <h2 className="mt-4 font-display text-4xl uppercase text-white sm:text-5xl leading-tight">
              Reinventing <span className="text-gold-gradient">A&amp;R Incubation.</span>
            </h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              In high-stakes meetings with label executives and founders, precision matters. We never treat AI as a replacement; rather, we provide the ultimate starting line for traditional studio musicians and session vocalists.
            </p>

            <div className="mt-8 space-y-6 font-mono text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-gold uppercase tracking-wider font-bold mb-1">1. Reference Demos &amp; Analog Re-Tracking</p>
                <p className="text-muted-foreground font-sans text-sm">
                  We generate high-level Reference Demos using Suno, then execute professional Analog Re-Tracking—replacing placeholder components with clean, studio-recorded human instrumentation and vocals.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-neon uppercase tracking-wider font-bold mb-1">2. Vocal Realization &amp; Organic Interpolations</p>
                <p className="text-muted-foreground font-sans text-sm">
                  Artists execute Vocal Realization as Work-for-Hire Session Vocalists, or establish major artists to record Organic Interpolations for commercial release.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-gold-soft uppercase tracking-wider font-bold mb-1">3. Dynamic Persona Engineering</p>
                <p className="text-muted-foreground font-sans text-sm">
                  Our proprietary CAMG workflow mass-produces tailored cadences, flows, and instrumentals that perfectly match a label roster's current market branding.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel glow-gold rounded-3xl border border-gold/30 p-8 sm:p-10 relative overflow-hidden">
            <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-gold/15 blur-[100px]" />
            <h3 className="font-display text-3xl uppercase text-white mb-6">The Suno Partnership Strategy</h3>
            
            <ul className="space-y-6 text-sm text-muted-foreground">
              <li className="flex items-start gap-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold font-mono font-bold">AI</div>
                <div>
                  <strong className="text-white block font-display text-lg uppercase">The AI A&amp;R Engine</strong>
                  <p className="mt-1">Premier incubation engine rapidly prototyping arrangements, melodies, and hook structures.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon font-mono font-bold">BP</div>
                <div>
                  <strong className="text-white block font-display text-lg uppercase">The Blueprint Delivery System</strong>
                  <p className="mt-1">Delivering fully realized Suno demos as Blueprints for label-signed artists to acquire and re-track.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold font-mono font-bold">BG</div>
                <div>
                  <strong className="text-white block font-display text-lg uppercase">Bridging the Gap</strong>
                  <p className="mt-1">Proving that Suno is an enhancement tool that keeps studio musicians and session vocalists employed.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">
              <span className="font-mono text-xs text-gold uppercase tracking-wider">Showcase Label Status</span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-neon"><ShieldCheck className="size-4" /> Operational</span>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
