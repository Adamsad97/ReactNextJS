import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const task = await prisma.task.findFirst({
    where: {
      id,
      OR: [
        { userId: user.userId },
        { assignees: { some: { id: user.userId } } },
        { category: { members: { some: { id: user.userId } } } }
      ]
    },
    include: { category: true, assignees: { select: { id: true, name: true, email: true } } },
  });

  if (!task) return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });

  return NextResponse.json(task);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { title, description, status, priority, deadline, position, categoryId, assigneeIds } = await req.json();

    // Check permissions
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { userId: user.userId },
          { assignees: { some: { id: user.userId } } },
          { category: { members: { some: { id: user.userId } } } }
        ]
      }
    });

    if (!existingTask) return NextResponse.json({ error: "Tâche introuvable ou accès refusé" }, { status: 404 });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        position,
        categoryId,
        assignees: assigneeIds ? {
          set: [],
          connect: assigneeIds.map((id: string) => ({ id }))
        } : undefined,
      },
      include: { assignees: { select: { id: true, name: true, email: true } } }
    });

    revalidateTag(`tasks-${user.userId}`, "default");
    revalidatePath("/[locale]/tasks", "page");
    revalidatePath("/[locale]/dashboard", "page");

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { userId: user.userId },
          { assignees: { some: { id: user.userId } } },
          { category: { members: { some: { id: user.userId } } } }
        ]
      }
    });

    if (!existingTask) return NextResponse.json({ error: "Tâche introuvable ou accès refusé" }, { status: 404 });

    await prisma.task.delete({
      where: { id },
    });

    revalidateTag(`tasks-${user.userId}`, "default");
    revalidatePath("/[locale]/tasks", "page");
    revalidatePath("/[locale]/dashboard", "page");

    return NextResponse.json({ message: "Tâche supprimée" });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}