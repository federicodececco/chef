import { NextRequest, NextResponse } from "next/server";
import { getChatByUsers } from "@/actions/chat";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chefId = searchParams.get("chefId");
    const userId = searchParams.get("userId");

    if (!chefId || !userId) {
      return NextResponse.json(
        { error: "chefId and userId are required" },
        { status: 400 },
      );
    }

    const result = await getChatByUsers(chefId, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 },
    );
  }
}
