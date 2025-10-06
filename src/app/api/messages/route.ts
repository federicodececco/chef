import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/actions/message";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const isChef = user.isChef;

    const { chatId, text } = await req.json();
    const result = await createMessage({ chatId, text, isChef });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
