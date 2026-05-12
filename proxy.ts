import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./app/i18n-languaguages/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Cette option force le middleware à utiliser l'hôte du header si disponible
  // et évite l'ajout du port interne 3000
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};