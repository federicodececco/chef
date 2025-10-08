import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewMessageEmail } from "@/util/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, chefId, userId, isChef, text } = body;

    if (text === undefined || isChef === undefined) {
      return NextResponse.json(
        { error: "text e isChef sono obbligatori" },
        { status: 400 },
      );
    }

    let chat;
    let isNewChat = false;

    if (chatId) {
      chat = await prisma.chat.findUnique({
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
        return NextResponse.json(
          { error: "Chat non trovata" },
          { status: 404 },
        );
      }
    } else {
      if (!chefId || !userId) {
        return NextResponse.json(
          {
            error: "chefId e userId sono obbligatori per creare una nuova chat",
          },
          { status: 400 },
        );
      }

      chat = await prisma.chat.findFirst({
        where: {
          chefId,
          userId,
        },
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
        chat = await prisma.chat.create({
          data: {
            chefId,
            userId,
          },
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
        isNewChat = true;
      }
    }

    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        isChef,
        text,
        isRed: false,
      },
    });

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

    return NextResponse.json({
      ...message,
      chatId: chat.id,
      isNewChat,
    });
  } catch (error) {
    console.error("Errore nella gestione del messaggio:", error);
    return NextResponse.json(
      { error: "Errore nella gestione del messaggio" },
      { status: 500 },
    );
  }
}
