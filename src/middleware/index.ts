// src/middleware/index.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verificarToken } from "@/lib/auth";

const RUTAS_PUBLICAS = ["/", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar rutas públicas y assets
  if (
    RUTAS_PUBLICAS.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/telegram")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("vozsegura_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const sesion = await verificarToken(token);

  if (!sesion) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("vozsegura_session");
    return response;
  }

  // Pasar datos del usuario en headers para los Route Handlers
  const headers = new Headers(request.headers);
  headers.set("x-user-id", sesion.id);
  headers.set("x-user-rol", sesion.rol);
  headers.set("x-institucion-id", sesion.institucion_id ?? "");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/denuncias/:path*", "/api/implicados/:path*", "/api/acciones/:path*", "/api/ia/:path*"],
};