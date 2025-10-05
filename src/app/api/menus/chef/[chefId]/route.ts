import { NextRequest, NextResponse } from "next/server";
import { getMenusByChef } from "@/actions/menu";

export async function GET(
  req: NextRequest,
  { params }: { params: { chefId: string } },
) {
  try {
    const result = await getMenusByChef(params.chefId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 },
    );
  }
}
