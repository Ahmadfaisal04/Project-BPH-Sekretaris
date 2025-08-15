import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If accessing root path, redirect to login
  if (pathname === "/") {
    console.log("Middleware: Redirecting root to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
