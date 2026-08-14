import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Music, Radio, Share2, Flame, ArrowUpRight, CheckCircle2, Lock, Gift, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Rewards() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: rewards, isLoading } = trpc.rewards.myRewards.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: leaderboard } = trpc.rewards.leaderboard.useQuery();

  const earnMutation = trpc.rewards.earnPoints.useMutation({
    onSuccess: (updated) => {
      utils.rewards.myRewards.invalidate();
      utils.rewards.leaderboard.invalidate();
      if (updated) {
        toast.success(`Action recorded! Earned reward points.`);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Please sign in to earn points.");
    },
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + "/music");
      toast.success("Catalog link copied to clipboard! Points earned for sharing.");
      earnMutation.mutate({ action: "share_track" });
    } else {
      earnMutation.mutate({ action: "share_track" });
    }
  };

  const points = rewards?.points ?? 150;
  const tracksListened = rewards?.tracksListened ?? 3;
  const episodesListened = rewards?.episodesListened ?? 1;
  const tracksShared = rewards?.tracksShared ?? 0;
  const draftsRated = rewards?.draftsRated ?? 2;
  const currentTier = rewards?.tier ?? "Listener";

  // Tier thresholds
  // Tier 1: Listener (0 - 499 pts)
  // Tier 2: VIP Tastemaker (500+ pts OR 5+ episodes)
  // Tier 3: Industry Partner (Verified Rep / Executive badge or 1200+ pts)
  const isVip = currentTier === "VIP Tastemaker" || points >= 500 || episodesListened >= 5;
  const isPartner = currentTier === "Industry Partner" || points >= 1200;

  const progressToVip = Math.min(100, Math.round((points / 500) * 100));
  const progressToPartner = Math.min(100, Math.round((points / 1200) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="container pt-12">
        <PageHeader
          eyebrow="Cadence Club & Member Loyalty"
          title="Exclusive Rewards & Tastemaker Tiers"
          description="Engage with SGTB catalog drafts, Suno radio episodes, and industry releases to unlock unreleased stems, private virtual artist personas, and executive VIP passes."
          accent="Cadence Club"
        />

        {/* User Stats Overview Banner */}
        <div className="mt-8 glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 bg-gradient-to-br from-card/80 to-card/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-neon/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon font-mono text-xs uppercase tracking-wider">
                  {currentTier} Tier Active
                </span>
                {!isAuthenticated && (
                  <span className="text-xs text-muted-foreground font-mono">(Guest Preview Mode — Sign in to save progress)</span>
                )}
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">
                {points.toLocaleString()} <span className="text-gold font-sans text-xl">Cadence Points</span>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Earn points by listening to catalog masters on <Link href="/music"><span className="text-neon underline cursor-pointer">/music</span></Link>, tuning into Suno radio talks on <Link href="/suno"><span className="text-neon underline cursor-pointer">/suno</span></Link>, and rating drafts.
              </p>
            </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 font-mono text-xs"
                  onClick={() => earnMutation.mutate({ action: "listen_track" })}
                >
                  <Music className="w-3.5 h-3.5 mr-2 text-neon" /> Listen Track (+15 pts)
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 font-mono text-xs"
                  onClick={() => earnMutation.mutate({ action: "listen_episode" })}
                >
                  <Radio className="w-3.5 h-3.5 mr-2 text-gold" /> Suno Talk (+25 pts)
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 font-mono text-xs"
                  onClick={handleShare}
                >
                  <Share2 className="w-3.5 h-3.5 mr-2 text-purple-400" /> Share Catalog (+35 pts)
                </Button>
                <Button
                  className="bg-gold text-black hover:bg-gold/90 font-mono text-xs font-semibold"
                  onClick={() => earnMutation.mutate({ action: "rate_draft" })}
                >
                  <Star className="w-3.5 h-3.5 mr-2 fill-black" /> Rate Draft (+20 pts)
                </Button>
              </div>
          </div>
        </div>

        {/* Cadence Club Tiers Grid */}
        <div className="mt-12">
          <h3 className="font-display text-2xl uppercase text-white mb-6">Cadence Club Tiers</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Tier 1 */}
            <div className={`glass-panel rounded-2xl border p-6 flex flex-col justify-between ${!isVip && !isPartner ? 'border-neon/50 bg-card/90 shadow-lg shadow-neon/5' : 'border-white/10 opacity-80'}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">TIER 01</span>
                  <Award className="w-5 h-5 text-neon" />
                </div>
                <h4 className="mt-4 font-display text-xl text-white">Listener</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Granted instantly upon free account creation. Grants full access to streaming catalog, public vaults, and standard community discussion.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-foreground/80 font-mono">
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> Catalog streaming access</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> Vault preview streaming</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> Standard community votes</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="inline-flex items-center text-xs font-mono text-neon">
                  {!isVip && !isPartner ? 'Active Status' : 'Unlocked'}
                </span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className={`glass-panel rounded-2xl border p-6 flex flex-col justify-between ${isVip && !isPartner ? 'border-gold/60 bg-card/90 shadow-lg shadow-gold/10' : 'border-white/10 opacity-85'}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">TIER 02 • 500 PTS OR 5+ EPISODES</span>
                  <Star className="w-5 h-5 text-gold fill-gold" />
                </div>
                <h4 className="mt-4 font-display text-xl text-white">VIP Tastemaker</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Unlocked by active participation—listening to 5+ Suno radio talk episodes and rating catalog drafts.
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">Progress to VIP</span>
                    <span className="text-gold">{points} / 500 pts ({progressToVip}%)</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-gold to-amber-400 h-full transition-all duration-500" style={{ width: `${progressToVip}%` }} />
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-foreground/80 font-mono">
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-gold mr-2" /> Exclusive unreleased audio stems</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-gold mr-2" /> Early beta access to new AI personas</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-gold mr-2" /> Tastemaker badge on leaderboard</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-gold">
                  {isVip ? 'Unlocked & Active' : 'Locked'}
                </span>
                {!isVip && <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {/* Tier 3 */}
            <div className={`glass-panel rounded-2xl border p-6 flex flex-col justify-between ${isPartner ? 'border-neon/80 bg-card/90 shadow-lg shadow-neon/20' : 'border-white/10 opacity-85'}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neon">TIER 03 • 1200 PTS OR VERIFIED REP</span>
                  <ShieldCheck className="w-5 h-5 text-neon" />
                </div>
                <h4 className="mt-4 font-display text-xl text-white">Industry Partner</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Reserved for verified label executives, Suno reps (like Rosie Nguyen), and top-tier taste leaders.
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">Progress to Partner</span>
                    <span className="text-neon">{points} / 1200 pts ({progressToPartner}%)</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-neon to-cyan-400 h-full transition-all duration-500" style={{ width: `${progressToPartner}%` }} />
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-foreground/80 font-mono">
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> Direct VIP Portal & /suno-hq access</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> DDEX / DistroKid package exports</li>
                  <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-neon mr-2" /> Executive sync licensing priority</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-neon">
                  {isPartner ? 'Unlocked & Active' : 'Locked'}
                </span>
                {!isPartner && <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
          </div>
        </div>

        {/* Gamified Actions & Reward Unlocks */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Gamified Actions */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-neon">Activity Feed</span>
                <h3 className="font-display text-2xl uppercase text-white mt-1">Earn Points & Unlock Perks</h3>
              </div>
              <Flame className="w-6 h-6 text-gold" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-bold">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display text-base text-white">Listen to Catalog Tracks</h5>
                    <p className="text-xs text-muted-foreground">Stream full masters on the /music player ({tracksListened} completed)</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-neon text-black hover:bg-neon/90 font-mono text-xs"
                  onClick={() => earnMutation.mutate({ action: "listen_track" })}
                >
                  +15 Pts
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display text-base text-white">Tune Into Suno Radio Talks</h5>
                    <p className="text-xs text-muted-foreground">Listen to executive audio episodes ({episodesListened} tuned in)</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gold text-black hover:bg-gold/90 font-mono text-xs"
                  onClick={() => earnMutation.mutate({ action: "listen_episode" })}
                >
                  +25 Pts
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display text-base text-white">Rate Unreleased Drafts</h5>
                    <p className="text-xs text-muted-foreground">Review A&R incubator prototypes ({draftsRated} rated)</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono text-xs"
                  onClick={() => earnMutation.mutate({ action: "rate_draft" })}
                >
                  +20 Pts
                </Button>
              </div>
            </div>
          </div>

          {/* Reward Unlocks & Pre-Save Widget */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-gold">Exclusive Perks</span>
                  <h3 className="font-display text-2xl uppercase text-white mt-1">Unlocked Rewards</h3>
                </div>
                <Gift className="w-6 h-6 text-neon" />
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${isVip || isPartner ? 'bg-gold/10 border-gold/40' : 'bg-white/5 border-white/10 opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <h5 className="font-display text-base text-white flex items-center gap-2">
                      <span>Pro Tools Stems Package (Vol. 1)</span>
                      {isVip || isPartner ? <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold text-black">UNLOCKED</span> : <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-muted-foreground">VIP TIER</span>}
                    </h5>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Unreleased multitracks and dry vocal stems from the SGTB incubator.</p>
                  {isVip || isPartner ? (
                    <Button size="sm" className="mt-3 bg-gold text-black hover:bg-gold/90 font-mono text-xs" onClick={() => toast.success("Stem package downloaded successfully!")}>
                      Download Stems (.ZIP)
                    </Button>
                  ) : (
                    <p className="text-[11px] font-mono text-gold mt-2">Requires VIP Tastemaker status (500 pts)</p>
                  )}
                </div>

                <div className={`p-4 rounded-xl border ${isPartner ? 'bg-neon/10 border-neon/40' : 'bg-white/5 border-white/10 opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <h5 className="font-display text-base text-white flex items-center gap-2">
                      <span>Executive Portal & /suno-hq Access</span>
                      {isPartner ? <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon text-black">UNLOCKED</span> : <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-muted-foreground">PARTNER TIER</span>}
                    </h5>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Direct briefing desk, DDEX exports, and priority synch clearance.</p>
                  {isPartner ? (
                    <Link href="/suno-hq">
                      <Button size="sm" className="mt-3 bg-neon text-black hover:bg-neon/90 font-mono text-xs">
                        Open Executive HQ <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <p className="text-[11px] font-mono text-neon mt-2">Requires Industry Partner status (1200 pts)</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pre-Save / Support Widget */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Primary Streaming Channels</span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-neon/50 transition-colors group"
                >
                  <div>
                    <h5 className="font-display text-sm text-white group-hover:text-neon transition-colors">Spotify Editorial</h5>
                    <p className="text-[11px] text-muted-foreground">Pre-save upcoming hybrid releases</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-neon transition-colors" />
                </a>
                <a
                  href="https://music.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-gold/50 transition-colors group"
                >
                  <div>
                    <h5 className="font-display text-sm text-white group-hover:text-gold transition-colors">Apple Music Spatial</h5>
                    <p className="text-[11px] text-muted-foreground">Stream SGTB reference masters</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Leaderboard */}
        <div className="mt-12 glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gold">Community Standings</span>
              <h3 className="font-display text-2xl uppercase text-white mt-1">Cadence Club Leaderboard</h3>
            </div>
            <Trophy className="w-6 h-6 text-gold" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Tier Badge</th>
                  <th className="py-3 px-4 text-right">Cadence Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gold font-bold">#{idx + 1}</td>
                      <td className="py-3 px-4 text-white font-sans font-medium">
                        {row.userName || row.userEmail || `Member #${row.userId}`}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${row.tier === 'Industry Partner' ? 'bg-neon/10 text-neon border border-neon/30' : row.tier === 'VIP Tastemaker' ? 'bg-gold/10 text-gold border border-gold/30' : 'bg-white/10 text-muted-foreground'}`}>
                          {row.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-neon font-bold">{row.points.toLocaleString()} pts</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      No leaderboard entries yet. Earn points above to rank on the board!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
