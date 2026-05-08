import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Accueil",
    description: "Bienvenue sur TaskFlow",
  };
}

export default function Home() {
  const t = useTranslations("nav");

  return (
    <main>
      <h1>{t("dashboard")}</h1>
    </main>
  );
}