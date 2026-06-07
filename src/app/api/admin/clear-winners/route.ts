import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { saveWinners } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    // Clear all winners by saving an empty array
    await saveWinners([]);
    
    return NextResponse.json({
      message: "All winners data cleared successfully",
      winnersCount: 0
    });
    
  } catch (error) {
    console.error("Error clearing winners:", error);
    return NextResponse.json(
      { error: "Failed to clear winners data" },
      { status: 500 }
    );
  }
}
