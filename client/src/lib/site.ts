export const BRAND = "SGTB Music";

export const ROSIE_IMAGE = "/manus-storage/rosie-nguyen_32cbb9fe.jpeg";

export const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/music", label: "Catalog" },
  { href: "/rewards", label: "Rewards" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/visuals", label: "Vault" },
  { href: "/contact", label: "Contact" },
] as const;

export const SUNO_NAV = { href: "/suno", label: "Suno Business" } as const;

/** Ordered pipeline stages rendered by the homepage blueprint. */
export const PIPELINE = [
  {
    id: "idea",
    step: "01",
    label: "A&R Brief & Idea",
    caption: "Executive label prompt, reference brief, and market target captured up front.",
  },
  {
    id: "suno",
    step: "02",
    label: "AI A&R Incubation",
    caption: "Rapid commercial prototyping through Suno to deliver high-level Reference Demos.",
  },
  {
    id: "structure",
    step: "03",
    label: "Blueprint Delivery",
    caption: "Turn-key song structure and melody blueprints prepared for label review.",
  },
  {
    id: "protools",
    step: "04",
    label: "Analog Re-Tracking",
    caption: "Replacing digital placeholder vocals via Vocal Realization work-for-hire sessions in Pro Tools.",
  },
  {
    id: "distribution",
    step: "05",
    label: "Organic Interpolation",
    caption: "Signed artist re-recording, exclusive sync placement, and DistroKid global deployment.",
  },
  {
    id: "promotion",
    step: "06",
    label: "Showcase Rollout",
    caption: "Enterprise social packaging and data-backed market growth campaigns.",
  },
] as const;

/** Cover-art template gradients used when a track has no uploaded artwork. */
export const COVER_TEMPLATES = [
  {
    from: "oklch(0.28 0.09 300)",
    to: "oklch(0.16 0.05 265)",
    accent: "oklch(0.85 0.15 90)",
  },
  {
    from: "oklch(0.3 0.1 195)",
    to: "oklch(0.15 0.05 250)",
    accent: "oklch(0.86 0.16 178)",
  },
  {
    from: "oklch(0.32 0.11 40)",
    to: "oklch(0.16 0.05 30)",
    accent: "oklch(0.88 0.14 85)",
  },
  {
    from: "oklch(0.24 0.06 150)",
    to: "oklch(0.14 0.03 200)",
    accent: "oklch(0.85 0.17 150)",
  },
  {
    from: "oklch(0.3 0.12 340)",
    to: "oklch(0.15 0.05 300)",
    accent: "oklch(0.85 0.16 340)",
  },
  {
    from: "oklch(0.26 0.05 265)",
    to: "oklch(0.13 0.02 280)",
    accent: "oklch(0.9 0.1 92)",
  },
] as const;

export function coverTemplate(variant: number) {
  return COVER_TEMPLATES[Math.abs(variant) % COVER_TEMPLATES.length];
}

export function parseCredentials(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
    }
  } catch {
    // Fall back to comma-separated values for hand-edited rows.
    return raw
      .split(",")
      .map(part => part.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Deterministic pseudo-random bar heights so waveforms stay stable per track. */
export function waveformBars(seed: number, count = 72) {
  const bars: number[] = [];
  let value = (seed + 1) * 9301;
  for (let i = 0; i < count; i += 1) {
    value = (value * 9301 + 49297) % 233280;
    const normalized = value / 233280;
    const envelope = 0.45 + 0.55 * Math.sin((i / count) * Math.PI);
    bars.push(Math.max(0.16, Math.min(1, normalized * envelope + 0.2)));
  }
  return bars;
}
