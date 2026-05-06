export function formatFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(fecha));
}

export function normalizarTexto(valor: string): string {
  return valor.trim().toLowerCase();
}
