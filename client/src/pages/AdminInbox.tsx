import { SiteLayout } from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Mail, ShieldCheck, Inbox, ArrowLeft, ExternalLink, RefreshCw, Calendar, User, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function AdminInbox() {
  const { user } = useAuth();
  const { data: contactMessages = [], refetch: refetchContacts, isLoading: loadingContacts } = trpc.contact.list.useQuery();
  const { data: meetings = [], refetch: refetchMeetings, isLoading: loadingMeetings } = trpc.executive.listMeetings.useQuery();

  const isAdmin = user && user.role === "admin";

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container max-w-4xl py-24 text-center">
          <ShieldCheck className="mx-auto size-16 text-red-400 mb-4" />
          <h1 className="font-display text-3xl uppercase text-white">Restricted Executive Access</h1>
          <p className="mt-3 text-muted-foreground text-sm">
            This secure communications inbox is restricted to SGTB Music Group site administrators.
          </p>
          <div className="mt-8">
            <Link href="/">
              <Button className="bg-gold text-[#17120a] font-mono text-xs uppercase tracking-wider">
                <ArrowLeft className="mr-2 size-4" /> Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container max-w-7xl py-12 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-neon/40 bg-neon/10 font-mono text-xs uppercase tracking-[0.2em] text-neon">
                <Inbox className="mr-1.5 size-3.5" /> Secure Owner Communications Inbox
              </Badge>
              <Badge variant="outline" className="border-gold/40 bg-gold/10 font-mono text-xs uppercase tracking-wider text-gold">
                Destination: sgtbmusic.business@gmail.com
              </Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl uppercase leading-none text-white sm:text-6xl">
              Platform Lead &amp; <span className="text-gold-gradient">Inquiry Stream.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review all customer contacts, support messages, and executive briefing requests captured across the SGTB platform in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                refetchContacts();
                refetchMeetings();
              }}
              className="border-gold/30 text-gold hover:bg-gold/10 font-mono text-xs uppercase"
            >
              <RefreshCw className="mr-2 size-3.5" /> Refresh Stream
            </Button>
            <a
              href="mailto:sgtbmusic.business@gmail.com?subject=SGTB%20Inbox%20Follow-up"
              className="inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#17120a] hover:bg-gold-soft transition-colors"
            >
              <Mail className="mr-2 size-4" /> Open Gmail Client
            </a>
          </div>
        </div>

        {/* Two Sections: Contact Submissions & Executive Briefings */}
        <div className="grid gap-12">
          
          {/* Section 1: General & Project Contact Messages */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase text-white flex items-center gap-2">
                <MessageSquare className="size-5 text-gold" /> Contact &amp; Start Project Inquiries ({contactMessages.length})
              </h2>
            </div>

            <Card className="glass-panel border-gold/20 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-0">
                {loadingContacts ? (
                  <div className="p-12 text-center text-muted-foreground font-mono text-xs uppercase">Loading inquiries...</div>
                ) : contactMessages.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground font-mono text-xs uppercase">No contact submissions received yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow>
                          <TableHead className="font-mono text-xs text-gold uppercase">Sender</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Project Type</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Message Content</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Timestamp</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactMessages.map((msg: any) => (
                          <TableRow key={msg.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="align-top font-medium text-white">
                              <div>{msg.name}</div>
                              <a href={`mailto:${msg.email}`} className="text-xs text-gold hover:underline font-mono">
                                {msg.email}
                              </a>
                            </TableCell>
                            <TableCell className="align-top font-mono text-xs text-neon uppercase">
                              {msg.projectType || "General Inquiry"}
                            </TableCell>
                            <TableCell className="align-top text-xs text-muted-foreground max-w-md leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </TableCell>
                            <TableCell className="align-top font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="align-top text-right">
                              <a
                                href={`mailto:${msg.email}?subject=Regarding your SGTB inquiry: ${msg.projectType || "Project"}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 hover:bg-gold/20 text-gold font-mono text-[10px] uppercase transition-colors"
                              >
                                <Mail className="size-3" /> Reply
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Executive Briefing & Meeting Requests */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase text-white flex items-center gap-2">
                <Calendar className="size-5 text-neon" /> Executive Briefing Requests ({meetings.length})
              </h2>
            </div>

            <Card className="glass-panel border-gold/20 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-0">
                {loadingMeetings ? (
                  <div className="p-12 text-center text-muted-foreground font-mono text-xs uppercase">Loading executive meetings...</div>
                ) : meetings.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground font-mono text-xs uppercase">No executive meeting requests received yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow>
                          <TableHead className="font-mono text-xs text-gold uppercase">Executive &amp; Organization</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Requested Date</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Licensing Focus / Notes</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase">Timestamp</TableHead>
                          <TableHead className="font-mono text-xs text-gold uppercase text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meetings.map((meet: any) => (
                          <TableRow key={meet.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="align-top font-medium text-white">
                              <div>{meet.executiveName}</div>
                              <div className="text-xs text-gold font-mono">{meet.organization}</div>
                              <a href={`mailto:${meet.email}`} className="text-[11px] text-muted-foreground hover:underline font-mono">
                                {meet.email}
                              </a>
                            </TableCell>
                            <TableCell className="align-top font-mono text-xs text-neon uppercase">
                              {meet.requestedDate || "ASAP / Flexible"}
                            </TableCell>
                            <TableCell className="align-top text-xs text-muted-foreground max-w-md leading-relaxed whitespace-pre-wrap">
                              {meet.notes || "No additional notes provided."}
                            </TableCell>
                            <TableCell className="align-top font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {new Date(meet.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="align-top text-right">
                              <a
                                href={`mailto:${meet.email}?subject=SGTB Executive Briefing Follow-up (${meet.organization})`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neon/10 hover:bg-neon/20 text-neon font-mono text-[10px] uppercase transition-colors"
                              >
                                <Mail className="size-3" /> Schedule
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
