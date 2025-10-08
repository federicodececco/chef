import { NextRequest, NextResponse } from "next/server";
import { getDishesByMenu } from "@/actions/dish";

export async function GET(
  req: NextRequest,
  { params }: { params: { menuId: string } },
) {
  try {
    const result = await getDishesByMenu(params.menuId);

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
