import { cookies } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Détail de la tâche",
    description: "Détail de la tâche",
  };
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>Tâche {id}</h1>
    </div>
  );
}