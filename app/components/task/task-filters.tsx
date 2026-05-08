import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Task Filters",
    description: "Filtres pour organiser les tâches",
  };
}