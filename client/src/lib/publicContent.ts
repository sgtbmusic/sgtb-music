import type { Creator } from "@shared/types";

const STATIC_CONTENT_DATE = new Date("2026-01-01T00:00:00.000Z");

const placeholderCredentials = JSON.stringify([
  "Highlight to be added",
  "Highlight to be added",
  "Highlight to be added",
]);

/**
 * Production-safe public content for the assets-only Cloudflare deployment.
 *
 * A connected full-stack deployment can replace this list with database data,
 * but public visitors should never see a blank page while that API is absent or
 * temporarily unavailable.
 */
export const STATIC_CREATORS: Creator[] = [
  {
    id: -1,
    name: "Rosie Nguyen",
    role: "Head of Creators & Content at Suno",
    handle: "@rosie",
    imageUrl: "/images/rosie-nguyen.jpeg",
    imageKey: null,
    credentials: JSON.stringify([
      "Head of Creators at Suno",
      "Forbes 30 Under 30",
      "1M+ creator",
      "Fanhouse co-founder",
    ]),
    bio: "Cofounded Fanhouse, a platform that helped thousands of creators make over $20M and raised over $22M before its acquisition in 2023. Today, Rosie leads Creators & Content at Suno and brings firsthand experience growing personal and professional audiences to more than one million people.",
    isPlaceholder: false,
    isFeatured: true,
    sortOrder: 0,
    createdAt: STATIC_CONTENT_DATE,
    updatedAt: STATIC_CONTENT_DATE,
  },
  ...Array.from(
    { length: 6 },
    (_, index): Creator => ({
      id: -(index + 2),
      name: `Creator Slot ${String(index + 2).padStart(2, "0")}`,
      role: "Role to be announced",
      handle: null,
      imageUrl: null,
      imageKey: null,
      credentials: placeholderCredentials,
      bio: "This profile is reserved for another operator shaping the Suno ecosystem.",
      isPlaceholder: true,
      isFeatured: false,
      sortOrder: index + 1,
      createdAt: STATIC_CONTENT_DATE,
      updatedAt: STATIC_CONTENT_DATE,
    })
  ),
];
