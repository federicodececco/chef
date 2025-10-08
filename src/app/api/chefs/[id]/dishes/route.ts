import { getDishesByChef } from "@/actions/dish";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await getDishesByChef(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    if (!result.data) {
      return NextResponse.json({ error: "Chef not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
