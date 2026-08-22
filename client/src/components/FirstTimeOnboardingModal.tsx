import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Music2, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export function FirstTimeOnboardingModal() {
  const { user, refresh } = useAuth();
  const [, setLocation] = useLocation();
  const [sunoHandle, setSunoHandle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [error, setError] = useState("");

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: async () => {
      await refresh();
      setLocation("/upload");
    },
    onError: (err) => {
      setError(err.message || "Failed to complete onboarding.");
    },
  });

  if (!user || user.emailVerified === 0) return null;

  // Show if user hasn't accepted agreement or hasn't set sunoHandle
  const needsOnboarding = !user.agreementAcceptedAt || !user.sunoHandle;
  if (!needsOnboarding) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 40;
    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sunoHandle.trim()) {
      setError("Please provide your Suno creator handle (e.g. @sgtbmusic).");
      return;
    }
    if (!agreed) {
      setError("You must read and accept the Platform Participation Agreement to enter SGTB Music.");
      return;
    }
    setError("");
    updateProfile.mutate({
      sunoHandle: sunoHandle.trim().startsWith("@") ? sunoHandle.trim() : `@${sunoHandle.trim()}`,
      acceptAgreement: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#D4AF37]/30 bg-[#0c0d10] p-6 md:p-8 text-[#E5E5E5] shadow-2xl shadow-[#D4AF37]/10 max-h-[90vh] flex flex-col">
        <div className="flex items-center space-x-3 mb-4 border-b border-[#D4AF37]/20 pb-4">
          <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-serif">
              Welcome to SGTB Music Group
            </h2>
            <p className="text-sm text-[#D4AF37]/80">
              The premier B2B bridge between Suno AI and major label distribution.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1 flex-1">
          <div className="space-y-2">
            <Label htmlFor="suno-handle" className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              Your Suno Creator Handle <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                id="suno-handle"
                placeholder="@sgtbmusic"
                value={sunoHandle}
                onChange={(e) => setSunoHandle(e.target.value)}
                className="bg-[#12141a] border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus-visible:ring-[#D4AF37]"
                required
              />
            </div>
            <p className="text-xs text-gray-400">
              Required for playlist consideration and creator attribution across our publishing network.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center justify-between">
              <span>Platform Participation Agreement & Community Guidelines</span>
              <span className="text-xs text-gray-400 font-normal">Please scroll to read fully</span>
            </Label>
            <div
              onScroll={handleScroll}
              tabIndex={0}
              role="region"
              aria-label="Platform Participation Agreement terms"
              className="h-44 w-full rounded-xl border border-white/10 bg-[#08090c] p-4 text-xs leading-relaxed text-gray-300 overflow-y-auto space-y-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            >
              <p className="font-semibold text-white">SGTB MUSIC GROUP — PROFESSIONAL PARTICIPATION & CONDUCT ACCORD</p>
              <p>
                By accessing SGTB Music Group, submitting reference demos, or participating in our AI-to-industry publishing pipeline, you explicitly agree to maintain professional industry standards.
              </p>
              <p>
                1. <strong>Intellectual Integrity & Respect</strong>: You agree not to engage in bad-faith defamation, malicious bashing, or coordinated harassment against SGTB Music Group, its founders, its partner labels, or Suno AI and generative music technologies.
              </p>
              <p>
                2. <strong>Security & Authorized Access</strong>: You will not attempt to bypass role gates, probe administrative endpoints, reverse-engineer platform stem packages, or compromise the integrity of the Artist Draft Pool and Executive HQ.
              </p>
              <p>
                3. <strong>Playlist Consideration & Licensing</strong>: User-submitted reference demos remain subject to editorial review by SGTB A&R and label partners. Submissions requiring Analog Re-Tracking or Vocal Realization are evaluated for commercial readiness.
              </p>
              <p>
                4. <strong>Zero Tolerance for Abuse</strong>: Violations of these community guidelines will result in immediate revocation of platform clearance, forfeiture of Cadence Club rewards, and suspension of account privileges.
              </p>
              <p className="text-[#D4AF37] italic">
                Scroll to the bottom of this agreement to enable confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="agreement-checkbox"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(Boolean(checked))}
              disabled={!hasScrolledToBottom}
              className="mt-1 border-[#D4AF37]/50 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-black"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="agreement-checkbox"
                className={`text-sm font-medium leading-snug cursor-pointer ${
                  !hasScrolledToBottom ? "text-gray-500 cursor-not-allowed" : "text-white"
                }`}
              >
                I have read and agree to the SGTB Professional Participation Agreement.
              </label>
              {!hasScrolledToBottom && (
                <p className="text-xs text-amber-400/90 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 inline" /> Please scroll through the agreement above to enable this checkbox.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-500/30 p-3 text-xs text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateProfile.isPending || !agreed || !sunoHandle.trim()}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-semibold hover:opacity-90 py-6 text-sm tracking-wider uppercase shadow-lg shadow-[#D4AF37]/20"
            >
              {updateProfile.isPending ? "Initializing Account..." : "Confirm & Enter SGTB Records"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
