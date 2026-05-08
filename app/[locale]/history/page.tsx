import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Historique",
    description: "Historique de vos tâches terminées et annulées",
  };
}

async function getHistory(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];
  const tasks = await res.json();
  return tasks.filter((task: { status: string }) =>
    task.status === "DONE" || task.status === "CANCELLED"
  );
}

export default async function HistoryPage() {
  const translateNav = await getTranslations("nav");
  const translateTasks = await getTranslations("tasks");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const tasks = await getHistory(token);

  return (
    <section className="card">
      <p className="card-label">{translateNav("history")}</p>
      <h1 className="card-title">{translateNav("history")}</h1>
      <div>
        {tasks.length === 0 ? (
          <p className="card-description">{translateTasks("noHistory")}</p>
        ) : (
          tasks.map((task: { id: string; title: string; status: string; priority: string }) => (
            <div key={task.id}>
              <h3>{task.title}</h3>
              <p>{translateTasks(`status.${task.status}`)}</p>
              <p>{task.priority}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}