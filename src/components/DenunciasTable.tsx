import type { Denuncia } from "@/types/denuncia";
import { formatFecha } from "@/lib/utils";

type DenunciasTableProps = {
  denuncias: Denuncia[];
};

export function DenunciasTable({ denuncias }: DenunciasTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-950/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Fecha
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tipo
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Descripcion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {denuncias.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-sm text-slate-500">
                  No hay denuncias que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              denuncias.map((denuncia) => (
                <tr key={denuncia.id} className="align-top">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {formatFecha(denuncia.fecha)}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                      {denuncia.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm leading-6 text-slate-600">
                    {denuncia.descripcion}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
