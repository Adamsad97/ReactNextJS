import type { Metadata } from "next";
import RegisterForm from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Inscription",
    description: "Créez votre compte TaskFlow",
  };
}

export default function RegisterPage() {
  return <RegisterForm />;
}