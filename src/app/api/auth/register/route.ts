import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 400 });
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

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname,
          lastname,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json(
        { error: authError.message || "Errore durante la registrazione" },
        { status: 400 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Errore durante la creazione dell'utente" },
        { status: 500 },
      );
    }

    // Create user record in database with Supabase Auth ID
    try {
      const user = await prisma.user.create({
        data: {
          id: authData.user.id,
          firstname,
          lastname,
          email,
          password: "", // Password is managed by Supabase Auth
        },
      });

      let chefData = null;
      if (isChef) {
        try {
          console.log("Creating chef profile for user:", user.id);
          const chef = await prisma.chef.create({
            data: {
              id: user.id,
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

          // Cleanup: delete user from database and Supabase Auth
          await prisma.user.delete({ where: { id: user.id } });
          await supabase.auth.admin.deleteUser(user.id);

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

      console.log("Registration successful for:", email);

      return NextResponse.json(
        {
          message: "Registrazione completata con successo",
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isChef: !!chefData,
            chef: chefData,
          },
        },
        { status: 201 },
      );
    } catch (error: unknown) {
      console.error("Database error:", error);

      // Cleanup: delete from Supabase Auth if database creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);

      const prismaError = error as { code?: string };

      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "Email già registrata" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: "Errore durante la creazione del profilo utente",
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
  } catch (error: unknown) {
    console.error("Unexpected registration error:", error);

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
