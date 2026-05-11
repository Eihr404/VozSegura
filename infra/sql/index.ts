// =============================================================
// VozSegura — tipos centralizados (alineados con schema v2.2)
// =============================================================

export type RolDashboard = "superadmin" | "admin" | "dece" | "orientador" | "lector";
export type NivelGravedad = "baja" | "media" | "alta" | "critica";
export type EstadoDenuncia = "nueva" | "en_revision" | "en_intervencion" | "cerrada" | "descartada";
export type TipoDenuncia = "formal" | "desahogo";
export type TipoDenunciante = "victima" | "testigo" | "prefiero_no_decir";
export type NivelRiesgoEstudiante = "sin_historial" | "seguimiento" | "alerta" | "critico" | "cerrado";
export type NivelAccionCorrectiva =
  | "conversacion"
  | "acuerdo_reparatorio"
  | "citacion_representante"
  | "plan_intervencion"
  | "suspension_actividades"
  | "proceso_ministerio";
export type EstadoAccion = "propuesta" | "aprobada" | "en_curso" | "completada" | "cancelada";

export interface Institucion {
  id: string;
  nombre: string;
  codigo_bot: string;
  ciudad: string;
  activa: boolean;
  fecha_ingreso: string;
  contacto_nombre?: string;
  contacto_email?: string;
  created_at: string;
}

export interface UsuarioDashboard {
  id: string;
  institucion_id: string | null;
  nombre_completo: string;
  email: string;
  rol: RolDashboard;
  activo: boolean;
  ultimo_acceso?: string;
  created_at: string;
}

export interface CategoriaIncidente {
  id: number;
  nombre: string;
  descripcion?: string;
  gravedad_sugerida: NivelGravedad;
  mensaje_bot?: string;
  activa: boolean;
  orden_presentacion: number;
}

export interface Denuncia {
  id: string;
  institucion_id: string;
  categoria_id: number;
  tipo: TipoDenuncia;
  estado: EstadoDenuncia;
  prioridad: number;
  score_confiabilidad: number;
  solicita_seguimiento: boolean;
  rol_denunciante: TipoDenunciante;
  grado_implicado?: string;
  paralelo_implicado?: string;
  lugar_incidente?: string;
  recurrencia?: string;
  descripcion_hechos: string;
  nombres_implicados?: string;
  asignada_a?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_primera_revision?: string;
  fecha_cierre?: string;
}

// Vista dashboard_denuncias_resumen
export interface DenunciaResumen extends Denuncia {
  institucion_nombre: string;
  categoria: string;
  gravedad_sugerida: NivelGravedad;
  asignada_a_nombre?: string;
  dias_abierta: number;
  tiene_evidencias: boolean;
  total_notas: number;
}

export interface EstudianteImplicado {
  id: string;
  institucion_id: string;
  nombres: string;
  apellidos: string;
  grado_actual?: string;
  paralelo_actual?: string;
  nivel_riesgo: NivelRiesgoEstudiante;
  total_denuncias_como_implicado: number;
  total_denuncias_graves: number;
  total_denuncias_criticas: number;
  total_acciones_correctivas: number;
  total_sanciones_ministerio: number;
  en_intervencion_activa: boolean;
  fecha_ultima_denuncia?: string;
  verificado_por_dece: boolean;
}

export interface AccionCorrectiva {
  id: string;
  estudiante_id: string;
  denuncia_id: string;
  institucion_id: string;
  nivel_accion: NivelAccionCorrectiva;
  titulo: string;
  descripcion_accion: string;
  estado: EstadoAccion;
  propuesta_por: string;
  fecha_propuesta: string;
  resultado_obtenido?: string;
  cumplimiento_estudiante?: "total" | "parcial" | "nulo" | "pendiente";
  familia_notificada: boolean;
  numero_expediente_mineduc?: string;
}

export interface HistorialSeguimiento {
  id: string;
  denuncia_id: string;
  usuario_id?: string;
  accion: string;
  nota_interna?: string;
  estado_anterior?: EstadoDenuncia;
  estado_nuevo?: EstadoDenuncia;
  metadata?: Record<string, unknown>;
  fecha_registro: string;
}

// Sesión del usuario autenticado (JWT payload)
export interface SesionUsuario {
  id: string;
  email: string;
  nombre_completo: string;
  rol: RolDashboard;
  institucion_id: string | null;
  institucion_nombre?: string;
}