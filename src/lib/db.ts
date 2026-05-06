import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __vozseguraSql: ReturnType<typeof postgres> | undefined;
}

export function getSql() {
  if (global.__vozseguraSql) {
    return global.__vozseguraSql;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL no esta configurada.");
  }

  const sql = postgres(connectionString, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  if (process.env.NODE_ENV !== "production") {
    global.__vozseguraSql = sql;
  }

  return sql;
}
