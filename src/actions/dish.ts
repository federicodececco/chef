"use server";

import { prisma } from "@/lib/prisma";

export async function createDish(data: {
  name: string;
  course: string;
  listOrder: number;
  menuId: string;
  chefId: string;
  categoryIds?: string[];
}) {
  try {
    const { categoryIds, ...dishData } = data;

    const dish = await prisma.dish.create({
      data: {
        ...dishData,
        Categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        Categories: true,
      },
    });

    return { success: true, data: dish };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create dish" };
  }
}

export async function updateDish(
  id: string,
  data: {
    name?: string;
    course?: string;
    listOrder?: number;
    categoryIds?: string[];
  },
) {
  try {
    const { categoryIds, ...dishData } = data;

    const dish = await prisma.dish.update({
      where: { id },
      data: {
        ...dishData,
        Categories: categoryIds
          ? {
              set: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        Categories: true,
      },
    });

    return { success: true, data: dish };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update dish" };
  }
}

export async function deleteDish(id: string) {
  try {
    await prisma.dish.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete dish" };
  }
}

export async function getDish(id: string) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        Categories: true,
        chef: {
          include: {
            user: true,
          },
        },
        Menus: true,
      },
    });
    return { success: true, data: dish };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch dish" };
  }
}

export async function getDishesByMenu(menuId: string) {
  try {
    const dishes = await prisma.dish.findMany({
      where: {
        Menus: {
          some: {
            id: menuId,
          },
        },
      },
      include: {
        Categories: true,
      },
      orderBy: {
        listOrder: "asc",
      },
    });
    return { success: true, data: dishes };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch dishes" };
  }
}

export async function getDishesByChef(chefId: string) {
  try {
    const dishes = await prisma.dish.findMany({
      where: { chefId },
      include: {
        Categories: true,
        Menus: true,
      },
      orderBy: {
        listOrder: "asc",
      },
    });
    return { success: true, data: dishes };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch dishes" };
  }
}

export async function reorderDishes(
  dishUpdates: { id: string; listOrder: number }[],
) {
  try {
    await prisma.$transaction(
      dishUpdates.map(({ id, listOrder }) =>
        prisma.dish.update({
          where: { id },
          data: { listOrder },
        }),
      ),
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to reorder dishes" };
  }
}
