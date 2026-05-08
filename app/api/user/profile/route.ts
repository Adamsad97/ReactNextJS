import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { name, email } = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: { name, email },
    });

    return NextResponse.json({ id: updated.id, name: updated.name, email: updated.email });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}