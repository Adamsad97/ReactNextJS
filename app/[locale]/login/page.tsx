import type { Metadata } from "next";
import LoginForm from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Connexion",
    description: "Connectez-vous à TaskFlow",
  };
}

export default function LoginPage() {
  return <LoginForm />;
}