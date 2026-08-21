import { useState } from "react";
import { Link } from "wouter";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: (result) => {
      setSubmitted(true);
      toast.success(result.message);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <SiteLayout>
      <div className="container flex min-h-[65vh] max-w-2xl items-center justify-center py-16">
        <div className="w-full rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_top_right,rgba(244,191,55,0.16),transparent_50%),#0b0b0e] p-7 text-center shadow-2xl sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><KeyRound className="size-8" /></div>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-neon">SGTB Music / Account Recovery</p>
          <h1 className="mt-4 font-display text-4xl uppercase text-white">Reset your password.</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Enter your account email address and we will dispatch a secure 1-hour password reset link.</p>

          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ email: email.trim() }); }} className="mx-auto mt-8 max-w-md space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-soft">Account email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                  <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 border-white/12 bg-black/20 text-white" required />
                </div>
              </div>
              <Button type="submit" disabled={mutation.isPending || !email.trim()} className="w-full bg-gold text-black hover:bg-gold-soft">
                {mutation.isPending ? "Sending reset link..." : "Send password reset link"}
              </Button>
            </form>
          ) : (
            <div className="mt-8 rounded-xl border border-neon/30 bg-neon/10 p-5 text-neon">
              <p className="text-sm">If an account matches that email address, a password reset link has been dispatched to your inbox. Please check your spam folder if it does not arrive shortly.</p>
            </div>
          )}

          <div className="mt-8">
            <Link href="/"><Button variant="outline" className="border-white/15 text-white hover:bg-white/5"><ShieldCheck className="mr-2 size-4" /> Return to SGTB</Button></Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
