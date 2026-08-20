import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPlayIntroOnLogin, requestIntroReplay, setPlayIntroOnLogin } from "@/lib/gatewayPreferences";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowLeft, Check, PlayCircle, Settings2, ShieldCheck, User, Sparkles, LogOut, Lock, Camera, Volume2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { toast } from "sonner";

function serializeSocialLinks(input: string) {
  return JSON.stringify(
    input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return separator > 0
          ? { label: line.slice(0, separator).trim(), url: line.slice(separator + 1).trim() }
          : { label: "Link", url: line };
      }),
  );
}

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [playIntroOnLogin, setPlayIntro] = useState(() => getPlayIntroOnLogin());
  const [avatarInput, setAvatarInput] = useState(user?.avatarUrl || "");
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [usernameInput, setUsernameInput] = useState(user?.username || "");
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [websiteInput, setWebsiteInput] = useState(user?.websiteUrl || "");
  const [linksInput, setLinksInput] = useState(() => {
    try {
      const parsed = user?.socialLinksJson ? JSON.parse(user.socialLinksJson) : [];
      return Array.isArray(parsed) ? parsed.map((link: { label?: string; url?: string }) => `${link.label || "Link"}: ${link.url || ""}`).join("\\n") : "";
    } catch {
      return "";
    }
  });
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(user?.emailUpdatesEnabled !== 0);
  const [pushEnabled, setPushEnabled] = useState(Boolean(user?.pushEnabled));

  useEffect(() => {
    if (!user) return;
    setAvatarInput(user.avatarUrl || "");
    setNameInput(user.name || "");
    setUsernameInput(user.username || "");
    setBioInput(user.bio || "");
    setWebsiteInput(user.websiteUrl || "");
    setEmailUpdatesEnabled(user.emailUpdatesEnabled !== 0);
    setPushEnabled(Boolean(user.pushEnabled));
    try {
      const links = user.socialLinksJson ? JSON.parse(user.socialLinksJson) : [];
      setLinksInput(Array.isArray(links) ? links.map((link: { label?: string; url?: string }) => `${link.label || "Link"}: ${link.url || ""}`).join("\n") : "");
    } catch {
      setLinksInput("");
    }
  }, [user]);

  const utils = trpc.useUtils();
  const uploadMutation = trpc.uploads.profileImage.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        setAvatarInput(data.url);
        updateProfileMutation.mutate({
          avatarUrl: data.url,
          name: nameInput,
          username: usernameInput,
          bio: bioInput,
          websiteUrl: websiteInput,
          socialLinksJson: serializeSocialLinks(linksInput),
          emailUpdatesEnabled: emailUpdatesEnabled ? 1 : 0,
          pushEnabled: pushEnabled ? 1 : 0,
        });
        toast.success("Avatar image uploaded successfully!");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to upload avatar image.");
    },
  });

  const updateProfileMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      utils.profile.me.invalidate();
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile.");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      if (base64Data) {
        uploadMutation.mutate({
          fileName: file.name,
          dataBase64: base64Data,
          contentType: file.type || "image/png",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  function updatePreference(enabled: boolean) {
    setPlayIntro(enabled);
    setPlayIntroOnLogin(enabled);
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      avatarUrl: avatarInput || null,
      name: nameInput || null,
      username: usernameInput || null,
      bio: bioInput || null,
      websiteUrl: websiteInput || null,
      socialLinksJson: serializeSocialLinks(linksInput),
      emailUpdatesEnabled: emailUpdatesEnabled ? 1 : 0,
      pushEnabled: pushEnabled ? 1 : 0,
    });
  };

  const handlePushToggle = (checked: boolean) => {
    setPushEnabled(checked);
    updateProfileMutation.mutate({ pushEnabled: checked ? 1 : 0 });
    if (checked) {
      toast.success("Push alerts enabled for stem drops and radio talks.");
    } else {
      toast.info("Push alerts disabled.");
    }
  };

  const role = user?.role || "user";
  const isAdmin = role === "admin";
  const isRep = role === "rep";
  const isPrivileged = isAdmin || isRep;

  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 sm:py-16">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">Account Center & Preferences</p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none text-white sm:text-7xl">Control the <span className="text-gold-gradient">signal.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">Manage your SGTB Music account identity, custom avatar, push alerts, gateway preferences, and platform privileges.</p>
          </div>
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/5 text-gold">
            <Settings2 className="size-6" />
          </div>
        </div>

        {/* User Profile Card */}
        <section className="glass-panel glow-gold mb-8 rounded-3xl border border-gold/20 p-6 sm:p-8">
          <h2 className="font-display text-2xl uppercase text-white">Identity & Authentication</h2>
          {isAuthenticated && user ? (
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="User Avatar" className="size-16 rounded-2xl object-cover border border-gold/40 shadow-[0_0_15px_rgba(244,191,55,0.3)]" />
                ) : (
                  <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold text-[#17120a] font-display text-2xl font-bold shadow-[0_0_20px_rgba(244,191,55,0.3)]">
                    {(user.name || user.email || "S").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-display text-2xl uppercase text-white">{user.name || user.email || "Authenticated User"}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-gold">Role: {role.toUpperCase()} {isAdmin ? "(Owner Admin)" : isRep ? "(Suno Representative)" : "(Artist / Member)"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Signed in via secure Manus OAuth</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => logout()}
                variant="outline"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300 font-mono text-xs uppercase tracking-wider"
              >
                <LogOut className="mr-2 size-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">You are browsing as a guest. Sign in to sync your profile across devices and unlock submission rights.</p>
              </div>
              <Button
                type="button"
                onClick={() => startLogin()}
                className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider"
              >
                <User className="mr-2 size-4" /> Sign In with Manus OAuth
              </Button>
            </div>
          )}
        </section>

        {/* Custom Avatar Upload & Push Notification Settings */}
        {isAuthenticated && (
          <section className="glass-panel mb-8 rounded-3xl border border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-2xl uppercase text-white">Profile Customization & Alerts</h2>
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="profile-name" className="font-mono text-xs uppercase text-gold">Display Name</Label>
                  <Input id="profile-name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Your public display name" className="mt-2 bg-black/40 border-white/10 text-white" />
                </div>
                <div>
                  <Label htmlFor="profile-username" className="font-mono text-xs uppercase text-gold">Username</Label>
                  <Input id="profile-username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value.replace(/\\s/g, "").toLowerCase())} placeholder="sgtb_creator" className="mt-2 bg-black/40 border-white/10 text-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="profile-bio" className="font-mono text-xs uppercase text-gold">Bio</Label>
                <Textarea id="profile-bio" value={bioInput} onChange={(e) => setBioInput(e.target.value)} placeholder="Tell the network what you make." className="mt-2 min-h-24 bg-black/40 border-white/10 text-white" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="profile-website" className="font-mono text-xs uppercase text-gold">Website</Label>
                  <Input id="profile-website" value={websiteInput} onChange={(e) => setWebsiteInput(e.target.value)} placeholder="https://" className="mt-2 bg-black/40 border-white/10 text-white" />
                </div>
                <div>
                  <Label htmlFor="profile-links" className="font-mono text-xs uppercase text-gold">Social Links</Label>
                  <Textarea id="profile-links" value={linksInput} onChange={(e) => setLinksInput(e.target.value)} placeholder="Instagram: https://...\\nX: https://..." className="mt-2 min-h-24 bg-black/40 border-white/10 text-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="avatar-url" className="font-mono text-xs uppercase text-gold">Custom Profile Avatar</Label>
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <Input
                    id="avatar-url"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload file"
                    className="bg-black/40 border-white/10 text-white font-mono text-xs flex-1"
                  />
                  <div className="flex gap-2">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 px-3 py-2 font-mono text-xs text-white border border-white/20 transition-colors">
                      <Camera className="w-3.5 h-3.5 mr-1.5 text-gold" /> Choose File
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <Button type="submit" disabled={uploadMutation.isPending} className="bg-gold text-black hover:bg-gold/90 font-mono text-xs">
                      {uploadMutation.isPending ? "Uploading..." : "Save Profile"}
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Upload a profile picture or provide an S3 storage URL to display your avatar across the platform and leaderboard. Saving this form persists your display name, username, bio, website, and social links.</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h5 className="font-display text-base text-white">Email Updates</h5>
                  <p className="text-xs text-muted-foreground">Receive account and platform updates at {user?.email || "your OAuth email"}. Email identity remains managed by Manus OAuth.</p>
                </div>
                <Switch checked={emailUpdatesEnabled} onCheckedChange={setEmailUpdatesEnabled} />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h5 className="font-display text-base text-white">Browser Push Notifications</h5>
                  <p className="text-xs text-muted-foreground">Receive instant desktop alerts when new unreleased stems or Suno radio episodes drop.</p>
                </div>
                <Switch
                  checked={pushEnabled}
                  onCheckedChange={handlePushToggle}
                />
              </div>
            </form>
          </section>
        )}

        {/* Role-Aware Tools Section */}
        <section className="glass-panel mb-8 rounded-3xl border border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl uppercase text-white">Platform Privileges & Access</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <span className="font-mono text-[10px] uppercase text-gold tracking-wider">Access Clearance</span>
              <h3 className="font-display text-xl uppercase text-white mt-1">
                {isAdmin ? "Full Executive & Owner Control" : isRep ? "Suno Representative Moderation" : "Standard Artist & Member Tier"}
              </h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {isAdmin
                  ? "You have full administrator access, database controls, track moderation, and executive HQ clearances."
                  : isRep
                  ? "You have Suno rep clearance to review catalog drafts, approve submissions, and access the executive portal."
                  : "You have member access to browse the catalog, earn Cadence Club points, and unlock unreleased Pro Tools stems."}
              </p>
              {isPrivileged && (
                <div className="mt-4 flex gap-3">
                  <Link href="/admin-portal">
                    <Button size="sm" className="bg-gold text-black hover:bg-gold/90 font-mono text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Admin Portal
                    </Button>
                  </Link>
                  <Link href="/suno-hq">
                    <Button size="sm" variant="outline" className="border-neon/40 text-neon hover:bg-neon/10 font-mono text-xs">
                      Executive HQ
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <span className="font-mono text-[10px] uppercase text-neon tracking-wider">Cadence Club Standing</span>
              <h3 className="font-display text-xl uppercase text-white mt-1">Loyalty Rewards & Unlocks</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Earn Cadence Club points by listening to master catalog tracks, rating drafts, and tuning into Suno radio episodes.
              </p>
              <div className="mt-4">
                <Link href="/rewards">
                  <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/5 font-mono text-xs text-white">
                    View Cadence Club Hub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cinematic Gateway Preferences */}
        <section className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl uppercase text-white">Cinematic Gateway Preferences</h2>
          <p className="mt-2 text-xs text-muted-foreground">Configure whether the retained SGTB car sequence plays automatically when you open the site.</p>
          
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-5">
              <div>
                <Label htmlFor="play-intro-toggle" className="font-display text-lg text-white">Play Cinematic Intro on Login</Label>
                <p className="text-xs text-muted-foreground mt-1">When active, visiting the site triggers the full-screen video splash gateway.</p>
              </div>
              <Switch
                id="play-intro-toggle"
                checked={playIntroOnLogin}
                onCheckedChange={updatePreference}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-5">
              <div>
                <h3 className="font-display text-lg text-white">Manual Gateway Replay</h3>
                <p className="text-xs text-muted-foreground mt-1">Replay the retained SGTB car sequence right now with audio.</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  requestIntroReplay();
                  window.location.href = "/home";
                }}
                className="bg-gold text-[#17120a] hover:bg-gold-soft font-mono text-xs uppercase tracking-wider"
              >
                <PlayCircle className="mr-2 size-4" /> Replay Intro Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
