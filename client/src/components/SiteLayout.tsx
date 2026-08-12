import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SiteLayoutProps = {
  children: ReactNode;
  /** The Suno page opts out of the default site backdrop for its own treatment. */
  variant?: "default" | "suno";
};

export function SiteLayout({ children, variant = "default" }: SiteLayoutProps) {
  useScrollTop();

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col",
        variant === "suno" ? "bg-ink" : "bg-background",
      )}>
      {variant === "default" && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="grid-texture absolute inset-0 opacity-60" />
          <div className="absolute -top-32 -left-24 size-[36rem] rounded-full bg-gold/6 blur-[120px]" />
          <div className="absolute top-1/3 -right-32 size-[32rem] rounded-full bg-neon/6 blur-[130px]" />
        </div>
      )}
      <SiteNav />
      <main className="flex-1">
        <div className="sgtb-page-enter">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

