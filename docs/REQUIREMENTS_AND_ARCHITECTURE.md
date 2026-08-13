# SGTB Music Group — Platform Architecture & Requirements Report

**Author:** Manus AI  
**Project:** SGTB Music Group (`sgtb_music`)  
**Date:** August 2026  

---

## 1. Executive Summary & Review of the Brief

The SGTB Music platform bridges the gap between AI music generators like Suno and industry-standard production, mixing, and label distribution. Following the successful deployment of the VIP Gateway, Cinematic Vault, and on-demand video assets, this phase establishes a robust, role-based governance model, a professional upload workflow, an advanced Admin Portal, and an analytics-driven "financial/betting" style Artist Draft Pool for B2B music buyers and label executives [1].

---

## 2. Role-Based Access Control (RBAC) Specification

To satisfy the operational hierarchy requested for platform administration and moderation, the system defines three distinct permission tiers:

| Tier | Role Key | Target User | Capabilities & Permissions |
| :--- | :--- | :--- | :--- |
| **1. Regular User / Artist** | `user` | Independent musicians, creators, and casual listeners | • Upload MP3/WAV tracks with genre, BPM, and artwork metadata<br>• Manage personal profile and track submissions<br>• Access public catalog, music player, and Cinematic Vault |
| **2. Suno Rep (Limited Admin)** | `rep` | Rosie Nguyen and authorized Suno platform liaisons | • Access moderated Suno Rep portal view<br>• Review pending track submissions (Approve / Reject)<br>• Moderate community comments and manage draft pool curation<br>• View track analytics and engagement metrics |
| **3. Owner Admin (Full Control)** | `admin` | System Owner (CAMG) | • Full system control across all database tables and settings<br>• Manage global user roles, promote reps, and configure system rules<br>• Complete track management (reorder, delete, mass update)<br>• Glowing navigation indicator and master admin portal access |

---

## 3. Storage-Backed Upload Workflow

### Recommended Architecture: Hybrid Portal Uploads
* **Where uploads happen:** Uploads occur directly on the website through the secure web application interface, backed by secure S3 object storage via the pre-configured platform storage helpers (`storagePut`) [2].
* **Workflow:**
  1. Creators or admins select MP3/WAV audio files and cover art in the browser.
  2. Files are streamed to the Express backend, uploaded securely to S3, and assigned persistent storage keys and `/manus-storage/...` proxy URLs [2].
  3. Track metadata, moderation status (`pending` for regular artists, `approved` for owner/rep uploads), and initial stats (`playsCount`, `upvotesCount`, `hitPotential`) are written to the database.
  4. Reps and Admins can review pending submissions in their respective portal queues.

---

## 4. Artist Draft Pool: Financial-Market / Betting Style UI

To provide music labels and A&R executives with immediate, high-impact signal intelligence, the Artist Draft Pool (`/artist-draft-pool`) is styled after a high-end financial ticker / sports-betting interface:
* **Hit Potential Index (%):** Visual momentum indicator calculated from prompt structure, arrangement complexity, and genre demand.
* **Sync-Ready Badge:** Instantly highlights tracks cleared for film, TV, and commercial synchronization.
* **Live Telemetry:** Tracks display real-time play counts, upvotes, BPM, and genre tags in a sleek dark-gold terminal aesthetic.

---

## 5. References
1. SGTB Music Platform Specification & Executive Assessment, August 2026.
2. Manus Webdev File Storage Skill Documentation (`webdev-file-storage`), August 2026.
