import { NextRequest, NextResponse } from "next/server";
import { getInvestmentById } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const investment = await getInvestmentById(userId);

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error("Error fetching investment:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment" },
      { status: 500 }
    );
  }
}