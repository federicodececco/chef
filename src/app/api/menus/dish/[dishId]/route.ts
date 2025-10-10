import { getDish } from "@/actions/dish";
import { createMenu } from "@/actions/menu";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dishId: string }> },
) {
  try {
    const { dishId } = await params;
    const dishRes = await getDish(dishId);
    if (!dishRes.success) {
      return NextResponse.json({ error: dishRes.error }, { status: 404 });
    }

    const body = await req.json();
    const menuRes = await createMenu(body);
    if (!menuRes.success) {
      return NextResponse.json({ error: menuRes.error }, { status: 400 });
    }

    if (!menuRes.data) {
      return NextResponse.json({ error: menuRes.error }, { status: 400 });
    }
    const updatedMenu = await prisma.menu.update({
      where: { id: menuRes.data.id },
      data: {
        Dishes: {
          connect: { id: dishId },
        },
      },
      include: {
        Dishes: true,
      },
    });
    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create menu" },
      { status: 500 },
    );
  }
}
