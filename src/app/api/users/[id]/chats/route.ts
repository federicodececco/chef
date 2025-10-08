import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: params.userId },
      include: {
        Messages: {
          orderBy: { createdAt: "asc" },
        },
        chef: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Errore nel recupero delle chat:", error);
    return NextResponse.json(
      { error: "Errore nel recupero delle chat" },
      { status: 500 },
    );
  }
}
