"use server";

import { prisma } from "@/lib/prisma";

export async function createMenu(data: {
  chefId: string;
  name: string;
  maxPeople?: number;
}) {
  try {
    const menu = await prisma.menu.create({
      data,
    });

    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create menu" };
  }
}

export async function updateMenu(id: string, data: { name: string }) {
  try {
    const menu = await prisma.menu.update({
      where: { id },
      data,
      include: {
        Dishes: {
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });

    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update menu" };
  }
}

export async function deleteMenu(id: string) {
  try {
    await prisma.menu.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
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
            Categories: true,
          },
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });
    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
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
            Categories: true,
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
    console.error(error);
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
    console.error(error);
    return { success: false, error: "Failed to fetch menus" };
  }
}

export async function addDishToMenu(menuId: string, dishId: string) {
  try {
    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        Dishes: {
          connect: { id: dishId },
        },
      },
      include: {
        Dishes: {
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });

    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to add dish to menu" };
  }
}

export async function removeDishFromMenu(menuId: string, dishId: string) {
  try {
    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        Dishes: {
          disconnect: { id: dishId },
        },
      },
      include: {
        Dishes: {
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });

    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to remove dish from menu" };
  }
}

export async function reorderMenuDishes(menuId: string, dishIds: string[]) {
  try {
    await Promise.all(
      dishIds.map((dishId, index) =>
        prisma.dish.update({
          where: { id: dishId },
          data: { listOrder: index + 1 },
        }),
      ),
    );

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        Dishes: {
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });

    return { success: true, data: menu };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to reorder dishes" };
  }
}
