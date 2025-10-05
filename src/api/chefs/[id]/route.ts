import { NextRequest, NextResponse } from "next/server";
import { getChef, updateChef, deleteChef } from "@/actions/chef";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await getChef(params.id);

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    const { bio, avatarUrl, phoneNumber, nation, slug } = body;

    const result = await updateChef(params.id, {
      bio,
      avatarUrl,
      phoneNumber,
      nation,
      slug,
    });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await deleteChef(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Chef deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
