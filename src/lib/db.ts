// src/lib/db.ts
// Conexión a Nhost PostgreSQL usando postgres.js (ya está en tu proyecto)
// La URL viene de NHOST_DATABASE_URL en .env.local

import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

export function getSql() {
  if (!sql) {
    const url = process.env.NHOST_DATABASE_URL;
    if (!url) throw new Error("NHOST_DATABASE_URL no está definida en .env.local");
    sql = postgres(url, {
      ssl: "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return sql;
}