import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { TaskList } from "@/app/components/task/task-list";
import { TaskFormModal } from "@/app/components/task/task-form-modal";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tâches",
    description: "Liste de vos tâches",
  };
}

async function getTasks(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function TasksPage() {
  const t = await getTranslations("tasks");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const tasks = await getTasks(token);

  return (
    <section className="card">
      <p className="card-label">{t("title")}</p>
      <h1 className="card-title">{t("title")}</h1>
      <TaskFormModal />
      <TaskList initialTasks={tasks} />
    </section>
  );
}