import { NextRequest, NextResponse } from "next/server";
import { reorderDishes } from "@/actions/dish";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await reorderDishes(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Dishes reordered successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to reorder dishes" },
      { status: 500 },
    );
  }
}
