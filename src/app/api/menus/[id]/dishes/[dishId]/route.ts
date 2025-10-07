import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dishId: string }> },
) {
  try {
    const { id: menuId, dishId } = await params;

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

    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add dish to menu" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dishId: string }> },
) {
  try {
    const { id: menuId, dishId } = await params;

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

    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove dish from menu" },
      { status: 500 },
    );
  }
}
