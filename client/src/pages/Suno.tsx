import { SiteLayout } from "@/components/SiteLayout";
import { CreatorEditorDialog } from "@/components/suno/CreatorEditorDialog";
import { CreatorProfileDialog } from "@/components/suno/CreatorProfileDialog";
import { CredentialPopups } from "@/components/suno/CredentialPopups";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOwner } from "@/hooks/useOwner";
import { STATIC_CREATORS } from "@/lib/publicContent";
import { IS_STATIC_DEPLOYMENT } from "@/lib/runtime";
import { parseCredentials } from "@/lib/site";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { Creator } from "@shared/types";
import {
  BadgeCheck,
  MousePointerClick,
  Plus,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function Suno() {
  const { isOwner } = useOwner();
  const { data: creatorData } = trpc.creators.list.useQuery(undefined, {
    enabled: !IS_STATIC_DEPLOYMENT,
    initialData: STATIC_CREATORS,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });
  const creators = creatorData?.length ? creatorData : STATIC_CREATORS;

  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState<Creator | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<Creator | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const featured = useMemo(
    () =>
      creators.find(creator => creator.isFeatured) ??
      creators[0] ??
      STATIC_CREATORS[0]!,
    [creators]
  );
  const others = useMemo(
    () => creators.filter(creator => creator.id !== featured.id),
    [creators, featured.id]
  );

  const featuredCredentials = parseCredentials(featured?.credentials);

  function openProfile(creator: Creator) {
    setSelected(creator);
    setProfileOpen(true);
  }

  function openEditor(creator: Creator | null, isCreate: boolean) {
    setEditorTarget(creator);
    setCreateMode(isCreate);
    setEditorOpen(true);
  }

  return (
    <SiteLayout variant="suno">
      {/* Distinct Suno backdrop: deep ink, aurora bloom, scanline grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-ink"
      >
        <div className="absolute -top-40 left-1/4 size-[42rem] rounded-full bg-neon/10 blur-[150px]" />
        <div className="absolute top-1/2 -right-40 size-[38rem] rounded-full bg-neon-alt/12 blur-[150px]" />
        <div className="absolute -bottom-40 left-0 size-[34rem] rounded-full bg-rose-500/8 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(1 0 0 / 3%) 0px, oklch(1 0 0 / 3%) 1px, transparent 1px, transparent 4px)",
          }}
        />
      </div>

      <section className="relative">
        <div className="container pt-14 pb-10 lg:pt-20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="glass-panel font-mono inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.62rem] tracking-[0.28em] text-neon uppercase">
                <Sparkles className="size-3.5" />
                Suno Business 101
              </span>
              <h1 className="font-display mt-6 text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.9] text-white uppercase">
                The People
                <br />
                <span className="text-neon-gradient">Behind Suno</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                SGTB Music builds directly on the Suno ecosystem. This is the
                room — the operators, creators, and platform leaders shaping how
                music gets made and monetized next.
              </p>
            </div>

            {/* Owner-only settings entry */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Manage creator profiles"
                      onClick={() => setManageMode(value => !value)}
                      className={cn(
                        "border-white/20 text-white hover:bg-white/10",
                        manageMode && "border-neon/60 bg-neon/15 text-neon"
                      )}
                    >
                      <Settings
                        className={cn(
                          "size-4.5",
                          manageMode && "anim-spin-slow"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {manageMode
                      ? "Exit manage mode"
                      : "Manage profiles (owner only)"}
                  </TooltipContent>
                </Tooltip>
                {manageMode && (
                  <Button
                    size="sm"
                    className="font-condensed bg-neon tracking-[0.14em] text-ink uppercase hover:bg-neon/85"
                    onClick={() => openEditor(null, true)}
                  >
                    <Plus className="mr-1 size-4" />
                    Add profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Featured: Rosie ---------------- */}
      <section className="container pb-14">
        <div
          data-testid="suno-featured-profile"
          className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
        >
          {/* Auto-playing notification stack on page load */}
          <div className="relative">
            {!introDone ? (
              <CredentialPopups
                credentials={featuredCredentials}
                name={featured.name}
                handle={featured.handle}
                imageUrl={featured.imageUrl}
                interval={1200}
                onComplete={() => setIntroDone(true)}
                className="h-full min-h-[22rem] border border-white/12 sm:min-h-[26rem]"
              />
            ) : (
              <button
                type="button"
                onClick={() => openProfile(featured)}
                aria-label={`Open ${featured.name}'s profile`}
                className="group relative block h-full min-h-[22rem] w-full overflow-hidden rounded-2xl border border-white/12 text-left sm:min-h-[26rem]"
              >
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.name}
                    width={900}
                    height={900}
                    loading="eager"
                    decoding="async"
                    className="anim-rise absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/20 to-neon-alt/25" />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-[0.62rem] tracking-[0.28em] text-neon uppercase">
                    Featured Profile
                  </p>
                  <h2 className="font-display mt-2 text-4xl leading-none text-white uppercase sm:text-5xl">
                    {featured.name}
                  </h2>
                  <p className="font-condensed mt-2 flex items-center gap-1.5 text-sm tracking-[0.14em] text-white/75 uppercase">
                    <BadgeCheck className="size-4 text-neon" />
                    {featured.role}
                  </p>
                  <span className="font-mono mt-4 inline-flex items-center gap-1.5 rounded-full border border-neon/50 bg-neon/12 px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-neon uppercase">
                    <MousePointerClick className="size-3.5" />
                    Click the profile
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Credential + bio panel */}
          <div className="glass-panel relative flex flex-col justify-center overflow-hidden rounded-2xl p-6 sm:p-9">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-64 rounded-full bg-neon/12 blur-3xl"
            />
            <p className="font-mono relative text-[0.62rem] tracking-[0.3em] text-neon uppercase">
              Credentials
            </p>

            <ul className="relative mt-5 space-y-2.5">
              {featuredCredentials.map((credential, index) => (
                <li
                  key={credential}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                  style={{
                    animation: `sgtb-rise 520ms var(--ease-out) ${index * 70}ms both`,
                  }}
                >
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-neon" />
                  <span className="text-sm text-white/90">{credential}</span>
                </li>
              ))}
            </ul>

            <p className="relative mt-6 text-sm leading-relaxed text-white/70">
              {featured.bio}
            </p>

            <div className="relative mt-7 flex flex-wrap gap-2">
              <Button
                className="font-condensed bg-neon tracking-[0.16em] text-ink uppercase hover:bg-neon/85"
                onClick={() => openProfile(featured)}
              >
                Open Full Profile
              </Button>
              {isOwner && manageMode && (
                <Button
                  variant="outline"
                  className="font-condensed border-white/20 tracking-[0.16em] text-white uppercase hover:bg-white/10"
                  onClick={() => openEditor(featured, false)}
                >
                  <Settings className="mr-1.5 size-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Team grid ---------------- */}
      <section className="container pb-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[0.62rem] tracking-[0.3em] text-neon uppercase">
              The Roster
            </p>
            <h2 className="font-display mt-2 text-3xl text-white uppercase sm:text-4xl">
              More Suno Operators
            </h2>
          </div>
          <p className="font-mono max-w-sm text-[0.68rem] leading-relaxed tracking-[0.08em] text-white/45 uppercase">
            Reserved slots. Details are added by the site owner.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((creator, index) => {
            const credentials = parseCredentials(creator.credentials);
            return (
              <div key={creator.id} className="relative">
                <button
                  type="button"
                  onClick={() => openProfile(creator)}
                  aria-label={`Open ${creator.name}'s profile`}
                  className="group relative block aspect-4/5 w-full overflow-hidden rounded-xl border border-white/12 text-left transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    transitionTimingFunction: "var(--ease-out)",
                    animation: `sgtb-rise 520ms var(--ease-out) ${index * 60}ms both`,
                  }}
                >
                  {creator.imageUrl ? (
                    <img
                      src={creator.imageUrl}
                      alt={creator.name}
                      className="absolute inset-0 size-full object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-ink to-neon/10">
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(135deg, oklch(1 0 0 / 4%) 0 10px, transparent 10px 20px)",
                        }}
                      />
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="grid size-16 place-items-center rounded-full border border-white/15 bg-white/5 text-white/35">
                          <UserRound className="size-7" />
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {creator.isPlaceholder && (
                      <span className="font-mono mb-2 inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.58rem] tracking-[0.2em] text-white/55 uppercase">
                        Open slot
                      </span>
                    )}
                    <h3 className="font-condensed text-xl leading-tight tracking-[0.06em] text-white uppercase">
                      {creator.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-white/60">
                      {creator.role}
                    </p>
                    <p className="font-mono mt-2 truncate text-[0.6rem] tracking-[0.16em] text-neon/80 uppercase">
                      {creator.isPlaceholder
                        ? "Reserved profile"
                        : `${credentials.length} highlights`}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl ring-0 ring-neon/0 transition-all duration-200 group-hover:ring-1 group-hover:ring-neon/50"
                  />
                </button>

                {isOwner && manageMode && (
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Edit ${creator.name}`}
                    onClick={() => openEditor(creator, false)}
                    className="absolute top-3 right-3 border-white/25 bg-ink/70 text-white backdrop-blur hover:bg-ink"
                  >
                    <Settings className="size-4" />
                  </Button>
                )}
              </div>
            );
          })}

          {isOwner && manageMode && (
            <button
              type="button"
              onClick={() => openEditor(null, true)}
              className="grid aspect-4/5 w-full place-items-center rounded-xl border border-dashed border-white/20 text-white/50 transition-colors duration-150 hover:border-neon/50 hover:text-neon"
            >
              <span className="flex flex-col items-center gap-2">
                <Plus className="size-7" />
                <span className="font-condensed text-sm tracking-[0.16em] uppercase">
                  Add profile
                </span>
              </span>
            </button>
          )}
        </div>
      </section>

      <CreatorProfileDialog
        creator={selected}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
      <CreatorEditorDialog
        creator={editorTarget}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        createMode={createMode}
      />
    </SiteLayout>
  );
}
