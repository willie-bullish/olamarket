import { NextRequest, NextResponse } from "next/server";
import { getPaymentFilesStore } from "../../../../lib/blob-store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key: rawKey } = await params;
    const key = decodeURIComponent(rawKey);
    const store = getPaymentFilesStore();
    const entry = await store.getWithMetadata(key, { type: "arrayBuffer" });

    if (!entry) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType =
      (entry.metadata?.contentType as string | undefined) ||
      "application/octet-stream";

    return new NextResponse(entry.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(entry.data.byteLength),
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
