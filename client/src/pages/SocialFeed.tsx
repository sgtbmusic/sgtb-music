import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { AudioLines, Image as ImageIcon, Heart, MessageCircle, Repeat2, Send, Sparkles, Upload, Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

function initials(name?: string | null, email?: string | null) {
  return (name || email || "SG").slice(0, 2).toUpperCase();
}

export default function SocialFeed() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.social.feed.useQuery();
  const [body, setBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "audio" | null>(null);
  const [mediaTitle, setMediaTitle] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});

  const createPost = trpc.social.createPost.useMutation({
    onSuccess: async () => {
      setBody("");
      setMediaUrl(null);
      setMediaType(null);
      setMediaTitle("");
      await utils.social.feed.invalidate();
      toast.success("Post published to the SGTB network.");
    },
    onError: (error) => toast.error(error.message),
  });
  const likePost = trpc.social.toggleLike.useMutation({ onSuccess: () => utils.social.feed.invalidate() });
  const commentPost = trpc.social.comment.useMutation({
    onSuccess: async (_, variables) => {
      setCommentDrafts((current) => ({ ...current, [variables.postId]: "" }));
      await utils.social.feed.invalidate();
      toast.success("Comment added.");
    },
    onError: (error) => toast.error(error.message),
  });

  const imageUpload = trpc.uploads.feedImage.useMutation({ onSuccess: (data) => { setMediaUrl(data.url); setMediaType("image"); toast.success("Image attached."); }, onError: (error) => toast.error(error.message) });
  const audioUpload = trpc.uploads.feedAudio.useMutation({ onSuccess: (data) => { setMediaUrl(data.url); setMediaType("audio"); toast.success("Audio attached."); }, onError: (error) => toast.error(error.message) });

  function uploadMedia(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const dataBase64 = dataUrl.split(",")[1];
      if (!dataBase64) return;
      setMediaTitle(file.name);
      if (file.type.startsWith("image/")) {
        imageUpload.mutate({ fileName: file.name, contentType: file.type, dataBase64 });
      } else if (file.type.startsWith("audio/")) {
        audioUpload.mutate({ fileName: file.name, contentType: file.type, dataBase64 });
      } else {
        toast.error("Attach a PNG/JPG image or an MP3/WAV audio file.");
      }
    };
    reader.readAsDataURL(file);
  }

  function submitPost() {
    if (!isAuthenticated) return startLogin();
    if (!body.trim() && !mediaUrl) return toast.error("Add a thought, image, or audio clip first.");
    createPost.mutate({ body: body.trim() || "New SGTB signal.", mediaUrl, mediaType, mediaTitle: mediaTitle || null });
  }

  return (
    <SiteLayout>
      <div className="container max-w-6xl py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0">
            <section className="mb-7 overflow-hidden rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_top_left,rgba(244,191,55,0.18),transparent_45%),linear-gradient(135deg,#17120a,#070709_60%,#08191b)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-9">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-neon"><Sparkles className="size-3" /> SGTB Network / Main Feed</div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.86] text-white sm:text-7xl">The signal is <span className="text-gold-gradient">live.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">A high-signal social layer for Reference Demos, Analog Re-Tracking updates, visual drops, and the people shaping the next release.</p>
            </section>

            <section className="mb-7 rounded-3xl border border-white/10 bg-card/70 p-5 shadow-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-gold text-sm font-bold text-black">{initials(user?.name, user?.email)}</div><div><p className="font-display text-lg uppercase text-white">{user?.name || "Guest listener"}</p><p className="text-xs text-muted-foreground">Share a production note with the network.</p></div></div><span className="rounded-full border border-neon/25 bg-neon/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neon">Feed composer</span></div>
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={isAuthenticated ? "What are you building?" : "Sign in to publish to the network."} className="min-h-28 border-white/10 bg-black/30 text-white placeholder:text-muted-foreground/70" />
              {mediaUrl && <div className="mt-3 rounded-2xl border border-gold/20 bg-gold/5 p-3 text-xs text-gold-soft">{mediaType === "audio" ? <AudioLines className="mr-2 inline size-4" /> : <ImageIcon className="mr-2 inline size-4" />}{mediaTitle || "Media attached"}</div>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-gold/30 hover:text-gold"><ImageIcon className="size-3.5" /> Image<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => event.target.files?.[0] && uploadMedia(event.target.files[0])} /></label><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-neon/30 hover:text-neon"><Volume2 className="size-3.5" /> MP3/WAV<input type="file" accept="audio/mpeg,audio/wav,audio/x-wav" className="hidden" onChange={(event) => event.target.files?.[0] && uploadMedia(event.target.files[0])} /></label></div><Button onClick={submitPost} disabled={createPost.isPending || imageUpload.isPending || audioUpload.isPending} className="bg-gold text-black hover:bg-gold-soft">{isAuthenticated ? <><Send className="mr-2 size-4" /> Publish</> : "Sign in to publish"}</Button></div>
            </section>

            <div className="space-y-5">{isLoading ? <div className="rounded-3xl border border-white/10 p-8 text-sm text-muted-foreground">Loading the network signal…</div> : posts?.length ? posts.map(({ post, author }) => <article key={post.id} className="rounded-3xl border border-white/10 bg-card/60 p-5 shadow-xl sm:p-6"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gold text-sm font-bold text-black">{author?.avatarUrl ? <img src={author.avatarUrl} alt="" className="size-full object-cover" /> : initials(author?.name, author?.email)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div><p className="font-display text-lg uppercase text-white">{author?.name || "SGTB Member"}</p><p className="text-xs text-muted-foreground">{author?.username ? `@${author.username}` : "Verified network profile"} · {new Date(post.createdAt).toLocaleDateString()}</p></div><span className="rounded-full border border-gold/20 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-gold">{author?.role === "admin" ? "Owner" : author?.role === "rep" ? "Suno Rep" : "Member"}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/80">{post.body}</p>{post.mediaUrl && post.mediaType === "image" && <img src={post.mediaUrl} alt={post.mediaTitle || "SGTB network visual"} className="mt-4 max-h-[34rem] w-full rounded-2xl border border-white/10 object-cover" />}{post.mediaUrl && post.mediaType === "audio" && <div className="mt-4 rounded-2xl border border-gold/20 bg-black/30 p-4"><p className="mb-2 flex items-center gap-2 text-sm text-gold-soft"><AudioLines className="size-4" /> {post.mediaTitle || "Audio signal"}</p><audio controls preload="metadata" src={post.mediaUrl} className="w-full" /></div>}<div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4"><Button variant="ghost" size="sm" onClick={() => isAuthenticated ? likePost.mutate({ postId: post.id }) : startLogin()} className="text-muted-foreground hover:bg-red-500/10 hover:text-red-300"><Heart className="mr-2 size-4" /> {post.likesCount}</Button><div className="flex min-w-[220px] flex-1 gap-2"><Input value={commentDrafts[post.id] || ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))} placeholder="Add a comment" className="h-9 border-white/10 bg-black/20 text-xs text-white" /><Button size="sm" variant="outline" onClick={() => { const draft = commentDrafts[post.id]?.trim(); if (!draft) return; if (!isAuthenticated) return startLogin(); commentPost.mutate({ postId: post.id, body: draft }); }} className="border-white/15 text-muted-foreground hover:text-white"><MessageCircle className="size-4" /></Button></div><Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`).then(() => toast.success("Post link copied."))} className="text-muted-foreground hover:text-neon"><Repeat2 className="mr-2 size-4" /> Repost</Button></div></div></div></article>) : <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center"><Upload className="mx-auto size-8 text-gold" /><p className="mt-3 font-display text-2xl uppercase text-white">First signal in the room?</p><p className="mt-2 text-sm text-muted-foreground">Publish a Reference Demo note, visual, or audio clip to start the feed.</p></div>}</div>
          </main>
          <aside className="hidden space-y-5 lg:block"><div className="rounded-3xl border border-white/10 bg-card/60 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Your SGTB orbit</p><h2 className="mt-3 font-display text-3xl uppercase leading-none text-white">Stay close to the signal.</h2><div className="mt-5 space-y-3 text-sm text-muted-foreground"><Link href="/messages" className="flex items-center justify-between rounded-xl border border-white/10 p-3 hover:border-gold/30 hover:text-white">Direct messages <span>→</span></Link><Link href="/profile" className="flex items-center justify-between rounded-xl border border-white/10 p-3 hover:border-gold/30 hover:text-white">Your profile <span>→</span></Link><Link href="/explore" className="flex items-center justify-between rounded-xl border border-white/10 p-3 hover:border-gold/30 hover:text-white">Explore catalog <span>→</span></Link></div></div><div className="rounded-3xl border border-neon/20 bg-neon/5 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Production note</p><p className="mt-3 text-sm leading-6 text-white/75">The feed is social by design, but the standard stays label-grade: Reference Demos, clean permissions, and Analog Re-Tracking where it matters.</p></div></aside>
        </div>
      </div>
    </SiteLayout>
  );
}
