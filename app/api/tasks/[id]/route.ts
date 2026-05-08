import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const task = await prisma.task.findFirst({
    where: { id, userId: user.userId },
    include: { category: true },
  });

  if (!task) return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });

  return NextResponse.json(task);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { title, description, status, priority, deadline, position, categoryId } = await req.json();

    const task = await prisma.task.updateMany({
      where: { id, userId: user.userId },
      data: { title, description, status, priority, deadline: deadline ? new Date(deadline) : null, position, categoryId },
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await prisma.task.deleteMany({
      where: { id, userId: user.userId },
    });

    return NextResponse.json({ message: "Tâche supprimée" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}