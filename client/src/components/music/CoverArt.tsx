import { CURATED_COVER_ASSETS } from "@/lib/visualAssets";
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
 * Renders uploaded artwork when present. If artwork is still pending, use a
 * managed Visual DNA reference as an intentional editorial placeholder so a
 * catalog row never feels unfinished.
 */
export function CoverArt({ title, coverUrl, variant = 0, className, size = "md" }: CoverArtProps) {
  if (coverUrl) {
    return <img src={coverUrl} alt={`${title} cover art`} className={cn("size-full object-cover", className)} />;
  }

  const asset = CURATED_COVER_ASSETS[Math.abs(variant) % CURATED_COVER_ASSETS.length];
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className={cn("editorial-frame size-full", className)} role="img" aria-label={`${title} editorial placeholder cover art`}>
      <img src={asset.src} alt="" aria-hidden className="sgtb-image-hover absolute inset-0 size-full object-cover opacity-65 saturate-[0.82]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,6,5,0.2),rgba(7,6,5,0.9)),linear-gradient(0deg,rgba(212,175,55,0.2),transparent_42%)]" />
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-20" />
      <div className="gold-specular pointer-events-none absolute inset-0 opacity-60" />

      {size === "sm" ? (
        <div className="relative grid size-full place-items-center">
          <span className="font-display text-2xl leading-none text-gold-soft drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{initials || "SG"}</span>
        </div>
      ) : (
        <div className="relative flex size-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-gold-soft">SGTB</span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/65">Visual DNA</span>
          </div>
          <div>
            <span className="font-display block text-3xl uppercase leading-none text-gold-soft drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl">{initials || "SG"}</span>
            <span className="font-condensed mt-1.5 block line-clamp-2 text-xs uppercase tracking-[0.14em] text-white/85">{title}</span>
          </div>
        </div>
      )}
    </div>
  );
}
