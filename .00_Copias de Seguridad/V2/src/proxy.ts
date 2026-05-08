import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

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
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protección adicional para la ruta /usuarios
  if (pathname.startsWith("/usuarios") && payload.rol !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Clonar la petición y agregar headers si se necesitan
  const response = NextResponse.next();
  response.headers.set("x-user-rol", payload.rol);
  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
