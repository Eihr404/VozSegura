import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/DashboardClient";
import { obtenerSesion } from "@/lib/auth";
import { getDashboardStats, getDenuncias } from "@/services/denuncias.service";

export default async function DashboardPage() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  const [denuncias, stats] = await Promise.all([getDenuncias(), getDashboardStats()]);

  return <DashboardClient usuario={sesion} denuncias={denuncias} stats={stats} />;
}
