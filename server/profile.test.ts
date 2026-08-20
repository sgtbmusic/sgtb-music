import { describe, expect, it } from "vitest";
import { parseSocialLinks } from "./routers/profile";

describe("profile social links", () => {
  it("returns typed links from valid stored JSON", () => {
    expect(parseSocialLinks(JSON.stringify([{ label: "Site", url: "https://sgtbmusicgroup.com" }]))).toEqual([
      { label: "Site", url: "https://sgtbmusicgroup.com" },
    ]);
  });

  it("fails closed for empty or malformed values", () => {
    expect(parseSocialLinks(null)).toEqual([]);
    expect(parseSocialLinks("not-json")).toEqual([]);
    expect(parseSocialLinks(JSON.stringify([{ label: "missing-url" }]))).toEqual([]);
  });
});
