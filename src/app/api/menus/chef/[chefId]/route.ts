import { NextRequest, NextResponse } from "next/server";
import { getMenusByChef } from "@/actions/menu";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chefId: string }> },
) {
  try {
    const { chefId } = await params;
    const result = await getMenusByChef(chefId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 },
    );
  }
}
