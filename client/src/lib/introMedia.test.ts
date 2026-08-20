import { describe, expect, it } from "vitest";
import { CAR_INTRO_CLIP, INTRO_CLIPS, TRANSITION_CLIPS, chooseRandomClip } from "./introMedia";

describe("intro media manifest", () => {
  it("contains only the retained SGTB car-and-chain clip", () => {
    expect(INTRO_CLIPS).toHaveLength(1);
    expect(TRANSITION_CLIPS).toHaveLength(1);
    expect(INTRO_CLIPS[0]).toEqual(CAR_INTRO_CLIP);
    expect(TRANSITION_CLIPS[0]).toEqual(CAR_INTRO_CLIP);
    expect(CAR_INTRO_CLIP.id).toBe("sgtb-car-chain");
    expect(CAR_INTRO_CLIP.src).toContain("intro5_");
  });

  it("keeps the retained clip playable with a visual fallback poster", () => {
    expect(CAR_INTRO_CLIP.src).toMatch(/\.mp4$/);
    expect(CAR_INTRO_CLIP.poster).toMatch(/^\/manus-storage\//);
  });

  it("returns the retained clip from the supplied collection", () => {
    expect(chooseRandomClip(INTRO_CLIPS)).toEqual(CAR_INTRO_CLIP);
  });
});
