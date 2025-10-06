import { NextRequest, NextResponse } from "next/server";
import { getOrCreateChat } from "@/actions/chat";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }
    const userId = user.userId;

    const body = await req.json();
    const { chefId } = body;

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
