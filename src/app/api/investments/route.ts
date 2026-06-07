import { NextRequest, NextResponse } from "next/server";
import { getUserInvestments } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    console.log('📧 Fetching investments for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const investments = await getUserInvestments(email);
    console.log('📊 Found investments:', investments.length);

    return NextResponse.json({ investments });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}