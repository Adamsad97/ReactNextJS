import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TaskFlow",
    description: "Gestion de tâches intuitive et efficace",
  };
}
