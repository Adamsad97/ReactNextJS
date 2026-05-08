export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeNames = {
  fr: "Français",
  en: "English",
};

export const messages = {
  fr: () => import("./french.json"),
  en: () => import("./english.json"),
};