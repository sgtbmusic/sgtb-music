export type IntroClip = {
  id: string;
  label: string;
  src: string;
  poster?: string;
};

/**
 * Persistent SGTB Records entry media. These URLs are the uploaded project
 * storage assets, so the deployed app does not depend on local public files.
 */
export const INTRO_CLIPS: IntroClip[] = [
  {
    id: "intro-01",
    label: "Ground-level heels",
    src: "/manus-storage/intro1_a1a25949.mp4",
    poster: "/manus-storage/01_ground_level_heels_3a38c81a.png",
  },
  {
    id: "intro-02",
    label: "Rosie approaches",
    src: "/manus-storage/intro2_10e7fcbd.mp4",
    poster: "/manus-storage/02_rosie_walking_d0e835c7.png",
  },
  {
    id: "intro-03",
    label: "The envelope stash",
    src: "/manus-storage/intro3_45ed6aae.mp4",
    poster: "/manus-storage/03_envelope_stash_ee3a8025.png",
  },
  {
    id: "intro-04",
    label: "Rosie's reaction",
    src: "/manus-storage/intro4_6a18609a.mp4",
    poster: "/manus-storage/04_rosie_reaction_205e3cd3.png",
  },
  {
    id: "intro-05",
    label: "The SGTB architect",
    src: "/manus-storage/intro5_f80463a5.mp4",
    poster: "/manus-storage/05_van_interior_b6f4ed07.png",
  },
];

export const TRANSITION_CLIPS: IntroClip[] = [
  {
    id: "transition-01",
    label: "Mirror surveillance",
    src: "/manus-storage/trans1_d6ae2899.mp4",
    poster: "/manus-storage/06_mirror_surveillance_0b5f3a3a.png",
  },
  {
    id: "transition-02",
    label: "Headlight sweep",
    src: "/manus-storage/trans2_220c5dde.mp4",
    poster: "/manus-storage/07_headlight_sweep_977076bd.png",
  },
  {
    id: "transition-03",
    label: "Empty sidewalk",
    src: "/manus-storage/trans3_3ab5ef27.mp4",
    poster: "/manus-storage/08_empty_sidewalk_628a2e2a.png",
  },
  {
    id: "transition-04",
    label: "The retrieval",
    src: "/manus-storage/trans4_cfe7b3ea.mp4",
    poster: "/manus-storage/10_retrieval_closeup_6f434859.png",
  },
  {
    id: "transition-05",
    label: "Gold dust reveal",
    src: "/manus-storage/trans5_0f8323e3.mp4",
    poster: "/manus-storage/11_gold_dust_transition_84afc747.png",
  },
];

export function chooseRandomClip(clips: IntroClip[]) {
  return clips[Math.floor(Math.random() * clips.length)] ?? clips[0];
}
