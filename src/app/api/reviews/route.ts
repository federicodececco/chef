import { createReview } from "@/actions/review";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chefId, userId, rating, text } = body;
    const newRating = parseInt(rating);
    const result = await createReview({
      chefId,
      userId,
      rating: newRating,
      text,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
