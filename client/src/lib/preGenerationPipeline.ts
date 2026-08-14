import { Layers, Radio, Sparkles } from "lucide-react";

type PipelineIcon = typeof Layers;

export type PipelineMode = "multimodal" | "hybrid" | "conditioning";

export type ModeDefinition = {
  id: PipelineMode;
  label: string;
  shortLabel: string;
  description: string;
  initiation: string;
  initiationDetail: string;
  icon: PipelineIcon;
};

export const PRE_GENERATION_MODES: ModeDefinition[] = [
  {
    id: "multimodal",
    label: "Multimodal Seed Ingestion",
    shortLabel: "Multimodal Seed",
    description:
      "Feeding the AI a pure creative starting point. Whether it is lyrics, custom beats, or live instruments—any vibe, any sound!",
    initiation: "Creative seed architecture",
    initiationDetail: "Lyrics, custom beats, live instruments, and reference texture captured as one creative brief.",
    icon: Layers,
  },
  {
    id: "hybrid",
    label: "Hybrid Audio Seeding",
    shortLabel: "Hybrid Audio",
    description:
      "Planting an analog audio seed—such as a custom 808, a rhythm loop, or an isolated stem—for the AI to organically grow into complex arrangements, targeted structures, or full commercial songs.",
    initiation: "Analog seed architecture",
    initiationDetail: "Custom 808s, rhythm loops, and isolated stems establish the sonic DNA before arrangement generation.",
    icon: Radio,
  },
  {
    id: "conditioning",
    label: "Pre-Generation Audio Conditioning",
    shortLabel: "Audio Conditioning",
    description:
      "Directing the AI's machine-learning algorithms by feeding it precise reference material to train and firmly guide the final audio output.",
    initiation: "Reference control architecture",
    initiationDetail: "Precise reference material defines the tonal, structural, and performance parameters for the final output.",
    icon: Sparkles,
  },
];

export const PRE_GENERATION_WORKFLOW_STAGES = [
  { step: "01", name: "Raw Suno Draft", desc: "Initial text-to-audio prompt composition & seed curation" },
  { step: "02", name: "Stem Separation", desc: "Isolated vocal, drum, bass, and synth extraction" },
  { step: "03", name: "Pro Tools Hybrid Mix", desc: "Analog outboard processing, vocal tuning, & master bus" },
  { step: "04", name: "DistroKid Ingestion", desc: "Global streaming deployment & sync publishing" },
] as const;

export function getPipelineMode(id: PipelineMode): ModeDefinition {
  return PRE_GENERATION_MODES.find((mode) => mode.id === id) ?? PRE_GENERATION_MODES[0];
}
