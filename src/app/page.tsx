import Link from "next/link";

import { Navbar } from "@/components/Navbar";

const beneficios = [
  "Canal de reporte discreto para la comunidad educativa.",
  "Visualizacion clara de tendencias para tomar decisiones rapidas.",
  "Panel administrativo sencillo y protegido.",
];

const pasos = [
  "La denuncia se registra de forma anonima desde un canal externo, como Telegram.",
  "VozSegura centraliza la informacion en una base de datos PostgreSQL segura.",
  "El equipo administrativo accede a estadisticas y reportes desde un dashboard protegido.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,169,113,0.18),_transparent_32%),linear-gradient(135deg,_#0b0b0f_0%,_#140c2e_55%,_#1b1240_100%)] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
              Seguridad, confianza y tecnologia para colegios
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              VozSegura
            </h1>
            <p className="mt-4 max-w-3xl text-2xl leading-relaxed text-slate-200 md:text-3xl">
              Un canal seguro y anonimo para reportar problemas escolares
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              La plataforma permite que las instituciones educativas visualicen denuncias anonimas
              sobre bullying, acoso y otras situaciones de riesgo con un enfoque claro, privado y
              accionable.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Ingresar al panel
              </Link>
              <a
                href="#que-es"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Conocer mas
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0f172a]/70 p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">
                Vista general del sistema
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-slate-300">Canal anonimo</p>
                  <p className="mt-2 text-2xl font-semibold">24/7</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-slate-300">Dashboard protegido</p>
                  <p className="mt-2 text-2xl font-semibold">JWT + cookies</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-slate-300">Base de datos</p>
                  <p className="mt-2 text-2xl font-semibold">PostgreSQL</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-slate-300">Despliegue</p>
                  <p className="mt-2 text-2xl font-semibold">Vercel Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="que-es" className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">¿Que es VozSegura?</p>
            <h2 className="mt-4 text-3xl font-semibold">Una herramienta digital para actuar con mas rapidez</h2>
          </div>
          <p className="text-base leading-8 text-slate-300">
            VozSegura centraliza reportes anonimos y permite a los equipos directivos observar
            patrones, detectar situaciones recurrentes y responder con informacion organizada, sin
            exponer a quienes reportan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">¿Como funciona?</p>
            <h2 className="mt-4 text-3xl font-semibold">Flujo simple y enfocado</h2>
          </div>
          {pasos.map((paso, index) => (
            <article key={paso} className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-semibold text-emerald-300">Paso {index + 1}</p>
              <p className="mt-4 text-base leading-8 text-slate-300">{paso}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-emerald-500/10 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Beneficios</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {beneficios.map((beneficio) => (
              <article key={beneficio} className="rounded-3xl border border-white/10 bg-[#0b0b0f]/40 p-6">
                <p className="text-base leading-8 text-slate-200">{beneficio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
