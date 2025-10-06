"use server";
import { prisma } from "@/lib/prisma";

export async function createChef(data: {
  id: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  nation?: string;
  slug?: string;
}) {
  try {
    const chef = await prisma.chef.create({
      data,
    });
    return { success: true, data: chef };
  } catch (error) {
    return { success: false, error: "Failed to create chef" };
  }
}

export async function updateChef(
  id: string,
  data: {
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    phoneNumber?: string;
    nation?: string;
    slug?: string;
  },
) {
  try {
    const chef = await prisma.chef.update({
      where: { id },
      data,
    });
    return { success: true, data: chef };
  } catch (error) {
    return { success: false, error: "Failed to update chef" };
  }
}
export async function deleteChef(id: string) {
  try {
    await prisma.chef.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete chef" };
  }
}

export async function getChef(id: string) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        user: true,
        Menus: { include: { Dishes: true } },
        Photos: true,
        Facts: true,
        Review: true,
      },
    });
    return { success: true, data: chef };
  } catch (error) {
    return { success: false, error: "Failed to fetch chef" };
  }
}

export async function getChefBySlug(slug: string) {
  try {
    const chef = await prisma.chef.findFirst({
      where: { slug },
      include: {
        user: true,
        Menus: {
          include: {
            Dishes: {
              include: {
                categories: true,
              },
            },
          },
        },
        Photos: true,
      },
    });
    return { success: true, data: chef };
  } catch (error) {
    return { success: false, error: "Failed to fetch chef" };
  }
}

export async function getAllChefs() {
  try {
    const chefs = await prisma.chef.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: chefs };
  } catch (error) {
    return { success: false, error: "Failed to fetch chefs" };
  }
}
