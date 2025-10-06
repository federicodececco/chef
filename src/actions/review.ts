"use server";

import { prisma } from "@/lib/prisma";

export async function createReview(data: {
  chefId: string;
  userId: string;
  rating: number;
  text: string;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        chefId: data.chefId,
        userId: data.userId,
        rating: data.rating,
        text: data.text,
      },
    });
    return { succes: true, data: review };
  } catch (error) {
    return { success: false, error: "Error creating review" };
  }
}

export async function geteReviewsByChefId(chefId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { chefId: chefId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: "Error fetching reviews" };
  }
}
export async function geteReviewsByUserId(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: "Error fetching reviews" };
  }
}
