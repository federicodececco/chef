import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: menuId } = await params;
    const { dishId } = await request.json();

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        Dishes: {
          connect: { id: dishId },
        },
      },
      include: {
        Dishes: true,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add dish to menu" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: menuId } = await params;
    const { dishIds } = await request.json();

    await prisma.menu.update({
      where: { id: menuId },
      data: {
        Dishes: {
          set: [],
        },
      },
    });

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        Dishes: {
          connect: dishIds.map((id: string) => ({ id })),
        },
      },
      include: {
        Dishes: true,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to reorder dishes" },
      { status: 500 },
    );
  }
}
