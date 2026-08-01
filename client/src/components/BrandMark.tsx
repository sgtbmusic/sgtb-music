import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-md border border-gold/40 bg-gradient-to-br from-gold/25 to-transparent">
        <span className="anim-eq flex h-4 items-end gap-[2px]">
          <span className="w-[2px] origin-bottom rounded-full bg-gold" style={{ height: "100%", animationDelay: "0ms" }} />
          <span className="w-[2px] origin-bottom rounded-full bg-gold" style={{ height: "100%", animationDelay: "140ms" }} />
          <span className="w-[2px] origin-bottom rounded-full bg-neon" style={{ height: "100%", animationDelay: "280ms" }} />
          <span className="w-[2px] origin-bottom rounded-full bg-gold" style={{ height: "100%", animationDelay: "420ms" }} />
        </span>
      </span>
      <span className="leading-none">
        <span className="font-display block text-lg tracking-wide text-gold-gradient">SGTB</span>
        <span className="font-condensed block text-[0.68rem] tracking-[0.3em] text-muted-foreground">
          MUSIC
        </span>
      </span>
    </span>
  );
}
