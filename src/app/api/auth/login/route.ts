// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { crearToken, cookieConfig } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
  }

  const sql = getSql();
  const [usuario] = await sql`
    SELECT u.id, u.email, u.nombre_completo, u.password_hash, u.rol,
           u.activo, u.bloqueado_hasta, u.intentos_fallidos,
           u.institucion_id, i.nombre AS institucion_nombre
    FROM   usuarios_dashboard u
    LEFT JOIN instituciones i ON u.institucion_id = i.id
    WHERE  u.email = ${email.toLowerCase().trim()}
    LIMIT  1
  `;

  if (!usuario || !usuario.activo) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // Verificar bloqueo por intentos fallidos
  if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
    return NextResponse.json({ error: "Cuenta bloqueada temporalmente" }, { status: 403 });
  }

  const passwordOk = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordOk) {
    const intentos = usuario.intentos_fallidos + 1;
    const bloqueo = intentos >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    await sql`
      UPDATE usuarios_dashboard
      SET intentos_fallidos = ${intentos},
          bloqueado_hasta   = ${bloqueo}
      WHERE id = ${usuario.id}
    `;
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // Reset intentos y actualizar último acceso
  await sql`
    UPDATE usuarios_dashboard
    SET intentos_fallidos = 0,
        bloqueado_hasta   = NULL,
        ultimo_acceso     = now()
    WHERE id = ${usuario.id}
  `;

  const token = await crearToken({
    id:                 usuario.id,
    email:              usuario.email,
    nombre_completo:    usuario.nombre_completo,
    rol:                usuario.rol,
    institucion_id:     usuario.institucion_id,
    institucion_nombre: usuario.institucion_nombre,
  });

  const response = NextResponse.json({
    ok: true,
    usuario: {
      nombre_completo:    usuario.nombre_completo,
      rol:                usuario.rol,
      institucion_nombre: usuario.institucion_nombre,
    },
  });

  response.cookies.set(cookieConfig(token));
  return response;
}