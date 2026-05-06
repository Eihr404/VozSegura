"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-950/5">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          No fue posible cargar la informacion
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {error.message || "Ocurrio un problema inesperado al consultar los datos."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[#140c2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c1240]"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
