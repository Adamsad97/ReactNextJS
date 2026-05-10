import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

const getCachedTasks = (userId: string) =>
  unstable_cache(
    async () => {
      return await prisma.task.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { position: "asc" },
      });
    },
    [`tasks-${userId}`],
    { revalidate: 60, tags: [`tasks-${userId}`] }
  )();

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const tasks = await getCachedTasks(user.userId);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { title, description, status, priority, deadline, position, categoryId } = await req.json();

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status ?? "TODO",
        priority: priority ?? "MEDIUM",
        deadline: deadline ? new Date(deadline) : null,
        position: position ?? 0,
        userId: user.userId,
        categoryId,
      },
    });

    revalidateTag(`tasks-${user.userId}`, "default");
    revalidatePath("/[locale]/tasks", "page");
    revalidatePath("/[locale]/dashboard", "page");

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}