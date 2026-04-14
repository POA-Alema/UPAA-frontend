import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetCard from '@/components/admin/AssetCard';
import { RichTextDisplay } from '@/components/admin/RichTextDisplay';
import { getEdificacaoById } from '@/services/edificacoes';

const DETAIL_FIELDS = [
  { key: 'titulo', label: 'Título' },
  { key: 'localizacao', label: 'Localização' },
  { key: 'data', label: 'Data' },
  { key: 'projeto', label: 'Projeto' },
  { key: 'construcao', label: 'Construção' },
  { key: 'ornamentosEsculturas', label: 'Conjunto de ornamentos e esculturas' },
  { key: 'areaConstituida', label: 'Área construída' },
  { key: 'ocupacaoAtual', label: 'Ocupação atual' },
  { key: 'projetoRestauracao', label: 'Projeto de restauração' },
  { key: 'tombamento', label: 'Tombamento' },
  { key: 'autor', label: 'Autor' },
] as const;

const IMAGE_CATEGORIES = [
  { key: 'plantaBaixa', label: 'Planta baixa' },
  { key: 'fachadas', label: 'Fachadas' },
  { key: 'fotosExternas', label: 'Fotos externas' },
  { key: 'fotosInternas', label: 'Fotos internas' },
] as const;

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
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/edificacoes"
          className="mb-8 inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para Edificações
        </Link>

        <div className="mb-12">
          <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">
            Visualizar
          </span>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            {edificacao.titulo}
          </h1>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40"></div>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
            <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
              <span className="h-[2px] w-12 bg-primary"></span>
              Informações Básicas
            </h2>

            <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DETAIL_FIELDS.map(({ key, label }) => {
                const value = edificacao[key];

                if (!value) {
                  return null;
                }

                return (
                  <div key={key}>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">
                      {label}
                    </dt>
                    <dd className="mt-2 text-lg text-on-surface">{value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {edificacao.descricao && (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
              <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                <span className="h-[2px] w-12 bg-primary"></span>
                Descrição
              </h2>
              <RichTextDisplay content={edificacao.descricao} />
            </div>
          )}

          {edificacao.fontes && edificacao.fontes.length > 0 && (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
              <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
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

          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
            <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
              <span className="h-[2px] w-12 bg-primary"></span>
              Imagens
            </h2>

            <div className="space-y-8">
              {IMAGE_CATEGORIES.map(({ key, label }) => {
                const imagens = edificacao.imagens?.[key] || [];

                if (imagens.length === 0) {
                  return (
                    <section key={key}>
                      <h3 className="mb-3 font-headline text-lg font-bold text-on-surface">{label}</h3>
                      <div className="rounded-lg border border-dashed border-outline-variant/30 px-4 py-5 text-sm text-on-surface/50">
                        Nenhuma imagem cadastrada nesta categoria.
                      </div>
                    </section>
                  );
                }

                return (
                  <section key={key}>
                    <h3 className="mb-3 font-headline text-lg font-bold text-on-surface">{label}</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {imagens.map((imagem) => (
                        <AssetCard key={imagem.id} image={imagem} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href={`/admin/edificacoes/${id}/edit`}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar Edificação
          </Link>
        </div>
      </div>
    </section>
  );
}
