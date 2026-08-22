import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CAR_INTRO_CLIP, type IntroClip } from "@/lib/introMedia";
import { VISUAL_ASSET_CATEGORIES, VISUAL_DNA_ASSETS, type VisualAssetCategory } from "@/lib/visualAssets";
import { ArrowUpRight, Film, Image as ImageIcon, Play, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

function ClipCard({ clip, index, family }: { clip: IntroClip; index: number; family: "intro" | "transition" }) {
  return (
    <article className="editorial-frame group rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_80px_rgba(244,191,55,0.12)]">
      <div className="photo-vignette relative aspect-video bg-black">
        <video className="sgtb-image-hover size-full object-cover" controls playsInline preload="metadata" poster={clip.poster} src={clip.src} aria-label={`${clip.label} ${family} video`} />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft backdrop-blur"><Film className="size-3" /> {family}</div>
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Frame {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 font-display text-2xl uppercase leading-none text-white">{clip.label}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Preview this {family} asset on demand from the SGTB Records vault.</p></div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition group-hover:bg-gold group-hover:text-black"><Play className="size-4 fill-current" /></span>
      </div>
    </article>
  );
}

function ClipSection({ title, eyebrow, description, clips, family }: { title: string; eyebrow: string; description: string; clips: IntroClip[]; family: "intro" | "transition" }) {
  return <section className="mt-16"><div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">{eyebrow}</p><h2 className="mt-3 font-display text-4xl uppercase leading-none text-white sm:text-5xl">{title}</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{clips.map((clip, index) => <ClipCard key={clip.id} clip={clip} index={index} family={family} />)}</div></section>;
}

export default function Visuals() {
  const [category, setCategory] = useState<VisualAssetCategory | "all">("all");
  const visibleAssets = useMemo(() => category === "all" ? VISUAL_DNA_ASSETS : VISUAL_DNA_ASSETS.filter(asset => asset.category === category), [category]);

  return (
    <SiteLayout>
      <div className="container max-w-7xl py-10 sm:py-16">
        <section className="grit-surface relative rounded-[2rem] p-6 sm:p-10 lg:p-14">
          <img src={VISUAL_DNA_ASSETS.find(asset => asset.id === "visual-dna-hero")?.src} alt="SGTB gritty luxury Visual DNA board" className="absolute inset-0 size-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,6,0.98),rgba(8,7,6,0.72)_55%,rgba(8,7,6,0.38)),linear-gradient(0deg,rgba(8,7,6,0.9),transparent)]" />
          <div className="noise-texture pointer-events-none absolute inset-0 opacity-15" />
          <div className="relative max-w-4xl">
            <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-gold/40 bg-black/40 font-mono text-[10px] uppercase tracking-[0.26em] text-gold-soft"><ImageIcon className="mr-1.5 size-3.5" /> Visual DNA / Managed Archive</Badge><span className="rounded-full border border-neon/25 bg-neon/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neon">39 references staged</span></div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Gritty luxury / high-impact image system</p>
            <h1 className="mobile-fluid-heading mt-4 font-display text-6xl uppercase leading-[0.84] text-white sm:text-8xl">The Visuals <span className="text-gold-gradient">vault.</span></h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">A curated visual language for SGTB Music: saturated editorial color, chrome and jewelry detail, dramatic rim light, cinematic 35mm grain, and high-value artist presentation.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-gold text-black hover:bg-gold-soft"><a href="/home">Back to the bridge <ArrowUpRight className="ml-2 size-4" /></a></Button><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/60"><Sparkles className="size-3 text-gold" /> Hero, cover, roster, and EPK references</span></div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">Reference library</p><h2 className="mt-3 font-display text-4xl uppercase leading-none text-white sm:text-5xl">One system. Multiple surfaces.</h2></div><p className="max-w-xl text-sm leading-6 text-muted-foreground">These references are not decorative filler. They are mapped to specific jobs: covers, artist identity, executive decks, streetwear campaigns, and cinematic rollouts.</p></div>
          <div className="mobile-scroll-row mt-6 gap-2">{VISUAL_ASSET_CATEGORIES.map(item => <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition ${category === item.id ? "border-gold bg-gold text-black" : "border-white/10 bg-white/5 text-muted-foreground hover:border-gold/30 hover:text-white"}`}>{item.label}</button>)}</div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleAssets.map(asset => <article key={asset.id} className="editorial-frame group rounded-2xl"><div className="photo-vignette aspect-[4/3] bg-black"><img src={asset.src} alt={`${asset.label} — ${asset.purpose}`} loading="lazy" className="sgtb-image-hover size-full object-cover" /><div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-4 pt-10"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] uppercase tracking-wider text-gold-soft">{asset.category}</span><span className="font-mono text-[9px] text-white/55">{asset.orientation}</span></div><h3 className="mt-1 font-display text-xl uppercase leading-none text-white">{asset.label}</h3></div></div><div className="p-4"><p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{asset.purpose}</p><div className="mt-3 flex flex-wrap gap-1.5">{asset.tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/55">{tag}</span>)}</div></div></article>)}</div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="glass-panel rounded-3xl border border-gold/20 p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Asset discipline</p><h2 className="mt-3 font-display text-3xl uppercase text-white">What belongs where.</h2><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-mono text-xs uppercase text-gold">Covers</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Use the Cover DNA set for empty artwork slots until an artist supplies final cover art.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-mono text-xs uppercase text-gold">Roster / EPK</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Use sharp portrait references, not abstract tech art, when a person or partner is the subject.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-mono text-xs uppercase text-gold">Executive</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Use cinematic wide boards sparingly behind readable pitch copy and player controls.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-mono text-xs uppercase text-gold">Campaign</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Reserve hyper-saturated, glossy references for release moments and editorial announcements.</p></div></div></div><div className="rounded-3xl border border-neon/20 bg-neon/5 p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neon">Workflow note</p><p className="mt-3 text-sm leading-6 text-white/80">Need the entry visual again? Use <strong className="text-gold">Watch Intro</strong> in the header. The gateway retains one car-and-chain sequence; the image vault is for the rest of the brand system.</p></div></section>

        <ClipSection eyebrow="Primary sequence" title="The SGTB car sequence" description="The retained SGTB chain visual is available for manual review and powers the entry gateway." clips={[CAR_INTRO_CLIP]} family="intro" />
      </div>
    </SiteLayout>
  );
}
