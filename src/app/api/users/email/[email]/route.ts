import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/actions/user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  try {
    const { email } = await params;
    const result = await getUserByEmail(email);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    if (!result.data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
