import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    pendiente: true,
    mensaje: "Webhook de Telegram pendiente de implementacion.",
    recibido: body,
    // En esta ruta se conectara posteriormente la lectura del payload enviado por Telegram.
    // Desde aqui se podra validar el update y redirigir la informacion hacia createDenuncia().
    nota: "Aqui se conectara en el futuro la logica que transformara mensajes del bot en denuncias para VozSegura.",
  });
}
