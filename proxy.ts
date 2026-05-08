import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./app/i18n-languaguages/config";

const intlProxy = createMiddleware({
  locales,
  defaultLocale,
});

export function proxy(request: NextRequest) {
  return intlProxy(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};