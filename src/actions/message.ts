"use server";

import { prisma } from "@/lib/prisma";

export async function createMessage(data: {
  chatId: string;
  isChef: boolean;
  text: string;
  isRed?: boolean;
}) {
  try {
    const message = await prisma.message.create({
      data: {
        ...data,
        isRed: data.isRed ?? false,
      },
    });
    return { success: true, data: message };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create message" };
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.message.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function getMessage(id: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        Chat: true,
      },
    });
    return { success: true, data: message };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch message" };
  }
}

export async function getMessagesByChat(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: {
        id: "asc",
      },
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function deleteMessagesByChat(chatId: string) {
  try {
    await prisma.message.deleteMany({
      where: { chatId },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete messages" };
  }
}
