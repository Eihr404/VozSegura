"use client";
// src/components/DashboardClient.tsx
import { useRouter } from "next/navigation";
import type { DashboardStats } from "@/services/denuncias.service";

const PRIORIDAD_COLOR: Record<number, string> = {
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-yellow-100 text-yellow-700 border-yellow-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-slate-100 text-slate-500 border-slate-200",
};

const PRIORIDAD_LABEL: Record<number, string> = {
  1: "Crítica", 2: "Alta", 3: "Media", 4: "Baja", 5: "Desahogo",
};

const ESTADO_COLOR: Record<string, string> = {
  nueva:           "bg-red-50 text-red-600",
  en_revision:     "bg-yellow-50 text-yellow-700",
  en_intervencion: "bg-blue-50 text-blue-700",
  cerrada:         "bg-green-50 text-green-700",
  descartada:      "bg-slate-50 text-slate-500",
};

interface SesionUsuario {
  id: string;
  email: string;
  nombre_completo: string;
  rol: string;
  institucion_id: string | null;
  institucion_nombre?: string;
}

interface Props {
  sesion: SesionUsuario;
  stats: DashboardStats;
}

export default function DashboardClient({ sesion, stats }: Props) {
  const router = useRouter();
  const { totales, porCategoria, recientes } = stats;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const cards = [
    { label: "Total",          value: totales.total,          color: "border-l-slate-400" },
    { label: "Nuevas",         value: totales.nuevas,          color: "border-l-red-500" },
    { label: "En revisión",    value: totales.en_revision,     color: "border-l-yellow-500" },
    { label: "Intervención",   value: totales.en_intervencion, color: "border-l-blue-500" },
    { label: "Cerradas",       value: totales.cerradas,        color: "border-l-green-500" },
    { label: "Críticas",       value: totales.criticas,        color: "border-l-red-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">VozSegura</h1>
          <p className="text-xs text-slate-500">{sesion.institucion_nombre ?? "Panel general"}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{sesion.nombre_completo}</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{sesion.rol}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Salir</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Resumen</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((c) => (
              <div key={c.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.color} p-4`}>
                <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                <p className="text-xs text-slate-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Recientes</h2>
              <button onClick={() => router.push("/dashboard/denuncias")} className="text-xs text-blue-600 hover:underline">Ver todas →</button>
            </div>
            <div className="space-y-3">
              {recientes.length === 0 && (
                <p className="text-sm text-slate-400 bg-white rounded-xl border border-slate-200 p-6 text-center">Sin denuncias aún</p>
              )}
              {recientes.map((d) => (
                <div key={d.id} onClick={() => router.push(`/dashboard/denuncias/${d.id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORIDAD_COLOR[d.prioridad] ?? ""}`}>
                      {PRIORIDAD_LABEL[d.prioridad] ?? d.prioridad}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[d.estado] ?? ""}`}>
                      {d.estado.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{d.categoria}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(d.fecha_creacion).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}{d.tipo === "formal" ? "Formal" : "Desahogo"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Por categoría</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              {porCategoria.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Sin datos aún</p>
              )}
              {porCategoria.map((c) => {
                const max = Number(porCategoria[0]?.total ?? 1);
                const pct = Math.round((Number(c.total) / max) * 100);
                return (
                  <div key={c.categoria}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{c.categoria}</span>
                      <span className="font-medium">{c.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Módulos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Denuncias",   href: "/dashboard/denuncias",  emoji: "📋" },
              { label: "Implicados",  href: "/dashboard/implicados", emoji: "👤" },
              { label: "Acciones",    href: "/dashboard/acciones",   emoji: "✅" },
              { label: "Análisis IA", href: "/dashboard/ia",         emoji: "🤖" },
            ].map((m) => (
              <button key={m.href} onClick={() => router.push(m.href)}
                className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all">
                <span className="text-2xl">{m.emoji}</span>
                <p className="text-sm font-medium text-slate-700 mt-2">{m.label}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}