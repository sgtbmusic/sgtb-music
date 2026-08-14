import { describe, expect, it } from "vitest";
import {
  getPipelineMode,
  PRE_GENERATION_MODES,
  PRE_GENERATION_WORKFLOW_STAGES,
} from "./preGenerationPipeline";

describe("pre-generation pipeline selector metadata", () => {
  it("exposes the three requested modes in the correct order", () => {
    expect(PRE_GENERATION_MODES.map((mode) => mode.label)).toEqual([
      "Multimodal Seed Ingestion",
      "Hybrid Audio Seeding",
      "Pre-Generation Audio Conditioning",
    ]);
  });

  it("preserves the executive-facing descriptions for each mode", () => {
    expect(getPipelineMode("multimodal").description).toContain("Feeding the AI a pure creative starting point.");
    expect(getPipelineMode("hybrid").description).toContain("Planting an analog audio seed");
    expect(getPipelineMode("conditioning").description).toContain("Directing the AI's machine-learning algorithms");
  });

  it("keeps the downstream workflow stages ordered after the dynamic initiation stage", () => {
    expect(PRE_GENERATION_WORKFLOW_STAGES[0]).toMatchObject({
      step: "01",
      name: "Raw Suno Draft",
    });
    expect(PRE_GENERATION_WORKFLOW_STAGES).toHaveLength(4);
  });
});
