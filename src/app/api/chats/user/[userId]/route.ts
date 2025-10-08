import { NextRequest, NextResponse } from "next/server";
import { getChatsByUser } from "@/actions/chat";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const result = await getChatsByUser(userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  }
}
