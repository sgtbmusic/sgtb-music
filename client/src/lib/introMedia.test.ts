import { describe, expect, it } from "vitest";
import { INTRO_CLIPS, TRANSITION_CLIPS, chooseRandomClip } from "./introMedia";

describe("intro media manifest", () => {
  it("contains five intro and five transition clip slots", () => {
    expect(INTRO_CLIPS).toHaveLength(5);
    expect(TRANSITION_CLIPS).toHaveLength(5);
    expect(new Set(INTRO_CLIPS.map((clip) => clip.id)).size).toBe(5);
    expect(new Set(TRANSITION_CLIPS.map((clip) => clip.id)).size).toBe(5);
  });

  it("keeps each slot playable with a source and visual fallback poster", () => {
    for (const clip of [...INTRO_CLIPS, ...TRANSITION_CLIPS]) {
      expect(clip.src).toMatch(/\.mp4$/);
      expect(clip.poster).toMatch(/^\/manus-storage\//);
    }
  });

  it("chooses a clip from the provided collection", () => {
    const clip = chooseRandomClip(INTRO_CLIPS);
    expect(INTRO_CLIPS).toContain(clip);
  });
});
