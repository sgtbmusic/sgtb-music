import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle2, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [status, setStatus] = useState<"waiting" | "verifying" | "verified" | "error">("waiting");
  const [resendEmail, setResendEmail] = useState("");
  const didVerify = useRef(false);
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token"), []);
  const sent = new URLSearchParams(window.location.search).get("sent");

  const verifyMutation = trpc.profile.verifyEmail.useMutation({
    onSuccess: async () => {
      setStatus("verified");
      await utils.auth.me.invalidate();
      toast.success("Email confirmed. Welcome to SGTB Music.");
      window.setTimeout(() => setLocation("/"), 900);
    },
    onError: (error) => {
      setStatus("error");
      toast.error(error.message);
    },
  });
  const resendMutation = trpc.profile.sendVerificationEmail.useMutation({
    onSuccess: (result) => toast.success(result.message),
    onError: (error) => toast.error(error.message),
  });
  const publicResendMutation = trpc.auth.resendVerification.useMutation({
    onSuccess: (result) => toast.success(result.message),
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (user?.email) setResendEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!token || didVerify.current) return;
    didVerify.current = true;
    setStatus("verifying");
    verifyMutation.mutate({ token });
  }, [token, verifyMutation]);

  return (
    <SiteLayout>
      <div className="container flex min-h-[65vh] max-w-2xl items-center justify-center py-16">
        <div className="w-full rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_top_right,rgba(244,191,55,0.16),transparent_50%),#0b0b0e] p-7 text-center shadow-2xl sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><MailCheck className="size-8" /></div>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-neon">SGTB Music / Account Security</p>
          {status === "verifying" && <><h1 className="mt-4 font-display text-4xl uppercase text-white">Confirming your email.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Validating your secure confirmation link and activating your account session.</p></>}
          {status === "verified" && <><CheckCircle2 className="mx-auto mt-5 size-9 text-neon" /><h1 className="mt-4 font-display text-4xl uppercase text-white">Account confirmed.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Your email is verified. Redirecting you into the SGTB Music network.</p></>}
          {status === "error" && <><h1 className="mt-4 font-display text-4xl uppercase text-white">Link unavailable.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">This confirmation link is invalid or expired. Request a new link from your account.</p></>}
          {status === "waiting" && <><h1 className="mt-4 font-display text-4xl uppercase text-white">Check your inbox.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">{sent === "0" ? "We could not dispatch the confirmation email. Check the configured sender or try again." : user?.email ? `We sent a confirmation link to ${user.email}. Click it to activate your account.` : "Open the confirmation link from your SGTB Music email to activate your account."}</p></>}

          {status !== "verified" && <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
            <Label htmlFor="verification-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft">Account email</Label>
            <Input id="verification-email" type="email" value={resendEmail} onChange={(event) => setResendEmail(event.target.value)} placeholder="you@example.com" className="border-white/12 bg-black/20 text-white" />
          </div>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {status !== "verified" && <Button onClick={() => isAuthenticated ? resendMutation.mutate() : publicResendMutation.mutate({ email: resendEmail.trim() })} disabled={!resendEmail.trim() || resendMutation.isPending || publicResendMutation.isPending} className="bg-gold text-black hover:bg-gold-soft"><RefreshCw className={`mr-2 size-4 ${(resendMutation.isPending || publicResendMutation.isPending) ? "animate-spin" : ""}`} /> Resend confirmation</Button>}
            <Link href="/"><Button variant="outline" className="border-white/15 text-white hover:bg-white/5"><ShieldCheck className="mr-2 size-4" /> Return to SGTB</Button></Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
