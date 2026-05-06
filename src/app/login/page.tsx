import { redirect } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { Navbar } from "@/components/Navbar";
import { obtenerSesion } from "@/lib/auth";

export default async function LoginPage() {
  const sesion = await obtenerSesion();

  if (sesion) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,169,113,0.14),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)]">
      <Navbar ctaHref="/" ctaLabel="Volver al inicio" />

      <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Acceso administrativo</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Panel seguro para instituciones educativas</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Inicia sesion para revisar denuncias, visualizar metricas y dar seguimiento a los
            reportes anonimos registrados en VozSegura.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
