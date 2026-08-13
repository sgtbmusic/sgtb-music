import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Sparkles, Users, Settings, ArrowUpRight } from "lucide-react";
import { CredentialPopups } from "@/components/suno/CredentialPopups";
import { CreatorProfileDialog } from "@/components/suno/CreatorProfileDialog";
import { CreatorEditorDialog } from "@/components/suno/CreatorEditorDialog";
import { SunoPodcastSection } from "@/components/suno/SunoPodcastSection";
import type { Creator } from "@shared/types";

export default function Suno() {
  const { user } = useAuth();
  const { data: creators = [], isLoading } = trpc.creators.list.useQuery();

  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isAdmin = user && user.role === "admin";

  const fallbackRosie: Creator = {
    id: 1,
    name: "Rosie Nguyen",
    role: "Head of Creators at Suno",
    handle: "@rosie",
    imageUrl: "/manus-storage/IMG_0041_84afc747.jpeg",
    imageKey: null,
    credentials: JSON.stringify([
      "Head of Creators at Suno",
      "Cofounder of Fanhouse (raised $22M, exited)",
      "1M+ Creator & Industry Leader",
      "Forbes 30 Under 30 Honoree"
    ]),
    bio: "Cofounded Fanhouse, a platform that helped thousands of creators make over $20M and raised over $22M (acquired in 2023). Head of Creators & Content at Suno. Content creator with experience growing and managing both personal and professional brands, growing personal accounts to 1M+.",
    isPlaceholder: false,
    isFeatured: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const rosie = creators.find(c => c.name.toLowerCase().includes("rosie")) || fallbackRosie;
  const otherCreators = creators.filter(c => c.id !== rosie.id);

  return (
    <SiteLayout>
      <div className="container max-w-7xl py-12 sm:py-20">
        {/* Header with Admin Settings Icon */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-12">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-gold/40 bg-gold/10 font-mono text-xs uppercase tracking-[0.26em] text-gold">
                <Sparkles className="mr-1.5 size-3.5 text-gold" /> Suno Business Enterprise Hub
              </Badge>
              {isAdmin && (
                <Badge variant="outline" className="border-neon/40 bg-neon/10 font-mono text-xs uppercase tracking-wider text-neon">
                  Admin Management Mode Active
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-5xl uppercase leading-none text-white sm:text-7xl">
              Suno Business &amp; <span className="text-gold-gradient">Industry Roster.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              Strategic enterprise partnerships bridging advanced algorithmic incubation with major label distribution. Explore leadership profiles and our 4-part commercial deployment strategy.
            </p>
          </div>

          {isAdmin && (
            <Button
              type="button"
              onClick={() => {
                setEditingCreator(null);
                setIsEditorOpen(true);
              }}
              className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11 px-6"
            >
              <Settings className="mr-2 size-4" /> Manage Profiles &amp; Roster
            </Button>
          )}
        </div>

        {/* The Four Strategic Pillars */}
        <section className="mt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Core Business Strategy</span>
            <h2 className="mt-3 font-display text-3xl uppercase text-white sm:text-4xl">The SGTB Commercial Pipeline</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-gold">Pillar I</span>
                <h3 className="mt-2 font-display text-xl uppercase text-white">The AI A&amp;R Engine</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Positioning SGTB Records as a premier A&amp;R incubation engine that rapidly prototypes full commercial arrangements and Suno Reference Demos at scale.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gold uppercase">Incubation &amp; Prototyping</div>
            </div>

            <div className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-neon">Pillar II</span>
                <h3 className="mt-2 font-display text-xl uppercase text-white">The Blueprint System</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  We deliver fully realized Suno demos to major labels as verified Blueprints for their signed artists to acquire, adapt, and re-track.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-neon uppercase">Turn-Key Label Blueprints</div>
            </div>

            <div className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-gold">Pillar III</span>
                <h3 className="mt-2 font-display text-xl uppercase text-white">Bridging the Gap</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  An enhancement tool, not a replacement. We provide the ultimate starting line, keeping professional studio session musicians employed during final polish.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gold uppercase">Human-AI Collaboration</div>
            </div>

            <div className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-neon">Pillar IV</span>
                <h3 className="mt-2 font-display text-xl uppercase text-white">The Showcase Label</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Operating as the elite testing ground for the Suno-to-Studio pipeline, proving the commercial viability of AI-assisted major releases.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-neon uppercase">Commercial Proof of Concept</div>
            </div>
          </div>
        </section>

        {/* Featured Profile: Rosie Nguyen */}
        <section className="mt-20">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Executive Leadership</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-white sm:text-4xl">Featured Suno Authority</h2>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div onClick={() => setSelectedCreator(rosie)} className="cursor-pointer">
                <CredentialPopups
                  credentials={["Head of Creators at Suno", "Cofounder of Fanhouse (raised $22M, exited)", "1M+ Creator & Industry Leader", "Forbes 30 Under 30 Honoree"]}
                  name={rosie.name}
                  handle={rosie.handle}
                  imageUrl={rosie.imageUrl || "/manus-storage/IMG_0041_84afc747.jpeg"}
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="outline" className="border-gold/30 bg-gold/10 font-mono text-xs uppercase text-gold">
                Head of Creators at Suno
              </Badge>
              <h3 className="font-display text-4xl uppercase text-white">Rosie Nguyen</h3>
              <p className="text-base leading-8 text-muted-foreground">
                Cofounded Fanhouse, a platform that helped thousands of creators make over $20M and raised over $22M (acquired in 2023). Head of Creators &amp; Content at Suno. Content creator with experience growing and managing both personal and professional brands, growing personal accounts to 1M+.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  type="button"
                  onClick={() => setSelectedCreator(rosie)}
                  className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11 px-6"
                >
                  View Interactive Profile &amp; Highlights
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Roster Grid */}
        <section className="mt-24">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-neon">Expanded Industry Roster</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-white sm:text-4xl">Suno Business Partners &amp; Reps</h2>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => setSelectedCreator(creator)}
                className="glass-panel glow-gold group rounded-3xl border border-white/10 p-6 cursor-pointer transition hover:border-gold/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center overflow-hidden">
                      {creator.imageUrl ? (
                        <img src={creator.imageUrl} alt={creator.name} className="size-full object-cover" />
                      ) : (
                        <Users className="size-6 text-gold" />
                      )}
                    </div>
                    <Badge variant="outline" className="border-gold/20 bg-white/5 font-mono text-[10px] text-gold uppercase">
                      Active Rep
                    </Badge>
                  </div>
                  <h4 className="mt-5 font-display text-2xl uppercase text-white group-hover:text-gold transition-colors">{creator.name}</h4>
                  <p className="font-mono text-xs text-gold">{creator.role}</p>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground line-clamp-3">{creator.bio}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-muted-foreground group-hover:text-white">
                  <span>View Executive Dossier</span>
                  <ArrowUpRight className="size-4 text-gold" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suno Business Podcast / Radio Talk Broadcast Player */}
        <section className="mt-24">
          <SunoPodcastSection />
        </section>
      </div>

      <CreatorProfileDialog
        creator={selectedCreator}
        open={!!selectedCreator}
        onOpenChange={(open: boolean) => !open && setSelectedCreator(null)}
      />

      {isAdmin && (
        <CreatorEditorDialog
          creator={editingCreator}
          open={isEditorOpen}
          onOpenChange={(open: boolean) => {
            setIsEditorOpen(open);
            if (!open) setEditingCreator(null);
          }}
        />
      )}
    </SiteLayout>
  );
}
