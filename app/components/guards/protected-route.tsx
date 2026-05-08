"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLocale } from "next-intl";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const publicRoutes = [`/${locale}/login`, `/${locale}/register`];
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, pathname, router, locale]);

  return <>{children}</>;
}