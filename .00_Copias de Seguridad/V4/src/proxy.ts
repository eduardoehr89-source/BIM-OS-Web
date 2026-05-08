import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar assets y rutas estáticas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("bimos_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const login = NextResponse.redirect(new URL("/login", request.url));
    login.cookies.delete("bimos_session");
    return login;
  }

  const response = NextResponse.next();
  response.headers.set("x-user-rol", payload.tipo);
  response.headers.set("x-user-supremo", payload.isSupremo ? "1" : "0");

  // JERARQUÍA: El Admin Supremo tiene paso libre total.
  if (!payload.isSupremo) {
    const baseRoute = pathname.split("/")[1];
    
    // /configuracion siempre accesible para todos los autenticados
    if (baseRoute === "configuracion") return response;

    // Mapeo especial reglamentos -> docs
    const routeToPermission: Record<string, string> = { reglamentos: "docs" };
    const permissionNeeded = routeToPermission[baseRoute] || baseRoute;
    
    const protectedRoutes = ["dashboard", "proyectos", "tareas", "clientes", "docs", "comunicaciones", "usuarios", "auditoria"];
    
    if (permissionNeeded && protectedRoutes.includes(permissionNeeded)) {
      const permittedTabs = (payload.permisos || "").split(",").map(s => s.trim());
      if (!permittedTabs.includes(permissionNeeded)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
