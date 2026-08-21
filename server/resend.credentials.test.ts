import { describe, expect, it } from "vitest";

describe("Resend credentials", () => {
  it("accepts the configured API key at the lightweight domains endpoint", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status).toBe(200);
  }, 15_000);
});
