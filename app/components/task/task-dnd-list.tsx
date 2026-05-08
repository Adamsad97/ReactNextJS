import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Task DND List",
    description: "Une liste de tâches déplaçables",
  };
}