import { cookies } from "next/headers";
import { TaskList } from "@/app/components/task/task-list";
import { TaskFormModal } from "@/app/components/task/task-form-modal";
import type { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard",
    description: "Gérez vos tâches efficacement",
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

export default async function DashboardPage() {
 
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const tasks = await getTasks(token);

  return (
    <div>
      <h1>Dashboard</h1>
      <TaskFormModal />
      <TaskList initialTasks={tasks} />
    </div>
  );
}