import { NextRequest, NextResponse } from "next/server";
import { createDish } from "@/actions/dish";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createDish(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
