// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
interface SesionUsuario {
  id: string;
  email: string;
  nombre_completo: string;
  rol: string;
  institucion_id: string | null;
  institucion_nombre?: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "vozsegura_dev_secret_2024"
);
const COOKIE = "vozsegura_session";

export async function crearToken(payload: SesionUsuario): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verificarToken(token: string): Promise<SesionUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SesionUsuario;
  } catch {
    return null;
  }
}

export async function obtenerSesion(): Promise<SesionUsuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verificarToken(token);
}

export function cookieConfig(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  };
}