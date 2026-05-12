import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const invitations = await prisma.projectInvitation.findMany({
      where: { userId: user.userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invitations, { status: 200 });
  } catch (error) {
    console.error("Get invitations error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
