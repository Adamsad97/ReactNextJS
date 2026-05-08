import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.userId },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}