"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale, localeNames } from "@/app/i18n-languaguages/config";
import { useAuth } from "@/app/contexts/auth-context";
import { Notifications } from "./notifications";

const THEME_STORAGE_KEY = "task-flow-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

const navigationItems = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/tasks", key: "tasks" },
  { href: "/history", key: "history" },
  { href: "/settings", key: "settings" },
] as const;

function getPathWithoutLocale(pathname: string, locale: Locale) {
  const prefix = `/${locale}`;
  return pathname === prefix ? "" : pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = getPathWithoutLocale(pathname, locale);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const targetPath = currentPath === "" ? `/${nextLocale}` : `/${nextLocale}${currentPath}`;
    router.push(targetPath);
  };

  const toggleTheme = () => {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/${locale}`} className="group inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-950 to-zinc-700 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition-transform duration-200 group-hover:-translate-y-0.5 dark:from-white dark:to-zinc-300 dark:text-zinc-950">
                TF
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                  Task Flow
                </span>
                <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  {t("dashboard")}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              {mounted && isAuthenticated && (
                <>
                  <Notifications />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="locale-button locale-button-inactive"
                  >
                    {t("logout")}
                  </button>
                </>
              )}
              {locales.map((itemLocale) => (
                <button
                  key={itemLocale}
                  type="button"
                  onClick={() => switchLocale(itemLocale)}
                  className={`locale-button ${itemLocale === locale ? "locale-button-active" : "locale-button-inactive"}`}
                >
                  {localeNames[itemLocale]}
                </button>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-full border border-black/10 bg-zinc-100 p-2 text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                aria-label="Toggle dark mode"
                aria-pressed={theme === "dark"}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 dark:hidden" aria-hidden="true">
                    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hidden h-4 w-4 dark:block" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <nav className="nav-container">
            {navigationItems.map((item) => {
              const href = `/${locale}${item.href}`;
              const isActive = currentPath === item.href;
              return (
                <Link key={item.key} href={href} className={`nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="locale-toggle-group">
            {mounted && isAuthenticated && (
              <>
                <Notifications />
                <span className="navbar-user-name">
                  {user?.name}
                </span>
                <div className="navbar-divider" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="navbar-logout-btn"
                >
                  {t("logout")}
                </button>
                <div className="navbar-divider" />
              </>
            )}
            <div className="navbar-lang-group">
              {locales.map((itemLocale) => (
                <button
                  key={itemLocale}
                  type="button"
                  onClick={() => switchLocale(itemLocale)}
                  className={`locale-button ${itemLocale === locale ? "locale-button-active" : "locale-button-inactive"}`}
                >
                  {localeNames[itemLocale]}
                </button>
              ))}
            </div>
            <div className="navbar-divider" />
            <button
              type="button"
              onClick={toggleTheme}
              className="navbar-theme-btn"
              aria-label="Toggle dark mode"
              aria-pressed={theme === "dark"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 dark:hidden" aria-hidden="true">
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hidden h-4 w-4 dark:block" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}