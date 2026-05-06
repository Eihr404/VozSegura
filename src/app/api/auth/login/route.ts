import { NextResponse } from "next/server";

import { crearTokenSesion, guardarSesionCookie, compararContrasena } from "@/lib/auth";
import { getSql } from "@/lib/db";
import type { Usuario } from "@/types/usuario";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      usuario?: string;
      contrasena?: string;
    };

    const usuarioIngresado = body.usuario?.trim();
    const contrasenaIngresada = body.contrasena?.trim();

    if (!usuarioIngresado || !contrasenaIngresada) {
      return NextResponse.json(
        { error: "Usuario y contrasena son obligatorios." },
        { status: 400 },
      );
    }

    const sql = getSql();
    const [usuario] = await sql<Usuario[]>`
      SELECT id, usuario, contrasena
      FROM usuario
      WHERE usuario = ${usuarioIngresado}
      LIMIT 1
    `;

    if (!usuario) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
    }

    const esValida = await compararContrasena(contrasenaIngresada, usuario.contrasena);

    if (!esValida) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
    }

    const token = await crearTokenSesion({
      id: usuario.id,
      usuario: usuario.usuario,
    });

    await guardarSesionCookie(token);

    return NextResponse.json({
      ok: true,
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "No fue posible iniciar sesion." },
      { status: 500 },
    );
  }
}
