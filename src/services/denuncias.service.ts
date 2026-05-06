import { getSql } from "@/lib/db";
import type { DashboardStats, Denuncia } from "@/types/denuncia";

type ConteoTipo = {
  tipo: string;
  total: string | number;
};

type ConteoFecha = {
  fecha: string | Date;
  total: string | number;
};

export async function getDenuncias(): Promise<Denuncia[]> {
  try {
    const sql = getSql();
    const rows = await sql<Denuncia[]>`
      SELECT id, usuario_id, fecha::text AS fecha, tipo, descripcion
      FROM denuncia
      ORDER BY fecha DESC, id DESC
    `;

    return rows;
  } catch {
    throw new Error("No fue posible consultar las denuncias.");
  }
}

export async function createDenuncia(input: {
  tipo: string;
  descripcion: string;
}): Promise<Denuncia> {
  try {
    const sql = getSql();
    const [denuncia] = await sql<Denuncia[]>`
      INSERT INTO denuncia (usuario_id, tipo, descripcion)
      VALUES (1, ${input.tipo}, ${input.descripcion})
      RETURNING id, usuario_id, fecha::text AS fecha, tipo, descripcion
    `;

    return denuncia;
  } catch {
    throw new Error("No fue posible registrar la denuncia.");
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const sql = getSql();
    const [totalRow, hoyRow, tipoMasFrecuenteRow, tiposRows, fechasRows] =
      await Promise.all([
        sql<Array<{ total: string | number }>>`
          SELECT COUNT(*)::int AS total
          FROM denuncia
        `,
        sql<Array<{ total: string | number }>>`
          SELECT COUNT(*)::int AS total
          FROM denuncia
          WHERE fecha = CURRENT_DATE
        `,
        sql<Array<{ tipo: string | null }>>`
          SELECT tipo
          FROM denuncia
          GROUP BY tipo
          ORDER BY COUNT(*) DESC, tipo ASC
          LIMIT 1
        `,
        sql<ConteoTipo[]>`
          SELECT tipo, COUNT(*)::int AS total
          FROM denuncia
          GROUP BY tipo
          ORDER BY total DESC, tipo ASC
        `,
        sql<ConteoFecha[]>`
          SELECT fecha, COUNT(*)::int AS total
          FROM denuncia
          GROUP BY fecha
          ORDER BY fecha ASC
        `,
      ]);

    return {
      totalDenuncias: Number(totalRow[0]?.total ?? 0),
      denunciasHoy: Number(hoyRow[0]?.total ?? 0),
      tipoMasFrecuente: tipoMasFrecuenteRow[0]?.tipo ?? "Sin registros",
      denunciasPorTipo: tiposRows.map((row) => ({
        tipo: row.tipo,
        total: Number(row.total),
      })),
      denunciasPorFecha: fechasRows.map((row) => ({
        fecha:
          typeof row.fecha === "string"
            ? row.fecha
            : row.fecha.toISOString().slice(0, 10),
        total: Number(row.total),
      })),
    };
  } catch {
    throw new Error("No fue posible calcular las metricas del dashboard.");
  }
}
