export type IntroClip = {
  id: string;
  label: string;
  src: string;
  poster?: string;
};

/**
 * The single retained SGTB Records gateway asset: the architect in the car
 * wearing the SGTB chain. All legacy intro and transition options were removed
 * so the entry experience has one high-performance visual source of truth.
 */
export const CAR_INTRO_CLIP: IntroClip = {
  id: "sgtb-car-chain",
  label: "The SGTB architect / chain sequence",
  src: "/manus-storage/intro5_f80463a5.mp4",
  poster: "/manus-storage/05_van_interior_b6f4ed07.png",
};

export const INTRO_CLIPS: IntroClip[] = [CAR_INTRO_CLIP];
export const TRANSITION_CLIPS: IntroClip[] = [CAR_INTRO_CLIP];

export function chooseRandomClip(clips: IntroClip[] = INTRO_CLIPS) {
  return clips[0] ?? CAR_INTRO_CLIP;
}
