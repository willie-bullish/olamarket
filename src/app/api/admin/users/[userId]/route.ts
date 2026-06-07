import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/store";

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.pathname.split("/").pop();
    if (!userId) {
      return NextResponse.json({ error: "Gebruikers-ID vereist" }, { status: 400 });
    }

    const success = await deleteUser(userId);
    if (!success) {
      return NextResponse.json({ error: "Gebruiker verwijderen mislukt" }, { status: 400 });
    }

    return NextResponse.json({ message: "Gebruiker verwijderd" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 });
  }
}