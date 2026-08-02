import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CredentialPopupsProps = {
  /** Highlight lines shown one-by-one inside the notification cards. */
  credentials: string[];
  name: string;
  handle?: string | null;
  imageUrl?: string | null;
  /** Fires once the final credential has been shown. */
  onComplete?: () => void;
  /** Milliseconds each card stays on screen. */
  interval?: number;
  className?: string;
};

const KINDS = [
  { icon: UserPlus, verb: "started following", tint: "text-neon" },
  { icon: Heart, verb: "liked this", tint: "text-rose-400" },
  { icon: Repeat2, verb: "reposted", tint: "text-emerald-400" },
  { icon: MessageCircle, verb: "commented", tint: "text-sky-400" },
] as const;

/**
 * Social-media-style notification stack. Cards slide in over a blurred portrait,
 * each carrying one of the subject's highlights, then the sequence settles.
 */
export function CredentialPopups({
  credentials,
  name,
  handle,
  imageUrl,
  onComplete,
  interval = 1250,
  className,
}: CredentialPopupsProps) {
  const items = useMemo(() => credentials.filter(Boolean), [credentials]);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (items.length === 0) {
      onComplete?.();
      return;
    }

    const timers: number[] = [];
    items.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => setShown(index + 1), 260 + index * interval)
      );
    });
    timers.push(
      window.setTimeout(
        () => onComplete?.(),
        260 + items.length * interval + 900
      )
    );

    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, interval]);

  return (
    <div
      data-testid="credential-popups"
      className={cn("relative isolate overflow-hidden rounded-2xl", className)}
    >
      {/* Blurred portrait backdrop */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          width={900}
          height={900}
          loading="eager"
          decoding="async"
          className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-2xl"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-neon/20 via-transparent to-neon-alt/25"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-ink/55" />
      <div
        aria-hidden
        className="noise-texture absolute inset-0 opacity-[0.06]"
      />

      <div className="relative flex min-h-[22rem] flex-col justify-end gap-2 p-3.5 sm:min-h-[26rem] sm:gap-2.5 sm:p-6">
        {items.map((credential, index) => {
          const kind = KINDS[index % KINDS.length];
          const visible = index < shown;
          return (
            <div
              key={`${credential}-${index}`}
              role="status"
              aria-hidden={!visible}
              className="glass-panel flex items-center gap-3 rounded-xl px-3 py-2.5 shadow-lg transition-all duration-300 will-change-transform sm:px-3.5 sm:py-3"
              style={{
                transitionTimingFunction: "var(--ease-out)",
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0) scale(1)"
                  : "translateY(16px) scale(0.96)",
              }}
            >
              <span className="relative shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    loading="eager"
                    decoding="async"
                    className="size-10 rounded-full object-cover ring-1 ring-white/25"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-neon/20 text-sm font-semibold text-neon">
                    {name.slice(0, 1)}
                  </span>
                )}
                <span className="absolute -right-0.5 -bottom-0.5 grid size-4.5 place-items-center rounded-full bg-ink">
                  <kind.icon className={cn("size-3", kind.tint)} />
                </span>
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="truncate font-semibold text-white">
                    {name}
                  </span>
                  <BadgeCheck className="size-3.5 shrink-0 text-neon" />
                  <span className="truncate">{kind.verb}</span>
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-medium text-white">
                  {credential}
                </p>
              </div>

              {handle && (
                <span className="font-mono hidden shrink-0 text-[0.65rem] text-white/45 sm:block">
                  {handle}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
