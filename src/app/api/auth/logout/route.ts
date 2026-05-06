import { NextResponse } from "next/server";

import { eliminarSesionCookie } from "@/lib/auth";

export async function POST() {
  await eliminarSesionCookie();

  return NextResponse.json({
    ok: true,
  });
}
