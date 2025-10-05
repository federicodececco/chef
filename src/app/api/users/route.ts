import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/actions/user";
import { createChef } from "@/actions/chef";

export async function GET() {
  try {
    const result = await getAllUsers();

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
    const { firstname, lastname, email, password } = body;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const result = await createUser({
      firstname,
      lastname,
      email,
      password,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    if (result.data?.id) {
      console.log("erorre");
      const chefResult = await createChef({
        id: result.data.id,
      });
      if (!chefResult.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
