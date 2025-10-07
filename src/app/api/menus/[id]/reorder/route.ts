import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dishes } = body;

    if (!Array.isArray(dishes)) {
      return NextResponse.json(
        { error: "dishes deve essere un array" },
        { status: 400 },
      );
    }

    const menu = await prisma.menu.findUnique({
      where: { id: id },
    });

    if (!menu) {
      return NextResponse.json({ error: "Menu non trovato" }, { status: 404 });
    }

    await prisma.$transaction(
      dishes.map((dish: { id: string; listOrder: number }) =>
        prisma.dish.update({
          where: { id: dish.id },
          data: { listOrder: dish.listOrder },
        }),
      ),
    );

    const updatedDishes = await prisma.dish.findMany({
      where: {
        Menus: {
          some: {
            id: id,
          },
        },
      },
      orderBy: {
        listOrder: "asc",
      },
      include: {
        Menus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Ordine dei piatti aggiornato con successo",
      dishes: updatedDishes,
    });
  } catch (error) {
    console.error("Errore nel riordino dei piatti:", error);
    return NextResponse.json(
      { error: "Errore nel riordino dei piatti" },
      { status: 500 },
    );
  }
}
