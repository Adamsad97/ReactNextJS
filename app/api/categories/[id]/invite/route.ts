import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getAuthUser } from "@/app/lib/auth";
import { sendMail } from "@/app/lib/mail";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { email } = await req.json();

    // Check if category exists and user has permission to invite (must be owner or member)
    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [
          { userId: user.userId },
          { members: { some: { id: user.userId } } },
        ],
      },
      include: { members: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Projet introuvable ou accès refusé" }, { status: 404 });
    }

    // Find the user to invite by email
    const userToInvite = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      return NextResponse.json({ error: "Utilisateur introuvable avec cet email" }, { status: 404 });
    }

    // Check if user is already a member
    if (category.members.some((member) => member.id === userToInvite.id)) {
      return NextResponse.json({ error: "L'utilisateur est déjà membre du projet" }, { status: 400 });
    }

    // Check if an invitation already exists
    const existingInvitation = await prisma.projectInvitation.findUnique({
      where: {
        categoryId_userId: {
          categoryId: id,
          userId: userToInvite.id,
        },
      },
    });

    if (existingInvitation) {
      return NextResponse.json({ error: "Une invitation est déjà en attente pour cet utilisateur" }, { status: 400 });
    }

    // Create the invitation
    await prisma.projectInvitation.create({
      data: {
        categoryId: id,
        userId: userToInvite.id,
      },
    });

    // Send notification email
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    
    await sendMail({
      to: email,
      subject: `Invitation to project: ${category.name}`,
      html: `
        <h1>Project Invitation</h1>
        <p>Hello ${userToInvite.name},</p>
        <p>You have been invited to join the project <strong>${category.name}</strong> on TaskFlow.</p>
        <p>Click the link below to view your invitations and join the project:</p>
        <a href="${invitationLink}" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;">View Invitations</a>
      `,
    });

    return NextResponse.json({ message: "Utilisateur invité avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Invite member error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
