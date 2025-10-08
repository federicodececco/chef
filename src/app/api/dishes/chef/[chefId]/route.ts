import { NextRequest, NextResponse } from "next/server";
import { getDishesByChef } from "@/actions/dish";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chefId: string }> },
) {
  try {
    const { chefId } = await params;
    const result = await getDishesByChef(chefId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 },
    );
  }
}
