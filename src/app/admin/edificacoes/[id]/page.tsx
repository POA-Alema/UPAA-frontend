import { getEdificacaoById } from '@/services/edificacoes';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RichTextDisplay } from '@/components/admin/RichTextDisplay';

interface EdificacaoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EdificacaoPage({ params }: EdificacaoPageProps) {
  const { id } = await params;
  const edificacao = await getEdificacaoById(id);

  if (!edificacao) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-background text-on-background pt-16 pb-20 px-8 font-body">
      <div className="max-w-4xl mx-auto">
        {/* Header com Voltar */}
        <Link
          href="/admin/edificacoes"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 uppercase tracking-widest text-[10px] font-headline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para Edificações
        </Link>

        {/* Título */}
        <div className="mb-12">
          <span className="font-label uppercase tracking-[0.3em] text-[0.65rem] text-primary">
            Visualizar
          </span>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight mt-2">
            {edificacao.titulo}
          </h1>
          <div className="w-16 h-[1px] bg-primary mt-4 opacity-40"></div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/20">
            <h2 className="font-headline font-bold text-2xl mb-6 text-primary flex items-center gap-4">
              <span className="h-[2px] w-12 bg-primary"></span>
              Informações Básicas
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Título</dt>
                <dd className="mt-2 text-lg text-on-surface">{edificacao.titulo}</dd>
              </div>

              <div>
                <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Localização</dt>
                <dd className="mt-2 text-lg text-on-surface">{edificacao.localizacao}</dd>
              </div>

              {edificacao.data && (
                <div>
                  <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Data</dt>
                  <dd className="mt-2 text-lg text-on-surface">{edificacao.data}</dd>
                </div>
              )}

              {edificacao.projeto && (
                <div>
                  <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Projeto</dt>
                  <dd className="mt-2 text-lg text-on-surface">{edificacao.projeto}</dd>
                </div>
              )}

              {edificacao.construcao && (
                <div>
                  <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Construção</dt>
                  <dd className="mt-2 text-lg text-on-surface">{edificacao.construcao}</dd>
                </div>
              )}

              {edificacao.ocupacaoAtual && (
                <div>
                  <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Ocupação Atual</dt>
                  <dd className="mt-2 text-lg text-on-surface">{edificacao.ocupacaoAtual}</dd>
                </div>
              )}

              {edificacao.autor && (
                <div>
                  <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Autor</dt>
                  <dd className="mt-2 text-lg text-on-surface">{edificacao.autor}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Descrição */}
          {edificacao.descricao && (
            <div className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/20">
              <h2 className="font-headline font-bold text-2xl mb-4 text-primary flex items-center gap-4">
                <span className="h-[2px] w-12 bg-primary"></span>
                Descrição
              </h2>
              <RichTextDisplay content={edificacao.descricao} />
            </div>
          )}

          {/* Fontes */}
          {edificacao.fontes && edificacao.fontes.length > 0 && (
            <div className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/20">
              <h2 className="font-headline font-bold text-2xl mb-4 text-primary flex items-center gap-4">
                <span className="h-[2px] w-12 bg-primary"></span>
                Fontes
              </h2>
              <ul className="space-y-3">
                {edificacao.fontes.map((fonte) => (
                  <li key={fonte.id} className="text-on-surface">
                    <strong>{fonte.titulo}</strong>
                    {fonte.autor && ` - ${fonte.autor}`}
                    {fonte.url && (
                      <>
                        {' '}
                        <a href={fonte.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          (acessar)
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Botão de Edição */}
        <div className="mt-12 flex justify-end">
          <Link
            href={`/admin/edificacoes/${id}/edit`}
            className="bg-primary text-on-primary font-headline font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar Edificação
          </Link>
        </div>
      </div>
    </section>
  );
}
