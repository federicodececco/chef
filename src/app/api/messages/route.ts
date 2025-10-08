import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewMessageEmail } from "@/util/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, isChef, text } = body;

    if (!chatId || text === undefined || isChef === undefined) {
      return NextResponse.json(
        { error: "chatId, text e isChef sono obbligatori" },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        isChef,
        text,
        isRed: false,
      },
    });

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        chef: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat non trovata" }, { status: 404 });
    }

    const recipientEmail = isChef ? chat.user.email : chat.chef.user.email;
    const senderName = isChef
      ? `Chef ${chat.chef.user.firstname} ${chat.chef.user.lastname}`
      : `${chat.user.firstname} ${chat.user.lastname}`;

    const chatUrl = isChef
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/user/messages`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/chef/dashboard?tab=messages`;

    sendNewMessageEmail({
      to: recipientEmail,
      senderName,
      messageText: text,
      chatUrl,
    }).catch((error: unknown) => {
      console.error("Errore nell'invio dell'email:", error);
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Errore nella creazione del messaggio:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del messaggio" },
      { status: 500 },
    );
  }
}
