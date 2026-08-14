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
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Loader2, Music4, Send, Sparkles, Workflow } from "lucide-react";
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
      toast.error("Tell us a bit more about the project (at least 10 characters).");
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
                  Message received
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out to SGTB Music. Expect a reply shortly.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
                  <Button
                    variant="default"
                    className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase"
                    onClick={() => {
                      const mailto = `mailto:sgtbmusic.business@gmail.com?subject=SGTB Project Submission&body=Inquiry successfully captured in database.%0A%0AReview in platform owner inbox: https://sgtbmusic-pbepc3kz.manus.space/admin/inbox`;
                      window.location.href = mailto;
                    }}
                  >
                    Send Direct Mail (sgtbmusic.business@gmail.com)
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border font-mono text-xs uppercase hover:bg-secondary"
                    onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
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
                  className="font-condensed w-full bg-gold tracking-[0.16em] text-primary-foreground uppercase hover:bg-gold-soft">
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
                  <Music4 className="mt-0.5 size-4 shrink-0 text-gold" />
                  A link to the Suno session, rough mix, or reference track.
                </li>
                <li className="flex gap-2.5">
                  <Workflow className="mt-0.5 size-4 shrink-0 text-gold" />
                  Where you want the record to end up — Suno, exclusive, or DSPs.
                </li>
                <li className="flex gap-2.5">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                  Any deadline, release date, or campaign you are working toward.
                </li>
              </ul>
            </div>

            <Link href="/suno">
              <div className="suno-nav-btn rounded-xl p-6 text-white">
                <p className="font-mono text-[0.62rem] tracking-[0.28em] text-neon uppercase">
                  Also see
                </p>
                <h3 className="font-display mt-2 text-2xl uppercase">Suno Business</h3>
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

