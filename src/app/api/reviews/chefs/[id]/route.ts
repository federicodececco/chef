import { getReviewsByChefId } from "@/actions/review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chefId: string } },
) {
  try {
    const result = await getReviewsByChefId(params.chefId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to reviews menus" },
      { status: 500 },
    );
  }
}
