"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardCard } from "@/components/DashboardCard";
import { DenunciasCharts } from "@/components/DenunciasCharts";
import { DenunciasTable } from "@/components/DenunciasTable";
import { normalizarTexto } from "@/lib/utils";
import type { DashboardStats, Denuncia } from "@/types/denuncia";
import type { SesionUsuario } from "@/types/usuario";

type DashboardClientProps = {
  usuario: SesionUsuario;
  denuncias: Denuncia[];
  stats: DashboardStats;
};

export function DashboardClient({ usuario, denuncias, stats }: DashboardClientProps) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const tiposDisponibles = Array.from(new Set(denuncias.map((item) => item.tipo))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  const busquedaNormalizada = normalizarTexto(busqueda);

  const denunciasFiltradas = denuncias.filter((denuncia) => {
    const coincideDescripcion = normalizarTexto(denuncia.descripcion).includes(
      busquedaNormalizada,
    );
    const coincideTipo = tipo === "todos" ? true : denuncia.tipo === tipo;
    return coincideDescripcion && coincideTipo;
  });

  async function cerrarSesion() {
    setCerrandoSesion(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } finally {
      setCerrandoSesion(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,169,113,0.16),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-[#140c2e] px-6 py-6 text-white shadow-2xl shadow-[#140c2e]/25 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Panel protegido</p>
            <h1 className="mt-2 text-3xl font-semibold">VozSegura</h1>
            <p className="mt-2 text-sm text-slate-300">
              Bienvenido, {usuario.usuario}. Visualiza y supervisa las denuncias anonimas del colegio.
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            disabled={cerrandoSesion}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cerrandoSesion ? "Cerrando..." : "Cerrar sesion"}
          </button>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard
            titulo="Total de denuncias"
            valor={stats.totalDenuncias}
            descripcion="Cantidad acumulada registrada en la plataforma."
          />
          <DashboardCard
            titulo="Denuncias del dia"
            valor={stats.denunciasHoy}
            descripcion="Registros con fecha correspondiente al dia actual."
          />
          <DashboardCard
            titulo="Tipo mas frecuente"
            valor={stats.tipoMasFrecuente}
            descripcion="Categoria que concentra el mayor numero de reportes."
          />
        </section>

        <section className="mt-8">
          <DenunciasCharts stats={stats} />
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Denuncias recientes</h2>
              <p className="mt-2 text-sm text-slate-500">
                Usa los filtros para revisar reportes por descripcion o categoria.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="busqueda">
                  Buscar en descripcion
                </label>
                <input
                  id="busqueda"
                  type="text"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Ej. recreo, aula, acoso"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="tipo">
                  Filtrar por tipo
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(event) => setTipo(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="todos">Todos</option>
                  {tiposDisponibles.map((tipoDisponible) => (
                    <option key={tipoDisponible} value={tipoDisponible}>
                      {tipoDisponible}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <DenunciasTable denuncias={denunciasFiltradas} />
          </div>
        </section>
      </div>
    </div>
  );
}
