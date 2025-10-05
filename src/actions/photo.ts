"use server";

import { prisma } from "@/lib/prisma";

export async function createPhoto(data: {
  filename: string;
  path: string;
  size: number;
  width?: number;
  height?: number;
  mimeType: string;
  imageUrl: string;
  chefId: string;
}) {
  try {
    const photo = await prisma.photo.create({
      data,
    });
    return { success: true, data: photo };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to create photo" };
  }
}

export async function createMultiplePhotos(
  photos: {
    filename: string;
    path: string;
    size: number;
    width?: number;
    height?: number;
    mimeType: string;
    imageUrl: string;
    chefId: string;
  }[],
) {
  try {
    const createdPhotos = await prisma.photo.createMany({
      data: photos,
    });

    return { success: true, data: createdPhotos };
  } catch (error) {
    return { success: false, error: "Failed to create photos" };
  }
}

export async function updatePhoto(
  id: string,
  data: {
    imageUrl?: string;
    imageName?: string;
  },
) {
  try {
    const photo = await prisma.photo.update({
      where: { id },
      data,
    });
    return { success: true, data: photo };
  } catch (error) {
    return { success: false, error: "Failed to update photo" };
  }
}

export async function deletePhoto(id: string) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    await prisma.photo.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete photo" };
  }
}

export async function getPhoto(id: string) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        chef: {
          include: {
            user: true,
          },
        },
      },
    });
    return { success: true, data: photo };
  } catch (error) {
    return { success: false, error: "Failed to fetch photo" };
  }
}

export async function getPhotosByChef(chefId: string) {
  try {
    const photos = await prisma.photo.findMany({
      where: { chefId },
      orderBy: {
        created_at: "desc",
      },
    });
    return { success: true, data: photos };
  } catch (error) {
    return { success: false, error: "Failed to fetch photos" };
  }
}

export async function getAllPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        chef: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return { success: true, data: photos };
  } catch (error) {
    return { success: false, error: "Failed to fetch photos" };
  }
}
