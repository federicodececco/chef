"use server";

import { prisma } from "@/lib/prisma";

export async function createMenu(data: { chefId: string }) {
  try {
    const menu = await prisma.menu.create({
      data,
    });

    return { success: true, data: menu };
  } catch (error) {
    return { success: false, error: "Failed to create menu" };
  }
}

export async function deleteMenu(id: string) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });

    await prisma.menu.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete menu" };
  }
}

export async function getMenu(id: string) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        chef: {
          include: {
            user: true,
          },
        },
        Dishes: {
          include: {
            categories: true,
          },
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });
    return { success: true, data: menu };
  } catch (error) {
    return { success: false, error: "Failed to fetch menu" };
  }
}

export async function getMenusByChef(chefId: string) {
  try {
    const menus = await prisma.menu.findMany({
      where: { chefId },
      include: {
        Dishes: {
          include: {
            categories: true,
          },
          orderBy: {
            listOrder: "asc",
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return { success: true, data: menus };
  } catch (error) {
    return { success: false, error: "Failed to fetch menus" };
  }
}

export async function getAllMenus() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        chef: {
          include: {
            user: true,
          },
        },
        Dishes: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return { success: true, data: menus };
  } catch (error) {
    return { success: false, error: "Failed to fetch menus" };
  }
}
