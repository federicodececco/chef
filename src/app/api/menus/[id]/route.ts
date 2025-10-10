import { NextRequest, NextResponse } from "next/server";
import { getMenu, deleteMenu } from "@/actions/menu";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getMenu(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: menuId } = await params;
    const { dishId } = await request.json();

    if (!dishId) {
      return NextResponse.json(
        { error: "dishId is required" },
        { status: 400 },
      );
    }

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: menuId } = await params;
    const body = await request.json();

    if ("dishIds" in body) {
      const { dishIds } = body;

      if (!Array.isArray(dishIds)) {
        return NextResponse.json(
          { error: "dishIds must be an array" },
          { status: 400 },
        );
      }

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

      return NextResponse.json(menu);
    }

    const updateData: {
      name?: string;
      price?: number;
      maxPeople?: number;
    } = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.maxPeople !== undefined) updateData.maxPeople = body.maxPeople;

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: updateData,
      include: {
        Dishes: {
          orderBy: {
            listOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update menu" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await deleteMenu(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete menu" },
      { status: 500 },
    );
  }
}
