import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chefId = searchParams.get("chefId");

    const facts = await prisma.facts.findMany({
      where: chefId ? { chefId } : {},
      include: {
        chef: {
          select: {
            id: true,
            slug: true,
            bioBrief: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(facts);
  } catch (error) {
    console.error("Error fetching facts:", error);
    return NextResponse.json({ error: "Error creating fact" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { short, long, chefId } = body;

    if (!short || !long || !chefId) {
      return NextResponse.json(
        { error: "Missing mandatory fields" },
        { status: 400 },
      );
    }

    const fact = await prisma.facts.create({
      data: {
        short,
        long,
        chefId,
      },
      include: {
        chef: true,
      },
    });

    return NextResponse.json(fact, { status: 201 });
  } catch (error) {
    console.error("Error creating fact:", error);
    return NextResponse.json({ error: "Error creating fact" }, { status: 500 });
  }
}
