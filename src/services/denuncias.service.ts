// src/services/denuncias.service.ts
import { getSql } from "@/lib/db";

export async function getDashboardStats(institucionId: string) {
  const sql = getSql();

  const [totales] = await sql`
    SELECT
      COUNT(*)                                          AS total,
      COUNT(*) FILTER (WHERE estado = 'nueva')          AS nuevas,
      COUNT(*) FILTER (WHERE estado = 'en_revision')    AS en_revision,
      COUNT(*) FILTER (WHERE estado = 'en_intervencion') AS en_intervencion,
      COUNT(*) FILTER (WHERE estado = 'cerrada')        AS cerradas,
      COUNT(*) FILTER (WHERE tipo  = 'formal')          AS formales,
      COUNT(*) FILTER (WHERE tipo  = 'desahogo')        AS desahogos,
      COUNT(*) FILTER (WHERE prioridad = 1)             AS criticas
    FROM denuncias
    WHERE institucion_id = ${institucionId}
  `;

  const porCategoria = await sql`
    SELECT c.nombre AS categoria, COUNT(*) AS total
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    WHERE  d.institucion_id = ${institucionId}
    GROUP  BY c.nombre
    ORDER  BY total DESC
    LIMIT  8
  `;

  const recientes = await sql`
    SELECT d.id, d.tipo, d.estado, d.prioridad, d.fecha_creacion,
           c.nombre AS categoria, c.gravedad_sugerida
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    WHERE  d.institucion_id = ${institucionId}
    ORDER  BY d.fecha_creacion DESC
    LIMIT  5
  `;

  return {
    totales,
    porCategoria,
    recientes,
  };
}

export async function getDenuncias(
  institucionId: string,
  filtros: { estado?: string; tipo?: string; prioridad?: string } = {}
) {
  const sql = getSql();

  const rows = await sql`
    SELECT d.id, d.tipo, d.estado, d.prioridad, d.score_confiabilidad,
           d.solicita_seguimiento, d.grado_implicado, d.paralelo_implicado,
           d.lugar_incidente, d.recurrencia, d.descripcion_hechos,
           d.fecha_creacion, d.fecha_actualizacion,
           c.nombre AS categoria, c.gravedad_sugerida,
           u.nombre_completo AS asignada_a_nombre
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    LEFT JOIN usuarios_dashboard u ON d.asignada_a = u.id
    WHERE  d.institucion_id = ${institucionId}
      AND  (${filtros.estado ?? null} IS NULL OR d.estado = ${filtros.estado ?? null})
      AND  (${filtros.tipo   ?? null} IS NULL OR d.tipo   = ${filtros.tipo   ?? null})
    ORDER  BY d.prioridad ASC, d.fecha_creacion DESC
    LIMIT  100
  `;

  return rows;
}

export async function getDenunciaById(id: string, institucionId: string) {
  const sql = getSql();

  const [denuncia] = await sql`
    SELECT d.*, c.nombre AS categoria, c.gravedad_sugerida,
           u.nombre_completo AS asignada_a_nombre
    FROM   denuncias d
    JOIN   categorias_incidente c ON d.categoria_id = c.id
    LEFT JOIN usuarios_dashboard u ON d.asignada_a = u.id
    WHERE  d.id = ${id}
      AND  d.institucion_id = ${institucionId}
  `;

  if (!denuncia) return null;

  const historial = await sql`
    SELECT h.*, u.nombre_completo AS usuario_nombre
    FROM   historial_seguimiento h
    LEFT JOIN usuarios_dashboard u ON h.usuario_id = u.id
    WHERE  h.denuncia_id = ${id}
    ORDER  BY h.fecha_registro DESC
  `;

  return { ...denuncia, historial };
}

export async function cambiarEstadoDenuncia(
  id: string,
  estado: string,
  usuarioId: string,
  nota?: string
) {
  const sql = getSql();

  await sql`
    UPDATE denuncias
    SET estado = ${estado}, fecha_actualizacion = now()
    WHERE id = ${id}
  `;

  await sql`
    INSERT INTO historial_seguimiento (denuncia_id, usuario_id, accion, nota_interna, estado_nuevo)
    VALUES (${id}, ${usuarioId}, 'cambio_estado', ${nota ?? null}, ${estado})
  `;
}

export async function agregarNota(
  denunciaId: string,
  usuarioId: string,
  nota: string
) {
  const sql = getSql();

  await sql`
    INSERT INTO historial_seguimiento (denuncia_id, usuario_id, accion, nota_interna)
    VALUES (${denunciaId}, ${usuarioId}, 'nota_interna', ${nota})
  `;
}