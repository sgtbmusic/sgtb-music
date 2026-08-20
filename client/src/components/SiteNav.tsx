import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SUNO_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Menu, PlayCircle, Settings2, ShieldCheck, Sparkles, User, LogOut, Disc, LayoutDashboard, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { requestIntroReplay } from "@/lib/gatewayPreferences";
import { useAuth } from "@/_core/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { startLogin } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ORGANIZED_NAV = [
  { label: "Feed", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Upload", href: "/upload" },
  { label: "DMs", href: "/messages" },
  { label: "Music", href: "/music" },
  { label: "Vault", href: "/visuals" },
  { label: "Drafts", href: "/artist-draft-pool" },
  { label: "Suno", href: "/suno" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/home") return pathname === "/home";
  return pathname === href;
}

export function SiteNav() {
  const [pathname] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const displayName = user?.name || user?.email || "Signed In";
  const userInitials = displayName.slice(0, 2).toUpperCase();
  const isPrivileged = user && (user.role === "admin" || user.role === "rep");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}>
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="shrink-0" aria-label="SGTB Music home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {ORGANIZED_NAV.map(link => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-condensed relative rounded-md px-3 py-2 text-sm tracking-[0.16em] uppercase transition-colors duration-150",
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
            className="hidden h-9 border-gold/35 bg-gold/5 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:bg-gold/15 hover:text-gold-soft md:inline-flex"
          >
            <PlayCircle className="mr-2 size-3.5" /> Watch Intro
          </Button>

          <Link href={SUNO_NAV.href} className="hidden sm:block">
            <span
              className={cn(
                "suno-nav-btn font-condensed inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm tracking-[0.18em] whitespace-nowrap text-white uppercase",
                pathname === SUNO_NAV.href && "ring-1 ring-neon/70",
              )}>
              <Sparkles className="size-3.5 text-neon" />
              {SUNO_NAV.label}
            </span>
          </Link>

          {isPrivileged && (
            <Link href="/admin-portal" className="hidden sm:block" aria-label="Admin Portal">
              <span className={cn("font-display inline-flex items-center gap-1.5 rounded-md border border-gold/50 bg-gold/10 px-3 py-1.5 text-xs uppercase tracking-wider text-gold shadow-[0_0_15px_rgba(244,191,55,0.25)] transition hover:bg-gold/25", pathname === "/admin-portal" && "ring-2 ring-gold")}>
                <ShieldCheck className="size-3.5 text-gold animate-pulse" /> Admin
              </span>
            </Link>
          )}

          <NotificationBell />

          {/* Far-Right Signed-in Profile Control */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 py-1.5 pl-2 pr-3 text-left transition hover:bg-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-gold text-[#17120a] font-display text-xs font-bold">
                    {userInitials}
                  </span>
                  <span className="hidden font-condensed text-xs uppercase tracking-wider text-white sm:inline-block max-w-[110px] truncate">
                    {displayName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 border-gold/25 bg-background/95 p-2 backdrop-blur-xl">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="font-display text-base uppercase text-white truncate">{displayName}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-gold">Role: {user.role.toUpperCase()}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 font-condensed text-sm tracking-wider uppercase text-muted-foreground hover:bg-gold/10 hover:text-white cursor-pointer rounded-md">
                    <Settings2 className="size-4 text-gold" /> Account Settings
                  </Link>
                </DropdownMenuItem>
                {isPrivileged && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin-portal" className="flex items-center gap-2.5 px-3 py-2.5 font-condensed text-sm tracking-wider uppercase text-gold hover:bg-gold/15 cursor-pointer rounded-md">
                        <ShieldCheck className="size-4 text-gold" /> Admin & Moderation
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/inbox" className="flex items-center gap-2.5 px-3 py-2.5 font-condensed text-sm tracking-wider uppercase text-neon hover:bg-neon/15 cursor-pointer rounded-md">
                        <Inbox className="size-4 text-neon" /> Secure Inbox (Leads)
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex items-center gap-2.5 px-3 py-2.5 font-condensed text-sm tracking-wider uppercase text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer rounded-md"
                >
                  <LogOut className="size-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              type="button"
              onClick={() => startLogin()}
              className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-9 px-3.5"
            >
              <User className="mr-1.5 size-3.5" /> Sign In
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border bg-card/60 xl:hidden"
                aria-label="Open navigation menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-border bg-background overflow-y-auto">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex min-h-full flex-col gap-6 px-5 py-6">
                <BrandMark />
                
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 p-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-[#17120a] font-display font-bold">
                      {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base uppercase text-white truncate">{displayName}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-gold">Role: {user.role.toUpperCase()}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {ORGANIZED_NAV.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-condensed rounded-md px-3.5 py-3 text-lg tracking-[0.14em] uppercase transition-colors duration-150",
                        isActive(pathname, link.href)
                          ? "bg-secondary text-gold"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}>
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <Button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      requestIntroReplay();
                    }}
                    variant="outline"
                    className="h-11 border-gold/35 bg-gold/5 font-mono text-xs uppercase tracking-wider text-gold hover:bg-gold/15 hover:text-gold-soft"
                  >
                    <PlayCircle className="mr-2 size-4" /> Watch Intro
                  </Button>
                  <Link href={SUNO_NAV.href}>
                    <span className="suno-nav-btn font-condensed flex items-center justify-center gap-2 rounded-md px-4 py-3 text-base tracking-[0.18em] text-white uppercase">
                      <Sparkles className="size-4 text-neon" />
                      {SUNO_NAV.label}
                    </span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-3 font-condensed text-base tracking-[0.14em] uppercase text-muted-foreground hover:border-gold/30 hover:text-gold">
                    <Settings2 className="size-4 text-gold" /> Account Settings
                  </Link>
                  {isPrivileged && (
                    <Link href="/admin-portal" className="flex items-center gap-3 rounded-md border border-gold/40 bg-gold/10 px-3 py-3 font-condensed text-base tracking-[0.14em] uppercase text-gold shadow-[0_0_20px_rgba(244,191,55,0.2)]">
                      <ShieldCheck className="size-4 text-gold" /> Admin Portal
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <Button
                      type="button"
                      onClick={() => logout()}
                      variant="ghost"
                      className="justify-start gap-3 px-3 py-3 font-condensed text-base tracking-[0.14em] uppercase text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => startLogin()}
                      className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider h-11"
                    >
                      <User className="mr-2 size-4" /> Sign In / Register
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
