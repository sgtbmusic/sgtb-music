import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ShieldAlert, ShieldCheck, Sparkles, CheckCircle2, XCircle, Music, Users, BarChart3, Lock, Inbox } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminPortal() {
  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<"tracks" | "stats" | "team">("tracks");

  const { data: tracks = [], isLoading: tracksLoading } = trpc.tracks.listAdmin.useQuery(undefined, {
    enabled: !!user && (user.role === "admin" || user.role === "rep"),
  });

  const moderateMutation = trpc.tracks.moderate.useMutation({
    onSuccess: () => {
      toast.success("Track status updated successfully.");
      utils.tracks.listAdmin.invalidate();
      utils.tracks.list.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to update track: ${err.message}`);
    },
  });

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Authenticating access...</p>
        </div>
      </SiteLayout>
    );
  }

  const isPrivileged = user && (user.role === "admin" || user.role === "rep");
  const isAdmin = user && user.role === "admin";

  if (!isPrivileged) {
    return (
      <SiteLayout>
        <div className="container max-w-xl py-24 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-400">
            <Lock className="size-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl uppercase text-white">Restricted Portal</h1>
          <p className="mt-3 text-sm text-muted-foreground">This secure management surface is reserved for SGTB Administrators and authorized Suno Representatives (such as Rosie Nguyen). Please sign in with an authorized account.</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container py-12 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <PageHeader
            eyebrow={isAdmin ? "Master Command / Owner Admin" : "Suno Rep Portal / Moderation"}
            title="The Command center."
            accent="Command"
            description={isAdmin ? "Full system control across the SGTB Music ecosystem. Review pending uploads, monitor track metrics, and manage catalog clearance." : "Authorized Suno platform review portal. Approve or reject artist submissions, moderate comments, and track draft pool velocity."}
          />
          {isAdmin && (
            <div>
              <Link href="/admin/inbox">
                <Button className="bg-neon text-black hover:bg-neon/90 font-mono text-xs uppercase tracking-wider h-11 px-6 shadow-[0_0_20px_rgba(45,226,184,0.3)]">
                  <Inbox className="mr-2 size-4" /> Secure Communications Inbox
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-white/15 pb-6">
          <Button
            type="button"
            onClick={() => setActiveTab("tracks")}
            variant={activeTab === "tracks" ? "default" : "outline"}
            className={activeTab === "tracks" ? "bg-gold text-[#17120a] hover:bg-gold-soft" : "border-white/15 bg-transparent text-muted-foreground hover:text-white"}
          >
            <Music className="mr-2 size-4" /> Track Moderation Queue ({tracks.length})
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab("stats")}
            variant={activeTab === "stats" ? "default" : "outline"}
            className={activeTab === "stats" ? "bg-gold text-[#17120a] hover:bg-gold-soft" : "border-white/15 bg-transparent text-muted-foreground hover:text-white"}
          >
            <BarChart3 className="mr-2 size-4" /> Telemetry & Sync Stats
          </Button>
          {isAdmin && (
            <Button
              type="button"
              onClick={() => setActiveTab("team")}
              variant={activeTab === "team" ? "default" : "outline"}
              className={activeTab === "team" ? "bg-gold text-[#17120a] hover:bg-gold-soft" : "border-white/15 bg-transparent text-muted-foreground hover:text-white"}
            >
              <Users className="mr-2 size-4" /> Team & Roles (Admin)
            </Button>
          )}
        </div>

        {activeTab === "tracks" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase text-white">Submission Moderation Queue</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-gold">Role: {user.role.toUpperCase()}</span>
            </div>

            {tracksLoading ? (
              <p className="py-12 text-center font-mono text-xs uppercase text-muted-foreground">Loading queue...</p>
            ) : tracks.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-card/40 p-12 text-center">
                <ShieldCheck className="mx-auto size-12 text-gold/50" />
                <h3 className="mt-4 font-display text-xl uppercase text-white">Queue is clear</h3>
                <p className="mt-2 text-sm text-muted-foreground">All artist submissions have been reviewed.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tracks.map((track) => {
                  const isPending = track.status === "pending";
                  const isApproved = track.status === "approved";
                  return (
                    <div key={track.id} className="glass-panel rounded-2xl border border-white/10 p-5 sm:flex sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/10 font-display text-gold">
                          #{track.sortOrder}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-xl uppercase text-white">{track.title}</h3>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${isApproved ? "bg-neon/10 text-neon border border-neon/30" : isPending ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                              {track.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{track.artist} &bull; {track.genre || "Uncategorized"} &bull; {track.bpm ? `${track.bpm} BPM` : "BPM N/A"}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 sm:mt-0">
                        {isPending ? (
                          <>
                            <Button
                              type="button"
                              onClick={() => moderateMutation.mutate({ id: track.id, status: "approved" })}
                              className="bg-neon text-black hover:bg-neon/90"
                              size="sm"
                            >
                              <CheckCircle2 className="mr-1.5 size-4" /> Approve
                            </Button>
                            <Button
                              type="button"
                              onClick={() => moderateMutation.mutate({ id: track.id, status: "rejected" })}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="mr-1.5 size-4" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            onClick={() => moderateMutation.mutate({ id: track.id, status: isApproved ? "rejected" : "approved" })}
                            variant="outline"
                            className="border-white/15 bg-transparent text-xs text-muted-foreground hover:text-white"
                            size="sm"
                          >
                            Switch to {isApproved ? "Rejected" : "Approved"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="mt-8 space-y-6">
            <h2 className="font-display text-2xl uppercase text-white">Platform Telemetry & License Statistics</h2>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total Catalog Streams</p>
                <p className="mt-3 font-display text-4xl text-white">48,290</p>
                <p className="mt-2 text-xs text-neon">+18.4% this week</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Sync Clearance Rate</p>
                <p className="mt-3 font-display text-4xl text-gold">94.8%</p>
                <p className="mt-2 text-xs text-muted-foreground">Ready for label placement</p>
              </div>
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Active A&R Sessions</p>
                <p className="mt-3 font-display text-4xl text-white">142</p>
                <p className="mt-2 text-xs text-gold">Major label buyers online</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && isAdmin && (
          <div className="mt-8 space-y-6">
            <h2 className="font-display text-2xl uppercase text-white">Team & Role Hierarchy</h2>
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <p className="text-sm text-muted-foreground">System role assignments are synchronized with authenticated openIds. You are logged in as <strong className="text-gold">{user.name || user.email || user.openId}</strong> with <strong className="text-neon">{user.role.toUpperCase()}</strong> privileges.</p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-4">
                  <div>
                    <p className="font-display text-lg uppercase text-white">Owner Admin (CAMG)</p>
                    <p className="text-xs text-muted-foreground">Full system control, database mutations, and team promotion.</p>
                  </div>
                  <span className="rounded-full bg-gold/10 px-3 py-1 font-mono text-xs text-gold border border-gold/30">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-4">
                  <div>
                    <p className="font-display text-lg uppercase text-white">Suno Reps (Rosie Nguyen & Team)</p>
                    <p className="text-xs text-muted-foreground">Moderation queue, hit potential tuning, and creator oversight.</p>
                  </div>
                  <span className="rounded-full bg-neon/10 px-3 py-1 font-mono text-xs text-neon border border-neon/30">Configured</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
