import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/actions/user";
import { createChef } from "@/actions/chef";
import { prisma } from "@/lib/prisma";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";

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
    const { firstname, lastname, email, password, isChef } = body;

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Another account uses this email" },
        { status: 409 },
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
    if (result.data?.id && isChef) {
      const chefSlug = `${result.data.firstname.toLowerCase}-${result.data.lastname.toLowerCase}`;
      const chefResult = await createChef({
        id: result.data.id,
        slug: chefSlug,
      });
    }
    const user = { ...result.data!, isChef: isChef ? true : false };

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      isChef: user.isChef,
    });

    await setAuthCookie(token);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
