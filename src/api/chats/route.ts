import { NextRequest, NextResponse } from "next/server";
import { getOrCreateChat } from "@/actions/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chefId, userId } = body;

    if (!chefId || !userId) {
      return NextResponse.json(
        { error: "chefId and userId are required" },
        { status: 400 },
      );
    }

    const result = await getOrCreateChat(chefId, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get or create chat" },
      { status: 500 },
    );
  }
}
