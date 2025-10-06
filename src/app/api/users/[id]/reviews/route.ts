import { getReviewsByUserId } from "@/actions/review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const result = await getReviewsByUserId(params.userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reviews menus" },
      { status: 500 },
    );
  }
}
