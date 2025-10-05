import { NextRequest, NextResponse } from "next/server";
import { getCategoriesWithDishes } from "@/actions/category";

export async function GET() {
  try {
    const result = await getCategoriesWithDishes();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories with dishes" },
      { status: 500 },
    );
  }
}
