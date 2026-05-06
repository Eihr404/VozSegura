import { NextResponse } from "next/server";

import { obtenerSesion } from "@/lib/auth";
import { createDenuncia, getDenuncias } from "@/services/denuncias.service";

export async function GET() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const denuncias = await getDenuncias();
    return NextResponse.json(denuncias);
  } catch {
    return NextResponse.json(
      { error: "No fue posible obtener las denuncias." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tipo?: string;
      descripcion?: string;
    };

    const tipo = body.tipo?.trim();
    const descripcion = body.descripcion?.trim();

    if (!tipo || !descripcion) {
      return NextResponse.json(
        { error: "Tipo y descripcion son obligatorios." },
        { status: 400 },
      );
    }

    const denuncia = await createDenuncia({ tipo, descripcion });
    return NextResponse.json(denuncia, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No fue posible registrar la denuncia." },
      { status: 500 },
    );
  }
}
