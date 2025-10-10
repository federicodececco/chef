"use server";

import { prisma } from "@/lib/prisma";

export async function createCategory(data: { name: string }) {
  try {
    const category = await prisma.category.create({
      data,
    });
    return { success: true, data: category };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
  },
) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return { success: true, data: category };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        Dishes: {
          include: {
            chef: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return { success: true, data: category };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            Dishes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoriesWithDishes() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        Dishes: {
          include: {
            Categories: true,
            chef: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch categories with dishes" };
  }
}
