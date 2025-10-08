import { getReviewsByUserId } from "@/actions/review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getReviewsByUserId(id);

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
