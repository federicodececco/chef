"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function createUser(data: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  try {
    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { ...userWithoutPassword } = user;

    return { success: true, data: userWithoutPassword };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(
  id: string,
  data: {
    firstname?: string;
    lastname?: string;
    email?: string;
  },
) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
        chef: true,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
        chef: true,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch users" };
  }
}
