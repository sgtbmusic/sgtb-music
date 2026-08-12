import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, SUNO_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Menu, PlayCircle, Settings2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { requestIntroReplay } from "@/lib/gatewayPreferences";

function isActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/" || pathname === "/home";
  return pathname === href;
}

export function SiteNav() {
  const [pathname] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/home" className="shrink-0" aria-label="SGTB Music home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map(link => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-condensed relative rounded-md px-3.5 py-2 text-sm tracking-[0.16em] uppercase transition-colors duration-150",
                  active
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                {link.label}
                <span
                  className={cn(
                    "gold-hairline absolute inset-x-2 -bottom-px h-px origin-center transition-transform duration-200",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={requestIntroReplay}
            variant="outline"
            className="hidden h-9 border-gold/35 bg-gold/5 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:bg-gold/15 hover:text-gold-soft sm:inline-flex"
          >
            <PlayCircle className="mr-2 size-3.5" /> Watch Intro
          </Button>
          <Link href="/settings" className="hidden lg:block" aria-label="Open settings">
            <span className={cn("grid size-9 place-items-center rounded-md border border-white/10 text-muted-foreground transition hover:border-gold/30 hover:text-gold", pathname === "/settings" && "border-gold/35 bg-gold/5 text-gold")}>
              <Settings2 className="size-4" />
            </span>
          </Link>
          <Link href={SUNO_NAV.href} className="hidden sm:block">
            <span
              className={cn(
                "suno-nav-btn font-condensed inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm tracking-[0.18em] whitespace-nowrap text-white uppercase",
                pathname === SUNO_NAV.href && "ring-1 ring-neon/70",
              )}>
              <Sparkles className="size-3.5 text-neon" />
              {SUNO_NAV.label}
            </span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border bg-card/60 lg:hidden"
                aria-label="Open navigation menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-border bg-background">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-8 px-5 py-6">
                <BrandMark />
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {NAV_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-condensed rounded-md px-3 py-3 text-lg tracking-[0.14em] uppercase transition-colors duration-150",
                        isActive(pathname, link.href)
                          ? "bg-secondary text-gold"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    requestIntroReplay();
                  }}
                  variant="outline"
                  className="h-12 border-gold/35 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:bg-gold/15 hover:text-gold-soft"
                >
                  <PlayCircle className="mr-2 size-4" /> Watch Intro
                </Button>
                <Link href="/settings" className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-3 font-condensed text-lg tracking-[0.14em] uppercase text-muted-foreground hover:border-gold/30 hover:text-gold">
                  <Settings2 className="size-4" /> Settings
                </Link>
                <Link href={SUNO_NAV.href}>
                  <span className="suno-nav-btn font-condensed flex items-center justify-center gap-2 rounded-md px-4 py-3 text-base tracking-[0.18em] text-white uppercase">
                    <Sparkles className="size-4 text-neon" />
                    {SUNO_NAV.label}
                  </span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
