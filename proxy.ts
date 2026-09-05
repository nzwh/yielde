import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const payload = token ? await verifyToken(token) : null;

  const { pathname } = req.nextUrl;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!isAuthRoute && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
