import { NextRequest, NextResponse } from "next/server";
import { createChef, getAllChefs } from "@/actions/chef";

export async function GET() {
  try {
    const result = await getAllChefs({ limit: 7 });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, bio, avatarUrl, phoneNumber, nation, slug } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Chef ID is required" },
        { status: 400 },
      );
    }

    const result = await createChef({
      id,
      bio,
      avatarUrl,
      phoneNumber,
      nation,
      slug,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
