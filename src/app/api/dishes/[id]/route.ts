import { NextRequest, NextResponse } from "next/server";
import { getDish, deleteDish } from "@/actions/dish";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getDish(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dish" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      categoryIds,
      Menus,
      categories,
      id: dishId,
      created_at,
      chefId,
      ...dishData
    } = body;

    const updateData: any = {
      ...dishData,
    };

    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map((categoryId: string) => ({ id: categoryId })),
      };
    }

    const updatedDish = await prisma.dish.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        Menus: true,
        chef: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { error: "Failed to update dish" },
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
    const result = await deleteDish(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete dish" },
      { status: 500 },
    );
  }
}
