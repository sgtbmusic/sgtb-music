import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IS_STATIC_DEPLOYMENT } from "@/lib/runtime";
import { CONTACT_EMAIL } from "@/lib/site";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  Loader2,
  Music4,
  Send,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const PROJECT_TYPES = [
  "Suno song to industry standard",
  "Song structure rebuild",
  "Mixing and mastering",
  "Distribution and release",
  "Social promotion and growth",
  "Full pipeline, start to finish",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent. We will be in touch.");
    },
    onError: error => toast.error(error.message),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim().length < 10) {
      toast.error(
        "Tell us a bit more about the project (at least 10 characters)."
      );
      return;
    }

    if (IS_STATIC_DEPLOYMENT) {
      const subject = encodeURIComponent(
        `SGTB Music project inquiry — ${projectType}`
      );
      const body = encodeURIComponent(
        [
          `Name: ${name.trim()}`,
          `Email: ${email.trim()}`,
          `Project: ${projectType}`,
          "",
          message.trim(),
        ].join("\n")
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setSubmitted(true);
      toast.success("Your email draft is ready to send.");
      return;
    }

    submit.mutate({
      name: name.trim(),
      email: email.trim(),
      projectType,
      message: message.trim(),
    });
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Start A"
        accent="Project"
        description="Send the idea, the Suno link, or the rough file. We will come back with an honest assessment of what the record needs."
      />

      <section className="container pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="grid place-items-center gap-3 py-14 text-center">
                <span className="grid size-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <CheckCircle2 className="size-7" />
                </span>
                <h2 className="font-condensed text-2xl tracking-[0.12em] uppercase">
                  {IS_STATIC_DEPLOYMENT
                    ? "Email draft ready"
                    : "Message received"}
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {IS_STATIC_DEPLOYMENT
                    ? "Your email app should open with the project details filled in. Review the draft and press send to reach SGTB Music."
                    : "Thanks for reaching out to SGTB Music. Expect a reply shortly."}
                </p>
                {IS_STATIC_DEPLOYMENT && (
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm font-medium text-gold underline-offset-4 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                )}
                <Button
                  variant="outline"
                  className="font-condensed mt-2 border-border tracking-[0.16em] uppercase hover:bg-secondary"
                  onClick={() => setSubmitted(false)}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      required
                      value={name}
                      onChange={event => setName(event.target.value)}
                      placeholder="Your name or artist name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-type">What do you need?</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="contact-type" className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Project details</Label>
                  <Textarea
                    id="contact-message"
                    required
                    rows={7}
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Where the song is now, where you want it to land, links to references or Suno sessions, and your timeline."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submit.isPending}
                  className="font-condensed w-full bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft"
                >
                  {submit.isPending ? (
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                  ) : (
                    <Send className="mr-1.5 size-4" />
                  )}
                  Send message
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h2 className="font-condensed text-xl tracking-[0.12em] text-gold uppercase">
                What to include
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2.5">
                  <Music4 className="mt-0.5 size-4 shrink-0 text-gold" />A link
                  to the Suno session, rough mix, or reference track.
                </li>
                <li className="flex gap-2.5">
                  <Workflow className="mt-0.5 size-4 shrink-0 text-gold" />
                  Where you want the record to end up — Suno, exclusive, or
                  DSPs.
                </li>
                <li className="flex gap-2.5">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                  Any deadline, release date, or campaign you are working
                  toward.
                </li>
              </ul>
            </div>

            <Link href="/suno">
              <div className="suno-nav-btn rounded-xl p-6 text-white">
                <p className="font-mono text-[0.62rem] tracking-[0.28em] text-neon uppercase">
                  Also see
                </p>
                <h3 className="font-display mt-2 text-2xl uppercase">
                  Suno Business
                </h3>
                <p className="mt-1.5 text-sm text-white/70">
                  The operators and creators shaping the Suno ecosystem.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
