import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, createOtp, verifyOtp } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, otp, step } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    if (step === 1) {
      const generatedOtp = await createOtp(email, name, password);
      
      return NextResponse.json({
        message: "OTP sent to your email",
        otp: generatedOtp,
        hint: "For demo: OTP is displayed in server logs"
      });
    }

    if (step === 2) {
      if (!otp) {
        return NextResponse.json(
          { error: "OTP is required" },
          { status: 400 }
        );
      }

      const isValid = await verifyOtp(email, otp);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      const user = await createUser(email, password, name);
      if (!user) {
        return NextResponse.json(
          { error: "Failed to create account" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Account created successfully",
        user: { id: user.id, email: user.email, name: user.name }
      });
    }

    return NextResponse.json(
      { error: "Invalid step" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden tijdens de registratie" },
      { status: 500 }
    );
  }
}