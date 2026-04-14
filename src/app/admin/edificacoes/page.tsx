import Link from "next/link";
import { revalidatePath } from "next/cache";
import AssetCard from "@/components/admin/AssetCard";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteEdificacao, getEdificacoes } from "@/services/edificacoes";

const STATUS_MESSAGES = {
  created: "Edificação criada com sucesso!",
  updated: "Edificação atualizada com sucesso!",
  deleted: "Edificação removida com sucesso!",
} as const;

interface EdificacoesPageProps {
  searchParams?: Promise<{
    status?: keyof typeof STATUS_MESSAGES;
  }>;
}

export default async function EdificacoesPage({ searchParams }: EdificacoesPageProps) {
  const edificacoes = await getEdificacoes();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const status = resolvedSearchParams?.status;
  const statusMessage = status ? STATUS_MESSAGES[status] : null;

  const handleDelete = async (id: string) => {
    "use server";
    await deleteEdificacao(id);
    revalidatePath("/admin/edificacoes");
  };

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-6xl">
        {statusMessage && (
          <div className="mb-8 rounded-lg border border-green-700/50 bg-green-900/20 p-4 text-green-200">
            {statusMessage}
          </div>
        )}

        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">
              Painel Administrativo
            </span>
            <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Edificações
            </h1>
            <div className="mt-4 h-[1px] w-16 bg-primary opacity-40"></div>
          </div>

          <Link
            href="/admin/edificacoes/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nova Edificação
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {edificacoes.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="mb-4 text-on-surface/70">Nenhuma edificação cadastrada ainda.</p>
              <Link href="/admin/edificacoes/new" className="text-primary hover:underline">
                Crie a primeira
              </Link>
            </div>
          ) : (
            edificacoes.map((edificacao) => (
              <div
                key={edificacao.id}
                className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-6 shadow-xl transition-all hover:shadow-2xl"
              >
                {(() => {
                  const imagemPrincipal =
                    edificacao.imagens?.fachadas?.[0] ||
                    edificacao.imagens?.fotosExternas?.[0] ||
                    edificacao.imagens?.plantaBaixa?.[0] ||
                    edificacao.imagens?.fotosInternas?.[0];

                  return imagemPrincipal ? (
                    <div className="mb-4">
                      <AssetCard image={imagemPrincipal} />
                    </div>
                  ) : null;
                })()}

                <div className="mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{edificacao.titulo}</h3>
                </div>

                <p className="mb-6 text-sm text-on-surface-variant">{edificacao.localizacao}</p>

                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/edificacoes/${edificacao.id}`}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Visualizar
                  </Link>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/edificacoes/${edificacao.id}/edit`}
                      className="rounded-lg bg-surface-container-high p-2 transition-colors hover:bg-surface-container-high/70"
                      aria-label="Editar edificação"
                    >
                      <span className="material-symbols-outlined text-on-surface">edit</span>
                    </Link>

                    <DeleteButton id={edificacao.id} onDelete={handleDelete} />
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
