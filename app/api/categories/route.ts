import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: user.userId },
        { members: { some: { id: user.userId } } },
      ],
    },
    include: {
      tasks: true,
      members: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { name, color } = await req.json();

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: user.userId,
        members: { connect: { id: user.userId } },
      },
      include: {
        members: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}