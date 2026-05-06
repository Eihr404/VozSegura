export interface Denuncia {
  id: number;
  usuario_id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
}

export interface DashboardStats {
  totalDenuncias: number;
  denunciasHoy: number;
  tipoMasFrecuente: string;
  denunciasPorTipo: Array<{
    tipo: string;
    total: number;
  }>;
  denunciasPorFecha: Array<{
    fecha: string;
    total: number;
  }>;
}
