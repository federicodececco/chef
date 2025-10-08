import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/actions/user";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, password, isChef } = body;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Tutti i campi sono obbligatori" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato email non valido" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La password deve contenere almeno 8 caratteri" },
        { status: 400 },
      );
    }

    const existingUserResult = await getUserByEmail(email);
    if (existingUserResult.success && existingUserResult.data) {
      return NextResponse.json(
        { error: "Email già registrata" },
        { status: 409 },
      );
    }

    const userResult = await createUser({
      firstname,
      lastname,
      email,
      password,
    });

    if (!userResult.success) {
      return NextResponse.json(
        { error: userResult.error || "Errore durante la registrazione" },
        { status: 500 },
      );
    }

    let chefData = null;
    if (isChef && userResult.data) {
      const chef = await prisma.chef.create({
        data: {
          id: userResult.data.id,
          slug: `${firstname.toLowerCase()}-${lastname.toLowerCase()}`,
        },
      });
      chefData = {
        id: chef.id,
        slug: chef.slug,
      };
    }

    const token = await generateToken({
      userId: userResult.data!.id,
      email: userResult.data!.email,
      isChef: !!chefData,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: "Registrazione completata con successo",
        user: {
          ...userResult.data,
          isChef: !!chefData,
          chef: chefData,
        },
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 },
    );
  }
}
