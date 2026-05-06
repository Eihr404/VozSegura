type DashboardCardProps = {
  titulo: string;
  valor: string | number;
  descripcion: string;
};

export function DashboardCard({ titulo, valor, descripcion }: DashboardCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#140c2e] p-6 text-white shadow-xl shadow-[#140c2e]/20">
      <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">{titulo}</p>
      <p className="mt-4 text-3xl font-semibold">{valor}</p>
      <p className="mt-3 text-sm text-slate-300">{descripcion}</p>
    </article>
  );
}
