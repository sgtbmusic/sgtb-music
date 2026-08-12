import { beforeEach, describe, expect, it } from "vitest";
import { getPlayIntroOnLogin, setPlayIntroOnLogin } from "./gatewayPreferences";

function makeStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("gateway preferences", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: makeStorage(),
        sessionStorage: makeStorage(),
      },
    });
  });

  it("defaults to enabled for a new browser", () => {
    expect(getPlayIntroOnLogin()).toBe(true);
  });

  it("persists the preference to local and session storage", () => {
    setPlayIntroOnLogin(false);
    expect(getPlayIntroOnLogin()).toBe(false);
    setPlayIntroOnLogin(true);
    expect(getPlayIntroOnLogin()).toBe(true);
  });
});
