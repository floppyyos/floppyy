import {
  GUESTBOOK_AVATARS,
  GuestbookAvatar,
  NICK_MAX_LENGTH,
  STATUS_OPTIONS,
  UserStatus,
  isGuestbookAvatar,
} from "@/lib/guestbook/types";

export const PROFILE_NICK_KEY = "floppyy-profile-nick";
export const PROFILE_STATUS_KEY = "floppyy-profile-status";
export const PROFILE_AVATAR_KEY = "floppyy-profile-avatar";

export type FloppyyProfile = {
  nick: string;
  status: UserStatus;
  avatar: GuestbookAvatar;
};

export function readProfile(): FloppyyProfile {
  let nick = "";
  let status: UserStatus = "online";
  let avatar: GuestbookAvatar = GUESTBOOK_AVATARS[0];

  try {
    nick =
      globalThis.localStorage.getItem(PROFILE_NICK_KEY)?.slice(0, NICK_MAX_LENGTH) ??
      globalThis.localStorage.getItem("floppyy-irc-nick")?.slice(0, NICK_MAX_LENGTH) ??
      "";

    const saved =
      globalThis.localStorage.getItem(PROFILE_STATUS_KEY) ??
      globalThis.localStorage.getItem("floppyy-irc-status");
    if (saved && (STATUS_OPTIONS as readonly string[]).includes(saved)) status = saved as UserStatus;

    const savedAvatar = globalThis.localStorage.getItem(PROFILE_AVATAR_KEY);
    if (isGuestbookAvatar(savedAvatar)) avatar = savedAvatar;
  } catch {
    /* localStorage unavailable */
  }

  return { nick, status, avatar };
}

export function writeProfile(profile: FloppyyProfile) {
  try {
    globalThis.localStorage.setItem(PROFILE_NICK_KEY, profile.nick.slice(0, NICK_MAX_LENGTH));
    globalThis.localStorage.setItem(PROFILE_STATUS_KEY, profile.status);
    globalThis.localStorage.setItem(PROFILE_AVATAR_KEY, profile.avatar);
    globalThis.localStorage.setItem("floppyy-irc-nick", profile.nick.slice(0, NICK_MAX_LENGTH));
    globalThis.localStorage.setItem("floppyy-irc-status", profile.status);
    globalThis.dispatchEvent(new CustomEvent("floppyy-profile-change", { detail: profile }));
  } catch {
    /* localStorage unavailable */
  }
}

export function onProfileChange(callback: (profile: FloppyyProfile) => void) {
  const handler = (event: Event) => {
    callback((event as CustomEvent<FloppyyProfile>).detail ?? readProfile());
  };
  globalThis.addEventListener("floppyy-profile-change", handler);
  return () => globalThis.removeEventListener("floppyy-profile-change", handler);
}
