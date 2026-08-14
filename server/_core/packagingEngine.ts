export type PackagingResult = {
  genre: string;
  subGenre: string;
  bpm: number;
  trackKey: string;
  vibe: string;
  dspPlacement: string;
  virtualArtists: Array<{ name: string; bio: string; prompt: string }>;
};

export function analyzeTrackPackaging(title: string, lyrics?: string | null): PackagingResult {
  const text = `${title} ${lyrics || ""}`.toLowerCase();

  let genre = "Pop / Commercial";
  let subGenre = "Synth-Pop & Alternative";
  let bpm = 124;
  let trackKey = "Am";
  let vibe = "Cinematic, Atmospheric, Radio Ready";
  let dspPlacement = "Spotify Editorial Lane - Pop Rising / mint";

  if (text.includes("hip") || text.includes("trap") || text.includes("beat") || text.includes("flow")) {
    genre = "Hip-Hop / Trap";
    subGenre = "Melodic Trap & 808s";
    bpm = 142;
    trackKey = "F#m";
    vibe = "Heavy Bass, Confident, Late Night";
    dspPlacement = "Spotify Editorial Lane - RapCaviar / Most Necessary";
  } else if (text.includes("rock") || text.includes("guitar") || text.includes("electric")) {
    genre = "Alternative Rock";
    subGenre = "Indie Rock & Anthem";
    bpm = 128;
    trackKey = "E";
    vibe = "Driving, High Energy, Stadium Anthem";
    dspPlacement = "Spotify Editorial Lane - Rock This / All New Rock";
  } else if (text.includes("sad") || text.includes("slow") || text.includes("piano") || text.includes("tears")) {
    genre = "Ballad / R&B";
    subGenre = "Emotional Pop & Soul";
    bpm = 88;
    trackKey = "C#m";
    vibe = "Intimate, Melancholic, Vocal Forward";
    dspPlacement = "Spotify Editorial Lane - Luminaries / Chill Hits";
  }

  // Generate 3 contextual virtual artist personas based on genre and title
  const cleanTitle = title.trim() || "Midnight Echoes";
  const virtualArtists = [
    {
      name: genre.includes("Hip-Hop") ? "Zane Sterling" : "Aria Vance",
      bio: `Fresh virtual persona calibrated for ${genre} market resonance with high streaming conversion.`,
      prompt: `Cinematic artist portrait for ${cleanTitle}, sophisticated studio lighting, moody luxury aesthetics, 85mm portrait lens --ar 1:1`
    },
    {
      name: genre.includes("Rock") ? "The Atlas Riot" : "Kaelen Cross",
      bio: `Emerging analog-synthetic hybrid act bridging algorithmic incubation with live session appeal.`,
      prompt: `Live performance portrait for ${cleanTitle}, dramatic stage backlighting, high-end production atmosphere --ar 1:1`
    },
    {
      name: "Nyx & The Echo",
      bio: `Boutique publishing project engineered for sync licensing and elite global DSP playlists.`,
      prompt: `Duo promotional photo for ${cleanTitle}, minimalist avant-garde styling, professional color grade --ar 1:1`
    }
  ];

  return {
    genre,
    subGenre,
    bpm,
    trackKey,
    vibe,
    dspPlacement,
    virtualArtists,
  };
}
