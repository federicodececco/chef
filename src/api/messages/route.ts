import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/actions/message";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createMessage(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
