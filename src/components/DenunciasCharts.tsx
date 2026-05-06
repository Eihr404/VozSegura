"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import type { DashboardStats } from "@/types/denuncia";

type DenunciasChartsProps = {
  stats: DashboardStats;
};

const COLORS = ["#1fa971", "#2d1b69", "#0f172a", "#475569", "#14532d"];

export function DenunciasCharts({ stats }: DenunciasChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 xl:col-span-2">
        <h3 className="text-lg font-semibold text-slate-900">Denuncias por tipo</h3>
        <p className="mt-1 text-sm text-slate-500">Distribucion actual por categoria registrada.</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.denunciasPorTipo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tipo" stroke="#475569" />
              <YAxis allowDecimals={false} stroke="#475569" />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total" fill="#1fa971" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5">
        <h3 className="text-lg font-semibold text-slate-900">Participacion por tipo</h3>
        <p className="mt-1 text-sm text-slate-500">Vista porcentual de las denuncias acumuladas.</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.denunciasPorTipo}
                dataKey="total"
                nameKey="tipo"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
              >
                {stats.denunciasPorTipo.map((entry, index) => (
                  <Cell key={entry.tipo} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 xl:col-span-3">
        <h3 className="text-lg font-semibold text-slate-900">Evolucion por fecha</h3>
        <p className="mt-1 text-sm text-slate-500">Seguimiento temporal de denuncias registradas.</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.denunciasPorFecha}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" stroke="#475569" />
              <YAxis allowDecimals={false} stroke="#475569" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Denuncias"
                stroke="#2d1b69"
                strokeWidth={3}
                dot={{ fill: "#1fa971", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
