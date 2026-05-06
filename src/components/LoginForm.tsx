"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "No fue posible iniciar sesion.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Ocurrio un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-[#140c2e]/20">
      <div>
        <label htmlFor="usuario" className="mb-2 block text-sm font-semibold text-slate-700">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          required
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Ingresa tu usuario"
        />
      </div>

      <div>
        <label htmlFor="contrasena" className="mb-2 block text-sm font-semibold text-slate-700">
          Contrasena
        </label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          value={contrasena}
          onChange={(event) => setContrasena(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Ingresa tu contrasena"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-2xl bg-[#140c2e] px-4 py-3 font-semibold text-white transition hover:bg-[#1c1240] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
