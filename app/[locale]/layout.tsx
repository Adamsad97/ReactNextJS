import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar } from "@/app/components/layout/navbar";
import { AppProvider } from "@/app/contexts/app-provider";
import { ProtectedRoute } from "@/app/components/guards/protected-route";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AppProvider>
        <ProtectedRoute>
          <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.94),rgba(247,247,248,1))] text-zinc-950 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%),linear-gradient(to_bottom,rgba(9,9,11,0.98),rgba(15,15,18,1))] dark:text-zinc-50">
            <Navbar />
            <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ProtectedRoute>
      </AppProvider>
    </NextIntlClientProvider>
  );
}