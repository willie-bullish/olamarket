import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is admin-related (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for admin authentication in sessionStorage
    // Note: sessionStorage is client-side, so we need to handle this differently
    // For now, we'll let the client-side handle authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
