import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Chrome,
  Loader2,
  LockKeyhole,
  Play,
  SkipForward,
  Sparkles,
  UserRound,
  Volume2,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  chooseRandomClip,
  INTRO_CLIPS,
  TRANSITION_CLIPS,
  type IntroClip,
} from "@/lib/introMedia";

const INTRO_SEEN_KEY = "sgtb-records-intro-seen";
const AUTH_INTENT_KEY = "sgtb-records-auth-intent";
const ACCESS_MODE_KEY = "sgtb-records-access-mode";

type GatewayPhase = "splash" | "intro" | "transition" | "login";
type AuthIntent = "standard" | "rosie";

type AccessGatewayProps = {
  children: ReactNode;
};

function readSession(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Private browsing or disabled storage should not block entry.
  }
}

function clearSession(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Private browsing or disabled storage should not block entry.
  }
}

export default function AccessGateway({ children }: AccessGatewayProps) {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const hasSeenIntro = readSession(INTRO_SEEN_KEY) === "true";
  const [visible, setVisible] = useState(!hasSeenIntro);
  const [phase, setPhase] = useState<GatewayPhase>(
    hasSeenIntro ? "login" : "splash",
  );
  const [authIntent, setAuthIntent] = useState<AuthIntent>(
    readSession(AUTH_INTENT_KEY) === "rosie" ? "rosie" : "standard",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [activeClip, setActiveClip] = useState<IntroClip | null>(null);
  const [transitionClip, setTransitionClip] = useState<IntroClip | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showVideo = phase === "intro" || phase === "transition";
  const currentClip = phase === "intro" ? activeClip : transitionClip;
  const isOwner = user?.role === "admin";

  const phaseLabel = useMemo(() => {
    if (phase === "intro") return "Opening the vault";
    if (phase === "transition") return "Unlocking the next frequency";
    return "SGTB Records access terminal";
  }, [phase]);

  useEffect(() => {
    if (!visible || !showVideo || !currentClip) return;

    setMediaError(false);
    const video = videoRef.current;
    if (video) {
      video.load();
      void video.play().catch(() => {
        setMediaError(true);
      });
    }

    const fallbackTimer = window.setTimeout(() => {
      if (phase === "intro") {
        setTransitionClip(chooseRandomClip(TRANSITION_CLIPS));
        setPhase("transition");
      } else {
        revealLogin();
      }
    }, 7800);

    return () => window.clearTimeout(fallbackTimer);
  }, [currentClip, phase, showVideo, visible]);

  useEffect(() => {
    if (!mediaError || !showVideo) return;

    const errorTimer = window.setTimeout(() => {
      if (phase === "intro") {
        setTransitionClip(chooseRandomClip(TRANSITION_CLIPS));
        setPhase("transition");
      } else {
        revealLogin();
      }
    }, 650);

    return () => window.clearTimeout(errorTimer);
  }, [mediaError, phase, showVideo]);

  useEffect(() => {
    if (!visible || phase !== "login" || loading || !isAuthenticated) return;

    if (authIntent === "rosie") {
      if (isOwner) {
        closeGateway("/suno");
      } else {
        setNotice(
          "VIP access requires the authorized SGTB owner account. Choose Guest or continue with a standard sign-in.",
        );
        setAuthIntent("standard");
        clearSession(AUTH_INTENT_KEY);
      }
      return;
    }

    closeGateway("/artist-draft-pool");
  }, [authIntent, isAuthenticated, isOwner, loading, phase, visible]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  function beginEntry() {
    if (isStarting) return;
    setIsStarting(true);
    writeSession("sgtb-records-entry-interacted", "true");
    setActiveClip(chooseRandomClip(INTRO_CLIPS));
    setTransitionClip(chooseRandomClip(TRANSITION_CLIPS));
    setPhase("intro");
    setIsStarting(false);
  }

  function handleVideoEnd() {
    if (phase === "intro") {
      setTransitionClip(chooseRandomClip(TRANSITION_CLIPS));
      setPhase("transition");
      return;
    }
    revealLogin();
  }

  function skipIntro() {
    writeSession(INTRO_SEEN_KEY, "true");
    revealLogin();
  }

  function revealLogin() {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    setIsExiting(true);
    revealTimerRef.current = setTimeout(() => {
      setIsExiting(false);
      setPhase("login");
      revealTimerRef.current = null;
    }, 620);
  }

  function closeGateway(destination: "/artist-draft-pool" | "/suno") {
    if (!visible || revealTimerRef.current) return;
    writeSession(INTRO_SEEN_KEY, "true");
    writeSession(ACCESS_MODE_KEY, destination === "/suno" ? "rosie" : "standard");
    setIsExiting(true);
    revealTimerRef.current = setTimeout(() => {
      setVisible(false);
      navigate(destination);
      revealTimerRef.current = null;
    }, 620);
  }

  function submitStandardLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setNotice("Enter an email and password to continue to secure sign-in.");
      return;
    }
    setNotice(null);
    setAuthIntent("standard");
    writeSession(AUTH_INTENT_KEY, "standard");
    startLogin();
  }

  function continueWithGoogle() {
    setNotice(null);
    setAuthIntent("standard");
    writeSession(AUTH_INTENT_KEY, "standard");
    startLogin();
  }

  function enterRosieTerminal() {
    setNotice(null);
    setAuthIntent("rosie");
    writeSession(AUTH_INTENT_KEY, "rosie");
    if (isAuthenticated && isOwner) {
      closeGateway("/suno");
      return;
    }
    startLogin();
  }

  function enterAsGuest() {
    setNotice(null);
    clearSession(AUTH_INTENT_KEY);
    writeSession(ACCESS_MODE_KEY, "guest");
    closeGateway("/artist-draft-pool");
  }

  if (!visible) return <>{children}</>;

  return (
    <>
      {children}
      <div
        className={[
          "fixed inset-0 z-[100] overflow-hidden bg-[#050506] text-foreground",
          isExiting ? "sgtb-splash-exit" : "",
        ].join(" ")}
        aria-label="SGTB Records entry gateway"
      >
        {phase === "splash" && (
          <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-10">
            <div aria-hidden className="absolute inset-0 bg-[#050506]" />
            <div aria-hidden className="absolute -left-24 top-1/4 size-[34rem] rounded-full bg-gold/10 blur-[130px]" />
            <div aria-hidden className="absolute -right-20 bottom-0 size-[30rem] rounded-full bg-neon-alt/10 blur-[150px]" />
            <div aria-hidden className="grid-texture absolute inset-0 opacity-25" />

            <div className="relative z-10 w-full max-w-4xl text-center">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-gold/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
                <span className="size-2 animate-pulse rounded-full bg-neon" />
                SGTB Records / Private Frequency
              </div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.34em] text-muted-foreground">
                A human signal in the machine
              </p>
              <h1 className="mx-auto max-w-4xl font-display text-[clamp(4.5rem,15vw,10.5rem)] uppercase leading-[0.78] tracking-tight text-white">
                Enter <span className="text-gold-gradient">SGTB</span>
                <br />
                <span className="text-neon-gradient">Records</span>
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
                Press once to activate the full audiovisual experience, open the vault, and move from the idea to the record.
              </p>
              <button
                type="button"
                onClick={beginEntry}
                disabled={isStarting}
                className="group relative mx-auto mt-11 flex min-h-16 items-center justify-center gap-4 rounded-full border border-gold/70 bg-gold px-8 py-4 font-display text-2xl uppercase tracking-[0.08em] text-[#17120a] shadow-[0_0_0_1px_rgba(252,210,82,0.25),0_0_40px_rgba(244,191,55,0.3)] transition hover:scale-[1.02] hover:bg-gold-soft disabled:opacity-70"
              >
                <span className="absolute inset-[-10px] animate-ping rounded-full border border-gold/40 opacity-20" />
                {isStarting ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5 fill-current" />}
                <span>Enter SGTB Records</span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <Volume2 className="size-3" /> Click to enable audio
              </p>
            </div>
          </div>
        )}

        {showVideo && currentClip && (
          <div className="relative flex min-h-dvh items-center justify-center bg-black">
            <video
              ref={videoRef}
              key={currentClip.id}
              className="absolute inset-0 size-full object-cover opacity-80"
              src={currentClip.src}
              poster={currentClip.poster}
              muted={false}
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              onError={() => setMediaError(true)}
              aria-label={currentClip.label}
            />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.75)_100%)]" />
            <div aria-hidden className="noise-texture absolute inset-0 opacity-10" />
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-6 sm:p-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">{phaseLabel}</p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-white/65">
                  {mediaError ? "Preparing the next frame..." : currentClip.label}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={skipIntro}
                className="shrink-0 border-gold/45 bg-black/30 text-gold-soft backdrop-blur hover:bg-gold/10 hover:text-white"
              >
                Skip intro <SkipForward className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "login" && !isExiting && (
          <div className="relative flex min-h-dvh items-center justify-center overflow-y-auto px-5 py-10 sm:px-8">
            <div aria-hidden className="absolute inset-0 bg-[#070709]" />
            <div aria-hidden className="absolute left-0 top-1/4 size-[32rem] rounded-full bg-gold/8 blur-[140px]" />
            <div aria-hidden className="absolute right-0 bottom-0 size-[28rem] rounded-full bg-neon-alt/10 blur-[140px]" />
            <div aria-hidden className="grid-texture absolute inset-0 opacity-20" />

            <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="hidden lg:block">
                <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
                  <span className="size-2 rounded-full bg-neon shadow-[0_0_14px_rgba(98,255,222,0.8)]" />
                  Secure access terminal
                </div>
                <h2 className="max-w-md font-display text-7xl uppercase leading-[0.82] text-white">
                  Your next <span className="text-gold-gradient">record</span> starts here.
                </h2>
                <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
                  Enter the SGTB Music workspace for the Artist Draft Pool, production pipeline, and release-ready catalog.
                </p>
                <div className="mt-10 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="rounded-full border border-white/10 px-3 py-2">Humanized</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Engineered</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Industry ready</span>
                </div>
              </div>

              <div className="glass-panel glow-gold mx-auto w-full max-w-xl rounded-[2rem] p-6 shadow-2xl sm:p-8">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-soft">
                      <LockKeyhole className="size-3.5" />
                      {phaseLabel}
                    </div>
                    <h3 className="mt-3 font-display text-5xl uppercase leading-none text-white">Sign in</h3>
                  </div>
                  <div className="hidden size-12 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-gold sm:flex">
                    <Sparkles className="size-5" />
                  </div>
                </div>

                <form onSubmit={submitStandardLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gateway-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</Label>
                    <Input
                      id="gateway-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@sgtbmusic.com"
                      autoComplete="email"
                      className="h-12 border-white/12 bg-black/20 text-white placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gateway-password" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Password</Label>
                    <Input
                      id="gateway-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="h-12 border-white/12 bg-black/20 text-white placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <Button type="submit" className="h-12 w-full bg-gold font-display text-xl uppercase tracking-[0.08em] text-[#17120a] hover:bg-gold-soft">
                    Continue to secure sign-in <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>

                <p className="mt-4 text-center text-[10px] leading-5 text-muted-foreground">
                  This terminal currently hands off to the existing Manus OAuth sign-in flow. The email and password fields are present for the VIP-tier interface but are not stored or checked locally.
                </p>

                <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="h-px flex-1 bg-white/10" />
                  or
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={continueWithGoogle}
                  className="h-12 w-full border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                >
                  <Chrome className="mr-2 size-4" /> Continue with Google
                </Button>
                <p className="mt-3 text-center text-[10px] leading-5 text-muted-foreground">
                  The secure provider chooser opens next; select Google there when it is available for your account.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button type="button" variant="outline" onClick={enterAsGuest} className="h-12 border-neon/30 bg-neon/5 text-neon hover:bg-neon/10">
                    <UserRound className="mr-2 size-4" /> Guest
                  </Button>
                  <Button type="button" onClick={enterRosieTerminal} className="h-12 border border-red-500/45 bg-gradient-to-r from-red-950 via-[#8b2c1f] to-gold/70 font-semibold text-white shadow-[0_0_28px_rgba(198,61,43,0.25)] hover:from-red-900 hover:to-gold/80">
                    🌹 Rosie Nguyen 🌹
                  </Button>
                </div>

                {notice && (
                  <p role="alert" className="mt-5 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-xs leading-5 text-gold-soft">
                    {notice}
                  </p>
                )}
                <p className="mt-6 text-center text-[10px] leading-5 text-muted-foreground">
                  The Rosie terminal is protected by the existing owner/admin account. The button never grants VIP access by itself.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
