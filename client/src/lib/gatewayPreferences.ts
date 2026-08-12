export const PLAY_INTRO_ON_LOGIN_KEY = "sgtb-records-play-intro-on-login";
export const INTRO_REPLAY_EVENT = "sgtb-records:replay-intro";

function readStored(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getPlayIntroOnLogin() {
  const value = readStored(PLAY_INTRO_ON_LOGIN_KEY);
  return value === null ? true : value === "true";
}

export function setPlayIntroOnLogin(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAY_INTRO_ON_LOGIN_KEY, String(enabled));
    window.sessionStorage.setItem(PLAY_INTRO_ON_LOGIN_KEY, String(enabled));
  } catch {
    // Storage can be unavailable in private browsing; the default remains true.
  }
}

export function requestIntroReplay() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTRO_REPLAY_EVENT));
}
