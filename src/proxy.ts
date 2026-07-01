import { NextResponse, type NextRequest } from "next/server";

/**
 * Protect every /admin route. The proxy only checks the NextAuth session
 * cookie is present — for speed. The admin layout does the real role check.
 */
export function proxy(req: NextRequest) {
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
