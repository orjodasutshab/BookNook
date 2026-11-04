import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(req: NextRequest) {
  const cookie = getSessionCookie(req);
  if (!cookie) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/add-book", "/my-books", "/my-borrows", "/profile", "/books/:id"],
};
