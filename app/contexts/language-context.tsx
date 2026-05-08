import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sidebar",
    description: "La barre latérale de navigation",
  };
}