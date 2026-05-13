import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "") || "/";
  }
  return pathname;
}

export default async function proxy(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("bimos_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let payload: Awaited<ReturnType<typeof verifyToken>> = null;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    console.error("[proxy] verifyToken", e);
    payload = null;
  }

  if (!payload) {
    const login = NextResponse.redirect(new URL("/login", request.url));
    login.cookies.delete("bimos_session");
    return login;
  }

  const response = NextResponse.next();
  response.headers.set("x-user-rol", payload.tipo);
  response.headers.set("x-user-supremo", payload.isSupremo ? "1" : "0");

  if (!payload.isSupremo) {
    const baseRoute = pathname.split("/")[1];

    if (baseRoute === "configuracion") return response;

    const routeToPermission: Record<string, string> = { reglamentos: "docs" };
    const permissionNeeded = routeToPermission[baseRoute] || baseRoute;

    const protectedRoutes = ["dashboard", "proyectos", "tareas", "clientes", "docs", "comunicaciones", "usuarios", "auditoria"];

    if (permissionNeeded && protectedRoutes.includes(permissionNeeded)) {
      const permittedTabs = (payload.permisos || "").split(",").map((s) => s.trim());
      if (!permittedTabs.includes(permissionNeeded)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|wasm)$).*)"],
};
