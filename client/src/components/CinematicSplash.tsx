import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "hasSeenIntro";
const WIPE_DURATION_MS = 900;
const FALLBACK_DURATION_MS = 2600;

type Phase = "playing" | "exiting" | "done";

export default function CinematicSplash() {
  const [phase, setPhase] = useState<Phase>(() =>
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(STORAGE_KEY) === "true"
      ? "done"
      : "playing"
  );
  const [videoFailed, setVideoFailed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginExit = useCallback(() => {
    if (phase !== "playing") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* sessionStorage unavailable */
    }
    setPhase("exiting");
    fadeTimer.current = setTimeout(
      () => setPhase("done"),
      WIPE_DURATION_MS
    );
  }, [phase]);

  // Fallback: if the video file is missing, show a branded intro briefly
  // then auto-dismiss so the user is never stuck on a black screen.
  useEffect(() => {
    if (phase !== "playing") return;
    fallbackTimer.current = setTimeout(
      () => beginExit(),
      FALLBACK_DURATION_MS
    );
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, [phase, beginExit]);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  // If the video starts playing successfully, cancel the fallback timer.
  const handleVideoReady = useCallback(() => {
    setVideoFailed(false);
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
    // Fallback timer is already running from the effect; it will dismiss.
  }, []);

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      aria-hidden={exiting}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black",
        "transition-all ease-out will-change-transform",
        exiting
          ? "pointer-events-none translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      )}
      style={{
        transitionDuration: `${WIPE_DURATION_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
        clipPath: exiting
          ? "inset(0 0 0 100%)"
          : "inset(0 0 0 0)",
      }}
    >
      {/* Placeholder video — drop your file at client/public/videos/intro.mp4 */}
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          videoFailed ? "opacity-0" : "opacity-100"
        )}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onEnded={beginExit}
        onError={handleVideoError}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>

      {/* Fallback cinematic animation when no video is present */}
      {videoFailed && <FallbackIntro />}

      {/* Cinematic letterbox bars */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[8vh] bg-black/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[8vh] bg-black/80" />

      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Skip Intro button */}
      <button
        type="button"
        onClick={beginExit}
        className={cn(
          "font-condensed absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm tracking-[0.14em] uppercase transition-all",
          "border-[oklch(0.82_0.15_88/45%)] text-[oklch(0.82_0.15_88)]",
          "hover:border-[oklch(0.82_0.15_88)] hover:bg-[oklch(0.82_0.15_88/12%)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.15_88)]",
          "backdrop-blur-sm"
        )}
        style={{ textShadow: "0 0 18px oklch(0.82 0.15 88 / 50%)" }}
      >
        Skip Intro
        <span aria-hidden className="text-base">
          →
        </span>
      </button>
    </div>
  );
}

/** Branded fallback shown when the intro video file is not yet provided. */
function FallbackIntro() {
  return (
    <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, oklch(0.82 0.15 88 / 0.18), transparent 55%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <span
          className="font-mono text-[0.62rem] tracking-[0.4em] text-[oklch(0.78_0.19_178)] uppercase"
          style={{ animation: "intro-fade-in 600ms ease-out both" }}
        >
          SGTB Music
        </span>
        <span
          className="font-display mt-4 text-5xl text-white uppercase sm:text-7xl"
          style={{
            animation: "intro-fade-in 800ms ease-out 200ms both",
            textShadow: "0 0 40px oklch(0.82 0.15 88 / 35%)",
          }}
        >
          The Bridge
        </span>
        <span
          className="font-condensed mt-2 text-sm tracking-[0.28em] text-[oklch(0.82_0.15_88)] uppercase sm:text-base"
          style={{ animation: "intro-fade-in 800ms ease-out 500ms both" }}
        >
          Suno AI → Industry-Ready Records
        </span>
        <span
          className="mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[oklch(0.82_0.15_88)] to-transparent"
          style={{ animation: "intro-bar 1.6s ease-in-out 300ms infinite" }}
        />
      </div>
      <style>{`
        @keyframes intro-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes intro-bar {
          0%, 100% { opacity: 0.3; transform: scaleX(0.7); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
