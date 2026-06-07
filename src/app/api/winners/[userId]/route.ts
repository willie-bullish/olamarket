import { NextRequest, NextResponse } from "next/server";
import { getWinners } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const normalizedId = userId.toLowerCase();

    const winners = await getWinners();
    
    const winner = winners.find(w => w.id.toLowerCase() === normalizedId);

    if (!winner) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(winner);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investment" },
      { status: 500 }
    );
  }
}