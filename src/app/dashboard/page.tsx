// src/app/dashboard/page.tsx
import { obtenerSesion } from "@/lib/auth";
import { getDashboardStats } from "@/services/denuncias.service";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/");

  const institucionId =
    sesion.institucion_id ?? "00000000-0000-0000-0000-000000000001";

  const stats = await getDashboardStats(institucionId).catch(() => ({
    totales: {
      total: 0, nuevas: 0, en_revision: 0, en_intervencion: 0,
      cerradas: 0, formales: 0, desahogos: 0, criticas: 0,
    },
    porCategoria: [],
    recientes:    [],
  }));

  return <DashboardClient sesion={sesion} stats={stats} />;
}