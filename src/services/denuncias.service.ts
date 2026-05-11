// src/services/denuncias.service.ts
import { getSql } from "@/lib/db";

export interface StatsTotales {
  total: number; nuevas: number; en_revision: number;
  en_intervencion: number; cerradas: number;
  formales: number; desahogos: number; criticas: number;
}
export interface CategoriaStats { categoria: string; total: number; }
export interface DenunciaReciente {
  id: string; tipo: string; estado: string; prioridad: number;
  fecha_creacion: string; categoria: string; gravedad_sugerida: string;
}
export interface DashboardStats {
  totales: StatsTotales;
  porCategoria: CategoriaStats[];
  recientes: DenunciaReciente[];
}

export async function getDashboardStats(institucionId: string): Promise<DashboardStats> {
  const sql = getSql();

  const totalesRaw = await sql`
    SELECT
      COUNT(*)::int                                            AS total,
      COUNT(*) FILTER (WHERE estado = 'nueva')::int           AS nuevas,
      COUNT(*) FILTER (WHERE estado = 'en_revision')::int     AS en_revision,
      COUNT(*) FILTER (WHERE estado = 'en_intervencion')::int AS en_intervencion,
      COUNT(*) FILTER (WHERE estado = 'cerrada')::int         AS cerradas,
      COUNT(*) FILTER (WHERE tipo  = 'formal')::int           AS formales,
      COUNT(*) FILTER (WHERE tipo  = 'desahogo')::int         AS desahogos,
      COUNT(*) FILTER (WHERE prioridad = 1)::int              AS criticas
    FROM denuncias
    WHERE institucion_id = ${institucionId}
  `;

  const porCategoriaRaw = await sql`
    SELECT c.nombre AS categoria, COUNT(*)::int AS total
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    WHERE  d.institucion_id = ${institucionId}
    GROUP  BY c.nombre
    ORDER  BY total DESC
    LIMIT  8
  `;

  const recientesRaw = await sql`
    SELECT d.id, d.tipo, d.estado, d.prioridad::int,
           d.fecha_creacion::text,
           c.nombre AS categoria, c.gravedad_sugerida
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    WHERE  d.institucion_id = ${institucionId}
    ORDER  BY d.fecha_creacion DESC
    LIMIT  5
  `;

  return {
    totales:      totalesRaw[0]    as unknown as StatsTotales,
    porCategoria: porCategoriaRaw  as unknown as CategoriaStats[],
    recientes:    recientesRaw     as unknown as DenunciaReciente[],
  };
}

export async function getDenuncias(
  institucionId: string,
  filtros: { estado?: string; tipo?: string } = {}
) {
  const sql = getSql();
  const rows = await sql`
    SELECT d.id, d.tipo, d.estado, d.prioridad::int,
           d.score_confiabilidad::int, d.solicita_seguimiento,
           d.grado_implicado, d.paralelo_implicado,
           d.lugar_incidente, d.recurrencia, d.descripcion_hechos,
           d.fecha_creacion::text, d.fecha_actualizacion::text,
           c.nombre AS categoria, c.gravedad_sugerida,
           u.nombre_completo AS asignada_a_nombre
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    LEFT JOIN usuarios_dashboard u ON d.asignada_a = u.id
    WHERE  d.institucion_id = ${institucionId}
      AND  (${filtros.estado ?? null}::text IS NULL OR d.estado::text = ${filtros.estado ?? null})
      AND  (${filtros.tipo   ?? null}::text IS NULL OR d.tipo::text   = ${filtros.tipo   ?? null})
    ORDER  BY d.prioridad ASC, d.fecha_creacion DESC
    LIMIT  100
  `;
  return rows as unknown as Record<string, unknown>[];
}

export async function getDenunciaById(id: string, institucionId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT d.*, d.prioridad::int, d.score_confiabilidad::int,
           c.nombre AS categoria, c.gravedad_sugerida,
           u.nombre_completo AS asignada_a_nombre
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    LEFT JOIN usuarios_dashboard u ON d.asignada_a = u.id
    WHERE  d.id = ${id} AND d.institucion_id = ${institucionId}
  `;
  if (!rows[0]) return null;

  const historial = await sql`
    SELECT h.*, u.nombre_completo AS usuario_nombre
    FROM   historial_seguimiento h
    LEFT JOIN usuarios_dashboard u ON h.usuario_id = u.id
    WHERE  h.denuncia_id = ${id}
    ORDER  BY h.fecha_registro DESC
  `;

  return { ...(rows[0] as Record<string, unknown>), historial };
}

export async function cambiarEstadoDenuncia(
  id: string, estado: string, usuarioId: string, nota?: string
) {
  const sql = getSql();
  await sql`UPDATE denuncias SET estado = ${estado}, fecha_actualizacion = now() WHERE id = ${id}`;
  await sql`
    INSERT INTO historial_seguimiento (denuncia_id, usuario_id, accion, nota_interna, estado_nuevo)
    VALUES (${id}, ${usuarioId}, 'cambio_estado', ${nota ?? null}, ${estado})
  `;
}

export async function agregarNota(denunciaId: string, usuarioId: string, nota: string) {
  const sql = getSql();
  await sql`
    INSERT INTO historial_seguimiento (denuncia_id, usuario_id, accion, nota_interna)
    VALUES (${denunciaId}, ${usuarioId}, 'nota_interna', ${nota})
  `;
}