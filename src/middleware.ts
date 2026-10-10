import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

/** Gate for /admin/*: a valid session cookie (set by the login page) or a redirect to /admin/login. */
export async function middleware(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) return new NextResponse("ADMIN_PASSWORD is not set.", { status: 503 });

  const { pathname } = req.nextUrl;
  const signedIn = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return signedIn ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (signedIn) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*"] };
