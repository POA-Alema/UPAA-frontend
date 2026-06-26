'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmationModal } from '@/components/admin/ConfirmationModal';
import { deleteAdminArchitect, getAdminArchitects } from '@/services/architects';
import type { AdminArchitect } from '@/types/adminArchitect';

const STATUS_MESSAGES: Record<string, string> = {
  created: 'Arquiteto cadastrado com sucesso!',
  updated: 'Arquiteto atualizado com sucesso!',
  deleted: 'Arquiteto removido com sucesso!',
};

const STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Rascunho',
  archived: 'Arquivado',
} as const;

export function ArchitectsAdminClient() {
  const searchParams = useSearchParams();
  const statusMessage = useMemo(() => {
    const status = searchParams.get('status');
    return status ? STATUS_MESSAGES[status] : null;
  }, [searchParams]);
  const [architects, setArchitects] = useState<AdminArchitect[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [architectToDelete, setArchitectToDelete] = useState<AdminArchitect | null>(null);

  const loadArchitects = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setArchitects(await getAdminArchitects());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar arquitetos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadArchitects();
  }, []);

  const handleDelete = async () => {
    if (!architectToDelete) return;

    setDeletingId(architectToDelete.id);
    setErrorMessage(null);

    try {
      await deleteAdminArchitect(architectToDelete.id);
      setArchitectToDelete(null);
      await loadArchitects();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao remover arquiteto.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">
              Painel Administrativo
            </span>
            <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Arquitetos
            </h1>
            <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
          </div>

          <Link
            href="/admin/architects/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Novo Arquiteto
          </Link>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-lg border border-green-700/50 bg-green-900/20 px-4 py-3 text-sm text-green-200">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <p className="text-on-surface-variant">Carregando arquitetos...</p>
        ) : architects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant/20 px-6 py-12 text-center">
            <p className="mb-4 text-on-surface/70">Nenhum arquiteto cadastrado ainda.</p>
            <Link href="/admin/architects/new" className="text-primary hover:underline">
              Cadastrar o primeiro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {architects.map((architect) => (
              <article
                key={architect.id}
                className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-high/40 shadow-xl transition-all hover:shadow-2xl"
              >
                <div className="relative aspect-[4/5] w-full bg-background/40">
                  {architect.portraitUrl ? (
                    <Image
                      src={architect.portraitUrl}
                      alt={architect.portraitAlt || architect.fullName}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-on-surface/40">
                      <span className="material-symbols-outlined text-5xl">portrait</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                    <span className="material-symbols-outlined text-sm">
                      {architect.status === 'published' ? 'public' : architect.status === 'draft' ? 'draft' : 'archive'}
                    </span>
                    {STATUS_LABELS[architect.status]}
                  </span>

                  <h2 className="font-headline text-xl font-bold text-on-surface">{architect.fullName}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">{architect.slug}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-on-surface-variant">
                    <div>
                      <span className="block font-label text-[0.65rem] uppercase tracking-[0.2em] text-on-surface/50">
                        Nacionalidade
                      </span>
                      {architect.citizenship}
                    </div>
                    <div>
                      <span className="block font-label text-[0.65rem] uppercase tracking-[0.2em] text-on-surface/50">
                        Obras
                      </span>
                      {architect.buildingsCount ?? 0}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/architects/${architect.id}`}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Visualizar
                    </Link>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/architects/${architect.id}/edit`}
                        className="rounded-lg bg-surface-container-high p-2 transition-colors hover:bg-surface-container-high/70"
                        aria-label="Editar arquiteto"
                      >
                        <span className="material-symbols-outlined text-on-surface">edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setArchitectToDelete(architect)}
                        disabled={deletingId === architect.id}
                        className="rounded-lg bg-red-500/10 p-2 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        aria-label="Remover arquiteto"
                      >
                        <span className="material-symbols-outlined text-red-500">
                          {deletingId === architect.id ? 'hourglass_empty' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={architectToDelete !== null}
          title="Remover arquiteto?"
          description={
            <>
              O arquiteto{' '}
              <strong className="text-on-surface">
                {architectToDelete?.fullName ?? 'selecionado'}
              </strong>{' '}
              será removido do painel administrativo.
            </>
          }
          confirmLabel="Remover"
          isConfirming={deletingId === architectToDelete?.id}
          onCancel={() => setArchitectToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </section>
  );
}
