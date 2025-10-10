import { NextRequest, NextResponse } from "next/server";
import { reorderDishes } from "@/actions/dish";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { dishes } = body;

    if (!dishes || !Array.isArray(dishes)) {
      return NextResponse.json(
        { error: "Invalid request: dishes array is required" },
        { status: 400 },
      );
    }

    const result = await reorderDishes(dishes);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Dishes reordered successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to reorder dishes" },
      { status: 500 },
    );
  }
}
