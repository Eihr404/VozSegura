// src/app/dashboard/page.tsx
import { obtenerSesion } from "@/lib/auth";
import { getDashboardStats } from "@/services/denuncias.service";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/");

  // superadmin sin institución: usar la demo por ahora
  const institucionId =
    sesion.institucion_id ?? "00000000-0000-0000-0000-000000000001";

  let stats;
  try {
    stats = await getDashboardStats(institucionId);
  } catch (e) {
    console.error(e);
    stats = {
      totales: { total: 0, nuevas: 0, en_revision: 0, en_intervencion: 0, cerradas: 0, formales: 0, desahogos: 0, criticas: 0 },
      porCategoria: [],
      recientes: [],
    };
  }

  return <DashboardClient sesion={sesion} stats={stats} />;
}