import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import { getEdificacoes } from "@/services/edificacoes";

export default async function EdificacoesPage() {
  const edificacoes = await getEdificacoes();
  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary">
              Painel Administrativo
            </span>
            <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2">
              Edificações
            </h1>
            <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
          </div>

          <Link
            href="/admin/edificacoes/new"
            className="bg-primary text-on-primary font-headline font-bold py-3 px-6 rounded-lg shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nova Edificação
          </Link>
        </div>

        {/* Grid de Edificações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {edificacoes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-on-surface/70 mb-4">Nenhuma edificação cadastrada ainda.</p>
              <Link
                href="/admin/edificacoes/new"
                className="text-primary hover:underline"
              >
                Crie a primeira →
              </Link>
            </div>
          ) : (
            edificacoes.map((edificacao) => (
            <div
              key={edificacao.id}
              className="bg-surface-container-high/40 p-6 rounded-xl border border-outline-variant/10 shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">
                  domain
                </span>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  {edificacao.titulo}
                </h3>
              </div>

              <p className="text-sm text-on-surface-variant mb-6">
                {edificacao.localizacao}
              </p>

              {/* Ações */}
              <div className="flex justify-between items-center gap-2">
                <Link
                  href={`/admin/edificacoes/${edificacao.id}`}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">
                    visibility
                  </span>
                  Visualizar
                </Link>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/edificacoes/${edificacao.id}/edit`}
                    className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-high/70 transition-colors"
                    aria-label="Editar edificação"
                  >
                    <span className="material-symbols-outlined text-on-surface">
                      edit
                    </span>
                  </Link>

                  <DeleteButton id={edificacao.id} />
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}