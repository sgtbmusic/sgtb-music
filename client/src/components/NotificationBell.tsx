import { useState, useEffect } from "react";
import { Bell, Sparkles, Music, ArrowUpRight, Check, Volume2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { toast } from "sonner";

export function NotificationBell() {
  const [unread, setUnread] = useState(true);
  const [pushSubscribed, setPushSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushSubscribed(Notification.permission === "granted");
    }
  }, []);

  const handleTogglePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser push notifications are not supported in this environment.");
      return;
    }
    if (Notification.permission === "granted") {
      setPushSubscribed(true);
      toast.success("Browser push notifications already active!");
      return;
    }
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setPushSubscribed(true);
      toast.success("Push notifications enabled! You will receive instant stem drop alerts.");
      new Notification("SGTB Music Dispatch", {
        body: "Push alerts successfully linked. Unreleased stem drops will now trigger instant alerts.",
      });
    } else {
      toast.error("Push permission denied.");
    }
  };

  const notifications = [
    {
      id: 1,
      title: "New Stems Unlocked: 'Neural Echoes'",
      description: "Dry vocal stems and Pro Tools hybrid session files are now available for VIP Tastemakers.",
      time: "2h ago",
      badge: "STEM DROP",
      link: "/rewards",
    },
    {
      id: 2,
      title: "Cadence Club Tournament Active",
      description: "Season 04 points reset countdown is live. Climb the leaderboard for executive sync priority.",
      time: "1d ago",
      badge: "SEASONAL",
      link: "/rewards",
    },
    {
      id: 3,
      title: "Suno Radio Talk Ep. 08 Live",
      description: "Rosie Nguyen breaks down dynamic persona engineering for upcoming major label drops.",
      time: "3d ago",
      badge: "RADIO",
      link: "/suno",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-neon"
          aria-label="Notifications"
          onClick={() => setUnread(false)}
        >
          <Bell className="w-4 h-4 text-gold" />
          {unread && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon animate-pulse" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-4 glass-panel border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h4 className="font-display text-sm uppercase text-white tracking-wider">Stem & Club Alerts</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-2.5 font-mono text-[10px] ${pushSubscribed ? 'bg-neon/20 text-neon border-neon/40' : 'bg-white/5 text-muted-foreground border-white/10'}`}
            onClick={handleTogglePush}
          >
            <Volume2 className="w-3 h-3 mr-1" /> {pushSubscribed ? "Push Active" : "Enable Push"}
          </Button>
        </div>

        <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.map((item) => (
            <Link key={item.id} href={item.link}>
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-neon uppercase tracking-wider px-1.5 py-0.5 rounded bg-neon/10">
                    {item.badge}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                </div>
                <h5 className="font-display text-xs text-white group-hover:text-gold transition-colors">{item.title}</h5>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">SGTB Dispatch Net</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs font-mono text-neon hover:text-neon/80 hover:bg-transparent px-2"
            onClick={() => setUnread(false)}
          >
            <Check className="w-3 h-3 mr-1" /> Mark Read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
