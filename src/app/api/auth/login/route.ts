import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log(password);
    console.log(email);
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatori" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authData.user.id },
      include: { chef: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 },
      );
    }

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
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Errore durante il login" },
      { status: 500 },
    );
  }
}
