import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPlayIntroOnLogin, requestIntroReplay, setPlayIntroOnLogin } from "@/lib/gatewayPreferences";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Check, PlayCircle, Settings2, ShieldCheck, User, Sparkles, LogOut, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { startLogin } from "@/const";

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [playIntroOnLogin, setPlayIntro] = useState(() => getPlayIntroOnLogin());

  function updatePreference(enabled: boolean) {
    setPlayIntro(enabled);
    setPlayIntroOnLogin(enabled);
  }

  const role = user?.role || "user";
  const isAdmin = role === "admin";
  const isRep = role === "rep";
  const isPrivileged = isAdmin || isRep;

  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 sm:py-16">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">Account Center & Preferences</p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white sm:text-7xl">Control the <span className="text-gold-gradient">signal.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">Manage your SGTB Music account identity, role clearance, gateway preferences, and platform privileges.</p>
          </div>
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/5 text-gold">
            <Settings2 className="size-6" />
          </div>
        </div>

        {/* User Profile Card */}
        <section className="glass-panel glow-gold mb-8 rounded-3xl border border-gold/20 p-6 sm:p-8">
          <h2 className="font-display text-2xl uppercase text-white">Identity & Authentication</h2>
          {isAuthenticated && user ? (
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold text-[#17120a] font-display text-2xl font-bold shadow-[0_0_20px_rgba(244,191,55,0.3)]">
                  {(user.name || user.email || "S").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-display text-2xl uppercase text-white">{user.name || user.email || "Authenticated User"}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-gold">Role: {role.toUpperCase()} {isAdmin ? "(Owner Admin)" : isRep ? "(Suno Representative)" : "(Artist / Member)"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Signed in via secure Manus OAuth</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => logout()}
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300 font-mono text-xs uppercase tracking-wider"
              >
                <LogOut className="mr-2 size-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">You are browsing as a guest. Sign in to sync your profile across devices and unlock submission rights.</p>
              </div>
              <Button
                type="button"
                onClick={() => startLogin()}
                className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider"
              >
                <User className="mr-2 size-4" /> Sign In with Manus OAuth
              </Button>
            </div>
          )}
        </section>

        {/* Role-Aware Tools Section */}
        {isPrivileged && (
          <section className="glass-panel glow-gold mb-8 rounded-3xl border border-gold/30 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-gold animate-pulse" />
              <h2 className="font-display text-2xl uppercase text-white">{isAdmin ? "Owner Admin Privileges" : "Suno Rep Clearance"}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAdmin
                ? "You hold master access to the platform. Manage submissions, moderate tracks, oversee team roles, and adjust global parameters via the Admin Portal."
                : "You are authorized as a Suno Representative (Rosie Nguyen & team). You have access to review and approve artist track submissions and moderate the platform."}
            </p>
            <div className="mt-6">
              <Button asChild className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider">
                <Link href="/admin-portal">Open Admin & Moderation Portal</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Gateway Preferences */}
        <section className="glass-panel glow-gold rounded-3xl border border-gold/20 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-neon/30 bg-neon/10 text-neon">
                <PlayCircle className="size-5" />
              </div>
              <div>
                <Label htmlFor="play-intro-on-login" className="font-display text-2xl uppercase text-white">Play Cinematic Intro on Login</Label>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">When enabled, the cinematic gateway appears the next time this browser starts a new access session. The header Watch Intro control always works as a manual override.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{playIntroOnLogin ? "Enabled" : "Disabled"}</span>
              <Switch id="play-intro-on-login" checked={playIntroOnLogin} onCheckedChange={updatePreference} aria-label="Play Cinematic Intro on Login" />
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <Button type="button" onClick={requestIntroReplay} className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider">
              <PlayCircle className="mr-2 size-4" /> Watch Intro now
            </Button>
            <div className="inline-flex items-center gap-2 rounded-md border border-neon/20 bg-neon/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
              <Check className="size-3.5" /> Saved to this browser
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-white/15 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white">
            <Link href="/home"><ArrowLeft className="mr-2 size-4" /> Back home</Link>
          </Button>
          <Button asChild variant="outline" className="border-gold/25 bg-gold/5 text-gold hover:bg-gold/10 hover:text-gold-soft">
            <Link href="/visuals">Open Cinematic Vault</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
