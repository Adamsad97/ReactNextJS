import { cookies } from "next/headers";
import { TaskList } from "@/app/components/task/task-list";
import { ProjectManager } from "@/app/components/task/project-manager";
import { ProjectHeader } from "@/app/components/task/project-header";
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
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const tasks = await getTasks(token);

  return (
    <div className="flex flex-col w-full gap-6">
      <ProjectManager />
      <section className="card">
        <ProjectHeader />
        <TaskList initialTasks={tasks} />
      </section>
    </div>
  );
}