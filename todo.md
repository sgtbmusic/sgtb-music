# SGTB Music — Project TODO

## Foundation
- [x] Upload Rosie Nguyen image to webdev storage and record URL (`/manus-storage/rosie-nguyen_32cbb9fe.jpeg`)
- [x] Global dark theme with neon + gold accent tokens in `index.css`
- [x] Cinematic Google Fonts loaded in `client/index.html`
- [x] Custom easing tokens + reusable micro-animation utilities

## Data layer
- [x] `tracks` table in `drizzle/schema.ts` (title, artist, coverUrl, audioUrl, fileKey, mimeType, sortOrder, bpm, genre)
- [x] `creators` table in `drizzle/schema.ts` (name, role, imageUrl, credentials JSON, bio, sortOrder, isPlaceholder)
- [x] `contactMessages` table for `/contact` submissions
- [x] Migration generated and applied via `webdev_execute_sql`
- [x] Seed Rosie Nguyen creator row with exact credentials + 5 neutral placeholder slots
- [x] `server/db.ts` query helpers for tracks, creators, and contact messages
- [x] `server/routers/tracks.ts`: `list`, `create`, `update`, `remove`, `reorder`
- [x] `server/routers/creators.ts`: `list`, `create`, `update`, `remove`, `reorder`
- [x] `server/routers/uploads.ts`: audio (MP3/WAV) and image upload to S3
- [x] `server/routers/contact.ts`: public `submit`, admin `list`
- [x] All owner-managed mutations (tracks, creators, uploads) gated behind `adminProcedure`; `contact.submit` intentionally public

## Routing and navigation
- [x] True multi-page routes registered in `App.tsx`: `/`, `/home`, `/about`, `/services`, `/music`, `/suno`, `/contact`
- [x] Persistent top navigation bar rendered on every page
- [x] Glowing "Suno Business" nav button styled distinctly from standard links
- [x] Mobile responsive nav (sheet/drawer) with all routes
- [x] Site footer with navigation escape routes
- [x] Route changes scroll to top of new page

## Homepage (`/home`)
- [x] Bold hero positioning SGTB Music as the bridge between Suno AI and industry-ready music
- [x] Animated workflow blueprint: User/Idea → Suno → Song Structure → Pro Tools → Suno/Blackbox/DistroKid → Social Promotion
- [x] Blueprint nodes animate in sequence with connecting line progression
- [x] Secondary homepage sections explaining the humanizing / industry-standard transition
- [x] CTAs linking to `/music`, `/services`, and `/suno`

## Suno Business page (`/suno`)
- [x] Visually distinct style from the rest of the site (ink base, aurora bloom, scanlines)
- [x] Auto-playing social-media-style notification pop-ups on page load cycling Rosie's credentials
- [x] Pop-ups display over blurred background of Rosie's image, then settle into her profile card
- [x] Rosie Nguyen clickable profile card using her uploaded image (never a placeholder)
- [x] Clicking Rosie's card replays credential pop-ups then transitions to her full bio
- [x] Credentials read exactly: Head of Creators at Suno, Forbes 30 Under 30, 1M+ creator, Fanhouse co-founder
- [x] Rosie full bio text (Fanhouse $20M+ creator earnings, $22M raised, 2023 acquisition, Head of Creators & Content at Suno, 1M+ personal following)
- [x] Team grid of neutral placeholder creator cards, clickable in the same style as Rosie's
- [x] Owner-only settings icon on `/suno` to add, edit, and delete creator profiles
- [x] Creator editor supports image upload, name, role, credentials, and bio

## Music page (`/music`)
- [x] BeatStars-style player with playlist display
- [x] Waveform-style animated progress bar with seek
- [x] Play/pause, previous, next, volume, and time display controls
- [x] Attractive generated placeholder cover art for tracks without an uploaded image
- [x] Owner-only admin panel to upload MP3/WAV, set title, cover image, and manage playlist order
- [x] Track delete and reorder controls for owner

## Other pages
- [x] `/about` page with brand story
- [x] `/services` page detailing the production and distribution offering
- [x] `/contact` page with working inquiry form persisted to the database

## Quality
- [x] Vitest coverage for track procedures and owner gating
- [x] Vitest coverage for creator procedures and owner gating
- [x] Vitest coverage for upload validation and contact form
- [x] Visual verification of all pages at desktop and mobile widths
- [x] `prefers-reduced-motion` respected for non-essential motion
- [x] Checkpoint saved before delivery
