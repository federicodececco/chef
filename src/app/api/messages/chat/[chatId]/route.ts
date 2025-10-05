import { NextRequest, NextResponse } from "next/server";
import { getMessagesByChat, deleteMessagesByChat } from "@/actions/message";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const result = await getMessagesByChat(params.chatId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const result = await deleteMessagesByChat(params.chatId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: "All messages deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete messages" },
      { status: 500 },
    );
  }
}
