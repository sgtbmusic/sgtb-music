import { CredentialPopups } from "@/components/suno/CredentialPopups";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { parseCredentials } from "@/lib/site";
import type { Creator } from "@shared/types";
import { BadgeCheck, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type CreatorProfileDialogProps = {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Clicking a creator card opens this dialog. It replays the social-style
 * credential pop-ups, then cuts to the full written bio.
 */
export function CreatorProfileDialog({
  creator,
  open,
  onOpenChange,
}: CreatorProfileDialogProps) {
  const [phase, setPhase] = useState<"popups" | "bio">("popups");
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (open) {
      setPhase("popups");
      setReplayKey(key => key + 1);
    }
  }, [open, creator?.id]);

  if (!creator) return null;

  const credentials = parseCredentials(creator.credentials);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden border-white/12 bg-ink p-0 text-white sm:rounded-2xl">
        <DialogTitle className="sr-only">{creator.name} profile</DialogTitle>

        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          {/* Portrait / animation column */}
          <div className="relative">
            {phase === "popups" ? (
              <CredentialPopups
                key={replayKey}
                credentials={credentials}
                name={creator.name}
                handle={creator.handle}
                imageUrl={creator.imageUrl}
                interval={1100}
                onComplete={() => setPhase("bio")}
                className="h-full rounded-none"
              />
            ) : (
              <div className="relative h-full min-h-[18rem]">
                {creator.imageUrl ? (
                  <img
                    src={creator.imageUrl}
                    alt={creator.name}
                    className="anim-rise absolute inset-0 size-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-neon/20 via-ink to-neon-alt/25">
                    <span className="font-display text-5xl text-white/25">
                      {creator.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
                />
              </div>
            )}
          </div>

          {/* Detail column */}
          <div className="relative flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <p className="font-mono text-[0.62rem] tracking-[0.3em] text-neon uppercase">
                Suno Business
              </p>
              <h2 className="font-display mt-2 text-3xl leading-none text-white uppercase sm:text-4xl">
                {creator.name}
              </h2>
              {creator.role && (
                <p className="font-condensed mt-2 flex items-center gap-1.5 text-sm tracking-[0.14em] text-white/70 uppercase">
                  <BadgeCheck className="size-4 text-neon" />
                  {creator.role}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {credentials.map(credential => (
                <span
                  key={credential}
                  className="rounded-full border border-white/15 bg-white/6 px-3 py-1 text-xs text-white/85">
                  {credential}
                </span>
              ))}
            </div>

            <div
              className="min-h-24 text-sm leading-relaxed text-white/75 transition-opacity duration-300"
              style={{
                transitionTimingFunction: "var(--ease-out)",
                opacity: phase === "bio" ? 1 : 0.25,
              }}>
              {phase === "bio" ? (
                <p className="anim-rise">{creator.bio}</p>
              ) : (
                <p className="font-mono flex items-center gap-2 text-xs tracking-[0.18em] text-neon uppercase">
                  <Sparkles className="size-3.5 animate-pulse" />
                  Loading highlights…
                </p>
              )}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-condensed border-white/20 tracking-[0.16em] text-white uppercase hover:bg-white/10"
                onClick={() => {
                  setPhase("popups");
                  setReplayKey(key => key + 1);
                }}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Replay Highlights
              </Button>
              {phase === "popups" && (
                <Button
                  size="sm"
                  className="font-condensed bg-neon/90 tracking-[0.16em] text-ink uppercase hover:bg-neon"
                  onClick={() => setPhase("bio")}>
                  Skip To Bio
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
