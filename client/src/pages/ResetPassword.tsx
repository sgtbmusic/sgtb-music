import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token"), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = trpc.auth.resetPassword.useMutation({
    onSuccess: (result) => {
      setSuccess(true);
      toast.success(result.message);
      window.setTimeout(() => setLocation("/"), 1200);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <SiteLayout>
      <div className="container flex min-h-[65vh] max-w-2xl items-center justify-center py-16">
        <div className="w-full rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_top_right,rgba(244,191,55,0.16),transparent_50%),#0b0b0e] p-7 text-center shadow-2xl sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><Lock className="size-8" /></div>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-neon">SGTB Music / Account Recovery</p>

          {!token ? (
            <>
              <h1 className="mt-4 font-display text-4xl uppercase text-white">Invalid link.</h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">This password reset link is missing its security token. Request a new password reset from the login screen.</p>
              <div className="mt-8">
                <Link href="/"><Button variant="outline" className="border-white/15 text-white hover:bg-white/5"><ShieldCheck className="mr-2 size-4" /> Return to SGTB</Button></Link>
              </div>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="mx-auto mt-5 size-9 text-neon" />
              <h1 className="mt-4 font-display text-4xl uppercase text-white">Password updated.</h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">Your password has been successfully reset. Redirecting you to SGTB Music.</p>
              <div className="mt-8">
                <Link href="/"><Button className="bg-gold text-black hover:bg-gold-soft">Sign in now</Button></Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-display text-4xl uppercase text-white">Choose new password.</h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">Enter a secure new password of at least 8 characters.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (password.length < 8) {
                  toast.error("Password must be at least 8 characters.");
                  return;
                }
                if (password !== confirmPassword) {
                  toast.error("Passwords do not match.");
                  return;
                }
                mutation.mutate({ token, newPassword: password });
              }} className="mx-auto mt-8 max-w-md space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft">New password</Label>
                  <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="border-white/12 bg-black/20 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft">Confirm password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className="border-white/12 bg-black/20 text-white" required />
                </div>
                <Button type="submit" disabled={mutation.isPending || !password || !confirmPassword} className="w-full bg-gold text-black hover:bg-gold-soft">
                  {mutation.isPending ? "Updating password..." : "Reset password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
