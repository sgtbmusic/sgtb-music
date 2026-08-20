import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, MessageCircle, Send, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const { data: directory, isLoading: directoryLoading } = trpc.messages.directory.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const { data: thread, isLoading: threadLoading } = trpc.messages.thread.useQuery({ otherUserId: selectedUserId || 0 }, { enabled: Boolean(selectedUserId), refetchInterval: 5000 });
  const sendMessage = trpc.messages.send.useMutation({
    onSuccess: async () => {
      setDraft("");
      await utils.messages.thread.invalidate({ otherUserId: selectedUserId || 0 });
    },
    onError: (error) => toast.error(error.message),
  });

  if (!isAuthenticated) {
    return <SiteLayout><div className="container max-w-2xl py-20 text-center"><MessageCircle className="mx-auto size-10 text-gold" /><h1 className="mt-5 font-display text-5xl uppercase text-white">Private signal room</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">Sign in to connect with approved members, artists, and SGTB representatives.</p><Button onClick={() => startLogin()} className="mt-7 bg-gold text-black hover:bg-gold-soft">Sign in to continue</Button></div></SiteLayout>;
  }

  return <SiteLayout><div className="container max-w-6xl py-8 sm:py-12"><div className="mb-7 flex items-center gap-4"><Link href="/"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white"><ArrowLeft className="size-5" /></Button></Link><div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neon">Private communications</p><h1 className="mt-2 font-display text-5xl uppercase leading-none text-white">Messages</h1></div></div><div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-card/50 md:grid-cols-[280px_minmax(0,1fr)]"><aside className="border-b border-white/10 bg-black/20 md:border-b-0 md:border-r"><div className="border-b border-white/10 p-4"><p className="font-mono text-[10px] uppercase tracking-wider text-gold">Network directory</p></div><div className="max-h-[540px] overflow-y-auto p-2">{directoryLoading ? <p className="p-4 text-sm text-muted-foreground">Loading members…</p> : directory?.map((member) => <button key={member.id} type="button" onClick={() => setSelectedUserId(member.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selectedUserId === member.id ? "bg-gold/10 ring-1 ring-gold/30" : "hover:bg-white/5"}`}><span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/80 text-xs font-bold text-black">{member.avatarUrl ? <img src={member.avatarUrl} alt="" className="size-full rounded-full object-cover" /> : (member.name || member.username || "S").slice(0, 2).toUpperCase()}</span><span className="min-w-0"><span className="block truncate font-display text-sm uppercase text-white">{member.name || member.username || "SGTB Member"}</span><span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">{member.role === "admin" && <ShieldCheck className="size-3 text-gold" />}{member.role}</span></span></button>)}</div></aside><section className="flex min-h-[620px] min-w-0 flex-col">{selectedUserId ? <><header className="border-b border-white/10 p-5"><p className="font-display text-xl uppercase text-white">{directory?.find((member) => member.id === selectedUserId)?.name || "Conversation"}</p><p className="mt-1 text-xs text-muted-foreground">Messages refresh automatically while this room is open.</p></header><div className="flex-1 space-y-3 overflow-y-auto p-5">{threadLoading ? <p className="text-sm text-muted-foreground">Loading conversation…</p> : thread?.length ? thread.map(({ message, sender }) => <div key={message.id} className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.senderId === user?.id ? "bg-gold text-black" : "border border-white/10 bg-black/30 text-white/80"}`}><p>{message.body}</p><p className={`mt-1 text-[10px] ${message.senderId === user?.id ? "text-black/55" : "text-muted-foreground"}`}>{sender?.name || "Member"} · {new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p></div></div>) : <div className="grid h-full place-items-center text-center"><div><MessageCircle className="mx-auto size-9 text-gold/70" /><p className="mt-3 font-display text-2xl uppercase text-white">Start the conversation</p><p className="mt-2 text-sm text-muted-foreground">Send a clear note about the record, draft, or collaboration.</p></div></div>}</div><form onSubmit={(event) => { event.preventDefault(); if (!draft.trim() || !selectedUserId) return; sendMessage.mutate({ recipientId: selectedUserId, body: draft.trim() }); }} className="flex gap-2 border-t border-white/10 p-4"><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" className="border-white/10 bg-black/30 text-white" /><Button type="submit" disabled={sendMessage.isPending} className="bg-gold text-black hover:bg-gold-soft"><Send className="size-4" /></Button></form></> : <div className="grid flex-1 place-items-center p-8 text-center"><div><UserRound className="mx-auto size-10 text-gold/70" /><h2 className="mt-4 font-display text-3xl uppercase text-white">Choose a member</h2><p className="mt-2 text-sm text-muted-foreground">Your direct-message threads will appear here.</p></div></div>}</section></div></div></SiteLayout>;
}
