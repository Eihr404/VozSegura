export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-36 rounded-[2rem] bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-3xl bg-slate-200" />
            <div className="h-32 rounded-3xl bg-slate-200" />
            <div className="h-32 rounded-3xl bg-slate-200" />
          </div>
          <div className="h-96 rounded-[2rem] bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
