import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const chats = await prisma.chat.findMany({
      where: { chefId: id },
      include: {
        Messages: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: {
            firstname: true,
            lastname: true,
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
