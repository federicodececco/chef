import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const fact = await prisma.facts.findUnique({
      where: { id: id },
      include: {
        chef: true,
      },
    });

    if (!fact) {
      return NextResponse.json({ error: "Fact not found" }, { status: 404 });
    }

    return NextResponse.json(fact);
  } catch (error) {
    console.error("Error fetching fact:", error);
    return NextResponse.json({ error: "Error fetching fact" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { short, long } = body;

    const fact = await prisma.facts.update({
      where: { id: id },
      data: {
        ...(short && { short }),
        ...(long && { long }),
      },
      include: {
        chef: true,
      },
    });

    return NextResponse.json(fact);
  } catch (error) {
    console.error("Error updating fact:", error);
    return NextResponse.json({ error: "Error updating fact" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.facts.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Fact succesfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting fact:", error);
    return NextResponse.json({ error: "Error deleting fact" }, { status: 500 });
  }
}
