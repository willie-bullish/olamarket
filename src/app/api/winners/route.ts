import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import {
  getWinners,
  saveWinners,
  type Winner,
} from "@/lib/store";

export async function GET() {
  try {
    const winners = await getWinners();
    return NextResponse.json(winners);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 API Request body:', body);
    const { name, amountWon, investmentType, investmentName, amountToInvest, userId, userName, userEmail, orderItems } = body;

    if (investmentType && investmentName && typeof amountToInvest === "number") {
      console.log('✅ Using investment selection format');
      const winners = await getWinners();

      const winner: Winner = {
        id: crypto.randomUUID(), // Generate unique ID for each investment
        name: investmentName,
        amountWon: Number(amountToInvest),
        investmentType: investmentType,
        userName: userName,
        userEmail: userEmail || '',
        createdAt: new Date().toISOString(),
        claimInfo: undefined,
        orderItems: orderItems,
      };

      console.log('💾 Saving winner:', winner);
      winners.push(winner);
      await saveWinners(winners);

      return NextResponse.json(winner);
    } else if (name && typeof amountWon === "number") {
      console.log('✅ Using legacy format');
      const winners = await getWinners();

      const winner: Winner = {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        amountWon: Number(amountWon),
        createdAt: new Date().toISOString(),
        claimInfo: undefined,
      };

      winners.push(winner);
      await saveWinners(winners);

      return NextResponse.json(winner);
    } else {
      console.log('❌ Invalid request format');
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}