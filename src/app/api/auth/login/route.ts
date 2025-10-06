import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, verifyPassword, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatori" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { chef: true },
    });

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 },
      );
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      isChef: !!user.chef,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isChef: !!user.chef,
        chef: user.chef
          ? {
              id: user.chef.id,
              slug: user.chef.slug,
              bio: user.chef.bio,
              avatarUrl: user.chef.avatarUrl,
            }
          : null,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Errore durante il login" },
      { status: 500 },
    );
  }
}
