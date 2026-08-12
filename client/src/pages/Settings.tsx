import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPlayIntroOnLogin, requestIntroReplay, setPlayIntroOnLogin } from "@/lib/gatewayPreferences";
import { ArrowLeft, Check, PlayCircle, Settings2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Settings() {
  const [playIntroOnLogin, setPlayIntro] = useState(() => getPlayIntroOnLogin());

  function updatePreference(enabled: boolean) {
    setPlayIntro(enabled);
    setPlayIntroOnLogin(enabled);
  }

  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 sm:py-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">Profile / Preferences</p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white sm:text-7xl">Control the <span className="text-gold-gradient">signal.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">Tune how the SGTB Records gateway behaves on this browser. Your preference is saved locally and does not change the server authentication flow.</p>
          </div>
          <div className="hidden size-14 place-items-center rounded-2xl border border-gold/25 bg-gold/5 text-gold sm:grid">
            <Settings2 className="size-6" />
          </div>
        </div>

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
            <Button type="button" onClick={requestIntroReplay} className="bg-gold text-[#17120a] hover:bg-gold-soft">
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
