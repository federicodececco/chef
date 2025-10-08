import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chefId, userId } = body;

    if (!chefId || !userId) {
      return NextResponse.json(
        { error: "chefId e userId sono obbligatori" },
        { status: 400 },
      );
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        chefId,
        userId,
      },
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
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (existingChat) {
      return NextResponse.json(existingChat);
    }

    const chat = await prisma.chat.create({
      data: {
        chefId,
        userId,
      },
      include: {
        Messages: true,
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
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Errore nella creazione della chat:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della chat" },
      { status: 500 },
    );
  }
}
