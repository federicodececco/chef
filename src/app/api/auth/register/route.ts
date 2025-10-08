import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/actions/user";
import { generateToken, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Formato richiesta non valido" },
        { status: 400 },
      );
    }

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

    console.log("Checking if user exists:", email);
    const existingUserResult = await getUserByEmail(email);
    if (existingUserResult.success && existingUserResult.data) {
      return NextResponse.json(
        { error: "Email già registrata" },
        { status: 409 },
      );
    }

    console.log("Creating user:", { firstname, lastname, email });
    const userResult = await createUser({
      firstname,
      lastname,
      email,
      password,
    });

    if (!userResult.success || !userResult.data) {
      console.error("User creation failed:", userResult.error);
      return NextResponse.json(
        {
          error: userResult.error || "Errore durante la creazione dell'utente",
        },
        { status: 500 },
      );
    }

    let chefData = null;
    if (isChef) {
      try {
        console.log("Creating chef profile for user:", userResult.data.id);
        const chef = await prisma.chef.create({
          data: {
            id: userResult.data.id,
            slug: `${firstname.toLowerCase()}-${lastname.toLowerCase()}`.replace(
              /\s+/g,
              "-",
            ),
          },
        });
        chefData = {
          id: chef.id,
          slug: chef.slug,
        };
        console.log("Chef created successfully:", chefData);
      } catch (error: unknown) {
        console.error("Error creating chef:", error);

        await prisma.user.delete({ where: { id: userResult.data.id } });

        const getErrorMessage = (err: unknown): string => {
          if (err instanceof Error) return err.message;
          if (typeof err === "string") return err;
          return "Errore sconosciuto";
        };

        return NextResponse.json(
          {
            error: "Errore durante la creazione del profilo chef",
            details:
              process.env.NODE_ENV === "development"
                ? getErrorMessage(error)
                : undefined,
          },
          { status: 500 },
        );
      }
    }

    console.log("Generating token for user:", userResult.data.id);
    const token = await generateToken({
      userId: userResult.data.id,
      email: userResult.data.email,
      isChef: !!chefData,
    });

    await setAuthCookie(token);

    console.log("Registration successful for:", email);

    return NextResponse.json(
      {
        message: "Registrazione completata con successo",
        user: {
          id: userResult.data.id,
          firstname: userResult.data.firstname,
          lastname: userResult.data.lastname,
          email: userResult.data.email,
          isChef: !!chefData,
          chef: chefData,
        },
        token,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Unexpected registration error:", error);

    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Email già registrata" },
        { status: 409 },
      );
    }

    if (prismaError.code === "P2003") {
      return NextResponse.json(
        { error: "Errore di relazione nel database" },
        { status: 500 },
      );
    }

    if (prismaError.code === "P1001") {
      return NextResponse.json(
        { error: "Impossibile connettersi al database" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Errore durante la registrazione",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
