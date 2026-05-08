import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./config";
import type { Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (requested ?? defaultLocale) as Locale;

  const msgs = locale === "en"
    ? await import("./english.json")
    : await import("./french.json");

  return {
    locale,
    messages: msgs.default ?? msgs,
  };
});