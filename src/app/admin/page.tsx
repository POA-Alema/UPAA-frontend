import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary">
            Painel Administrativo
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2">
            Dashboard
          </h1>
          <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Módulo: Edificações */}
          <Link
            href="/admin/edificacoes"
            className="bg-surface-container-high/40 p-8 rounded-xl border border-outline-variant/10 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">
                domain
              </span>
              <h2 className="font-headline font-bold text-xl text-on-surface">
                Edificações
              </h2>
            </div>
            <p className="text-on-surface-variant text-sm">
              Gerencie todas as edificações cadastradas, crie novas e edite existentes.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
