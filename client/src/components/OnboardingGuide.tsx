import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, PlayCircle, Music, ShieldCheck, Gift, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

const GUIDE_STORAGE_KEY = "sgtb_onboarding_dismissed_v1";

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(GUIDE_STORAGE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  function handleDismiss() {
    setOpen(false);
    try {
      localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } catch {}
  }

  const steps = [
    {
      eyebrow: "Welcome to SGTB Music",
      title: "Humanizing Suno.",
      desc: "SGTB Music bridges the gap between AI generation and professional industry-ready mixing, arrangement, and distribution.",
      icon: Sparkles,
      action: "Next",
    },
    {
      eyebrow: "Explore the Catalog",
      title: "BeatStars Player & Vault",
      desc: "Listen to our master drafts on the /music catalog or preview our on-demand cinematic video assets in the /visuals Vault.",
      icon: Music,
      action: "Next",
    },
    {
      eyebrow: "Suno Business & Reps",
      title: "Rosie Nguyen & Roster",
      desc: "Explore executive profiles, pitch metrics, and admin-managed Suno podcast and radio talk episodes on the Suno Business page.",
      icon: ShieldCheck,
      action: "Next",
    },
    {
      eyebrow: "Member Perks & Perks",
      title: "Rewards (Coming Soon)",
      desc: "Exclusive creator drops, tokenized sync rights, and VIP staking perks are currently being forged. Stay tuned for launch!",
      icon: Gift,
      action: "Get Started",
    },
  ];

  const current = steps[step];
  const IconComponent = current.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-panel glow-gold max-w-lg border-gold/30 bg-background/95 p-6 sm:p-8 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Badge variant="outline" className="border-gold/30 bg-gold/5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            {current.eyebrow}
          </Badge>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1 text-muted-foreground hover:bg-white/10 hover:text-white"
            aria-label="Skip guide"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="py-6 text-center">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl border border-gold/30 bg-gold/10 text-gold shadow-[0_0_20px_rgba(244,191,55,0.2)]">
            <IconComponent className="size-8" />
          </div>
          <DialogTitle className="font-display text-3xl uppercase text-white sm:text-4xl">{current.title}</DialogTitle>
          <DialogDescription className="mt-4 text-sm leading-7 text-muted-foreground">{current.desc}</DialogDescription>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${idx === step ? "w-6 bg-gold" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDismiss}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-white"
            >
              Skip Guide
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleDismiss();
                }
              }}
              className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider"
            >
              {current.action} <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
