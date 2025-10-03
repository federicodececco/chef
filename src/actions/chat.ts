"use server";

import { prisma } from "@/lib/prisma";

export async function createChat(data: { chefId: string; userId: string }) {
  try {
    const chat = await prisma.chat.create({
      data,
    });
    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: "Failed to create chat" };
  }
}

export async function deleteChat(id: string) {
  try {
    await prisma.chat.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete chat" };
  }
}

export async function getChat(id: string) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        Messages: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: "Failed to fetch chat" };
  }
}

export async function getChatByUsers(chefId: string, userId: string) {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        chefId,
        userId,
      },
      include: {
        Messages: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: "Failed to fetch chat" };
  }
}

export async function getChatsByChef(chefId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: { chefId },
      include: {
        Messages: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });
    return { success: true, data: chats };
  } catch (error) {
    return { success: false, error: "Failed to fetch chats" };
  }
}

export async function getChatsByUser(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      include: {
        Messages: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });
    return { success: true, data: chats };
  } catch (error) {
    return { success: false, error: "Failed to fetch chats" };
  }
}

export async function getOrCreateChat(chefId: string, userId: string) {
  try {
    let chat = await prisma.chat.findFirst({
      where: {
        chefId,
        userId,
      },
      include: {
        Messages: {
          orderBy: {
            id: "asc",
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
          Messages: true,
        },
      });
    }

    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: "Failed to get or create chat" };
  }
}
