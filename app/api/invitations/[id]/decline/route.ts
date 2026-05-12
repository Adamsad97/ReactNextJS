import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const invitation = await prisma.projectInvitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.userId !== user.userId) {
      return NextResponse.json({ error: "Invitation introuvable ou accès refusé" }, { status: 404 });
    }

    // Delete the invitation
    await prisma.projectInvitation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invitation refusée" }, { status: 200 });
  } catch (error) {
    console.error("Decline invitation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
