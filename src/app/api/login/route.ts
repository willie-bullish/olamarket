import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail en wachtwoord zijn verplicht" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Ongeldige e-mail of wachtwoord" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Ongeldige e-mail of wachtwoord" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Inloggen succesvol",
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden tijdens het inloggen" },
      { status: 500 }
    );
  }
}