import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/store";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);
    return NextResponse.json(
      { error: "Failed to get users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);
    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user or email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}