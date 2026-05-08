import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProfileForm from "./profile-form";
import PasswordForm from "./password-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Paramètres",
    description: "Paramètres de votre compte",
  };
}

export default async function SettingsPage() {
  const translate = await getTranslations("nav");

  return (
    <section className="card">
      <p className="card-label">{translate("settings")}</p>
      <h1 className="card-title">{translate("settings")}</h1>
      <ProfileForm />
      <PasswordForm />
    </section>
  );
}