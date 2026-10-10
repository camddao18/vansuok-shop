import { NextResponse, type NextRequest } from "next/server";

/** HTTP Basic auth for /admin. Username `admin`, password from ADMIN_PASSWORD. */
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const deny = (status: number, body: string) =>
    new NextResponse(body, { status, headers: { "WWW-Authenticate": 'Basic realm="Vansuok admin"' } });

  if (!password) return deny(503, "ADMIN_PASSWORD is not set.");

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    const [user, ...rest] = atob(header.slice(6)).split(":");
    if (user === "admin" && rest.join(":") === password) return NextResponse.next();
  }
  return deny(401, "Authentication required.");
}

export const config = { matcher: ["/admin/:path*"] };
