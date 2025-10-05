import { NextRequest, NextResponse } from "next/server";
import { getChefBySlug } from "@/actions/chef";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const result = await getChefBySlug(params.slug);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    if (!result.data) {
      return NextResponse.json({ error: "Chef not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
