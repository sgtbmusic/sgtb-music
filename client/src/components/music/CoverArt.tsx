import { coverTemplate } from "@/lib/site";
import { cn } from "@/lib/utils";

type CoverArtProps = {
  title: string;
  coverUrl?: string | null;
  variant?: number;
  className?: string;
  /** Larger renders show the full typographic template. */
  size?: "sm" | "md" | "lg";
};

/**
 * Renders uploaded artwork when present, otherwise a generated template cover
 * that keeps the catalog looking intentional before real art exists.
 */
export function CoverArt({
  title,
  coverUrl,
  variant = 0,
  className,
  size = "md",
}: CoverArtProps) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover art`}
        className={cn("size-full object-cover", className)}
      />
    );
  }

  const template = coverTemplate(variant);
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn("relative size-full overflow-hidden", className)}
      style={{
        backgroundImage: `linear-gradient(145deg, ${template.from}, ${template.to})`,
      }}
      role="img"
      aria-label={`${title} placeholder cover art`}>
      {/* Concentric groove rings */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 68% 30%, ${template.accent}22 0 1px, transparent 1px 9px)`,
        }}
      />
      {/* Diagonal hairlines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, oklch(1 0 0 / 8%) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 85%, ${template.accent}26, transparent 60%)`,
        }}
      />

      {size === "sm" ? (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="font-display text-lg leading-none"
            style={{ color: template.accent }}>
            {initials || "SG"}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-start justify-between">
            <span
              className="font-mono text-[0.55rem] tracking-[0.28em] uppercase opacity-80"
              style={{ color: template.accent }}>
              SGTB
            </span>
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-white/45 uppercase">
              Master
            </span>
          </div>

          <div>
            <span
              className="font-display block text-3xl leading-none uppercase sm:text-4xl"
              style={{ color: template.accent }}>
              {initials || "SG"}
            </span>
            <span className="font-condensed mt-1.5 block line-clamp-2 text-xs tracking-[0.14em] text-white/70 uppercase">
              {title}
            </span>
          </div>
        </div>
      )}

      {/* Sheen */}
      <div
        aria-hidden
        className="absolute -top-1/2 left-0 h-[200%] w-1/3 rotate-12 bg-white/6 blur-2xl"
      />
    </div>
  );
}
