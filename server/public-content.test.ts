import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STATIC_CREATORS } from "@/lib/publicContent";
import { CONTACT_EMAIL } from "@/lib/site";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("production-safe public content", () => {
  it("always provides one complete featured Rosie profile", () => {
    const featured = STATIC_CREATORS.filter(creator => creator.isFeatured);

    expect(featured).toHaveLength(1);
    expect(featured[0]).toMatchObject({
      name: "Rosie Nguyen",
      role: "Head of Creators & Content at Suno",
      imageUrl: "/images/rosie-nguyen.jpeg",
      isPlaceholder: false,
    });
    expect(JSON.parse(featured[0]!.credentials ?? "[]")).toEqual([
      "Head of Creators at Suno",
      "Forbes 30 Under 30",
      "1M+ creator",
      "Fanhouse co-founder",
    ]);
  });

  it("keeps the full six-card reserved roster available without an API", () => {
    const placeholders = STATIC_CREATORS.filter(
      creator => creator.isPlaceholder
    );

    expect(placeholders).toHaveLength(6);
    expect(new Set(placeholders.map(creator => creator.id)).size).toBe(6);
    expect(placeholders.every(creator => !creator.isFeatured)).toBe(true);
  });

  it("ships the featured portrait as a non-empty local asset", () => {
    const portrait = path.join(
      projectRoot,
      "client/public/images/rosie-nguyen.jpeg"
    );

    expect(existsSync(portrait)).toBe(true);
    expect(statSync(portrait).size).toBeGreaterThan(1_000);
  });

  it("retains the public booking destination used by the static contact flow", () => {
    expect(CONTACT_EMAIL).toBe("booking@sgtbmusic.com");
  });
});
