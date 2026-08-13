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

- [x] Add click-to-enter ENTER SGTB RECORDS splash gateway with no autoplay before interaction
- [x] Add randomized two-stage intro playback using five intro clips and five transition clips
- [x] Add splash completion/skip fade transition and sessionStorage one-time playback
- [x] Add login terminal with email/password, Google continuation, Guest access, and Rosie VIP portal
- [x] Route standard users and Guests to the homepage/Artist Draft Pool and Rosie to Suno Business
- [x] Verify all existing routes and run unit tests after the gateway upgrade

Do not add unverified credentials or claim a client-side Rosie button is cryptographically secure; production VIP access must use server-side authentication.

- [x] Replace placeholder splash media slots with real uploaded intro and transition clip URLs when the 10 clips are provided
- [x] Apply the dust-wipe transition when Skip Intro or video completion moves to login
- [x] Create a dedicated Artist Draft Pool destination and route standard/guest entry there
- [x] Keep the login copy accurate about Manus OAuth handling for email/password and Google continuation
- [x] Re-verify /home, /about, /services, /music, /suno, and /contact after the gateway upgrade

- [x] Add a Visuals/Cinematic Vault page to the main navigation
- [x] Display all five intro and five transition videos in an on-demand gallery with controls
- [x] Add a gold Watch Intro trigger in the main header that replays the gateway with audio
- [x] Add a saved Play Cinematic Intro on Login preference, default true for new users
- [x] Make the gateway honor the saved login preference without breaking manual replay
- [x] Add fast navigation micro-transitions for Home, Suno Business, Music, and Draft Pool
- [x] Verify the Vault, replay control, preference behavior, and existing routes; run tests
- [x] Implement three-tier role model (User/Artist, Suno Rep/Rosie, Owner Admin) with backend procedure support
- [x] Build storage-backed upload workflow with rep/admin moderation queues and pending submission status
- [x] Build advanced Admin Portal page with glowing navbar indicator, full system management, and Suno-rep moderation access
- [x] Upgrade Artist Draft Pool into an analytics-focused "sports-betting / financial-market" style review workspace displaying stats, genre, style, and hit potential indicators

- [x] Add a far-right signed-in profile/avatar control with the user name and official login status
- [x] Add a responsive account menu with profile, settings, role, and logout actions
- [x] Upgrade account settings to show role-aware tools for users, Suno reps, and owner admin
- [x] Clarify standard login, Google/Manus OAuth, Guest, and Rosie VIP handoff behavior
- [x] Reorganize navbar for a clear visitor-to-member flow
- [x] Add skippable new-user website guide with rewards-coming-soon preview
- [x] Add Suno Business podcast/radio player with admin-only upload workflow
- [x] Build far-right signed-in profile/avatar control and account menu in SiteNav.tsx
- [x] Upgrade Settings.tsx with role-aware tools for users, Suno reps, and owner admin
- [x] Build skippable new-user website guide component with rewards-coming-soon preview
- [x] Build Suno Business podcast/radio player and admin-only upload workflow on /suno

