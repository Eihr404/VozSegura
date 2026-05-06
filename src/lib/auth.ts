import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

import type { SesionUsuario } from "@/types/usuario";

const SESSION_COOKIE = "vozsegura_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET no esta configurado.");
  }

  return new TextEncoder().encode(secret);
}

export async function compararContrasena(
  contrasenaIngresada: string,
  hashGuardado: string,
): Promise<boolean> {
  return bcrypt.compare(contrasenaIngresada, hashGuardado);
}

export async function crearTokenSesion(usuario: SesionUsuario): Promise<string> {
  return new SignJWT({
    sub: String(usuario.id),
    usuario: usuario.usuario,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function guardarSesionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function eliminarSesionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function obtenerSesion(): Promise<SesionUsuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const usuario = payload.usuario;
    const sub = payload.sub;

    if (typeof usuario !== "string" || typeof sub !== "string") {
      return null;
    }

    return {
      id: Number(sub),
      usuario,
    };
  } catch {
    return null;
  }
}

export const authConfig = {
  sessionCookie: SESSION_COOKIE,
};
