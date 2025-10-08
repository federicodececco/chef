import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
        chef: {
          select: {
            id: true,
            bio: true,
            bioBrief: true,
            avatarUrl: true,
            coverUrl: true,
            phoneNumber: true,
            nation: true,
            slug: true,
            city: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero utente" },
      { status: 500 },
    );
  }
}
