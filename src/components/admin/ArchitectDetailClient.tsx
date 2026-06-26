'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RichTextDisplay } from '@/components/admin/RichTextDisplay';
import { getAdminArchitect } from '@/services/architects';
import type { AdminArchitect } from '@/types/adminArchitect';

type ArchitectDetailClientProps = {
  id: string;
};

const STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Rascunho',
  archived: 'Arquivado',
} as const;

function formatLifeDate(day?: number | null, month?: number | null, year?: number | null) {
  if (!day || !month || !year) return null;
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

export function ArchitectDetailClient({ id }: ArchitectDetailClientProps) {
  const [architect, setArchitect] = useState<AdminArchitect | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAdminArchitect(id)
      .then((nextArchitect) => {
        if (active) setArchitect(nextArchitect);
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Arquiteto não encontrado.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const birthDate = architect
    ? formatLifeDate(architect.birthDay, architect.birthMonth, architect.birthYear)
    : null;
  const deathDate = architect
    ? formatLifeDate(architect.deathDay, architect.deathMonth, architect.deathYear)
    : null;

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/architects"
          className="mb-8 inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para Arquitetos
        </Link>

        {isLoading && <p className="text-sm text-on-surface-variant">Carregando arquiteto...</p>}
        {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}

        {architect && (
          <>
            <div className="mb-12 grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)] md:items-end">
              <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-high/40 shadow-xl">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={architect.portraitUrl}
                    alt={architect.portraitAlt || architect.fullName}
                    fill
                    unoptimized
                    sizes="18rem"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                  <span className="material-symbols-outlined text-sm">person</span>
                  {STATUS_LABELS[architect.status]}
                </span>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                  {architect.fullName}
                </h1>
                <p className="mt-3 text-on-surface-variant">{architect.slug}</p>
                <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
              </div>
            </div>

            <div className="space-y-8">
              <section className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
                <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                  <span className="h-[2px] w-12 bg-primary" />
                  Informações Básicas
                </h2>

                <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Nacionalidade</dt>
                    <dd className="mt-2 text-lg text-on-surface">{architect.citizenship}</dd>
                  </div>
                  <div>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Ocupação</dt>
                    <dd className="mt-2 text-lg text-on-surface">{architect.occupation}</dd>
                  </div>
                  <div>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Nascimento</dt>
                    <dd className="mt-2 text-lg text-on-surface">
                      {[birthDate, architect.birthCity, architect.birthCountry].filter(Boolean).join(' - ')}
                    </dd>
                  </div>
                  {deathDate && (
                    <div>
                      <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Falecimento</dt>
                      <dd className="mt-2 text-lg text-on-surface">
                        {[deathDate, architect.deathCity, architect.deathCountry].filter(Boolean).join(' - ')}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-on-surface/70">Edificações vinculadas</dt>
                    <dd className="mt-2 text-lg text-on-surface">{architect.buildingsCount ?? 0}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
                <h2 className="mb-4 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                  <span className="h-[2px] w-12 bg-primary" />
                  Biografia
                </h2>
                <RichTextDisplay content={architect.about} />
              </section>

              <section className="rounded-lg border border-outline-variant/20 bg-surface-container-high/40 p-6">
                <h2 className="mb-6 flex items-center gap-4 font-headline text-2xl font-bold text-primary">
                  <span className="h-[2px] w-12 bg-primary" />
                  Características
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ['Estilo', architect.style],
                    ['Influências', architect.influences],
                    ['Legado', architect.legacy],
                  ].map(([label, value]) => (
                    <article key={label} className="rounded-lg border border-outline-variant/10 bg-background/30 p-4">
                      <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-primary">{label}</h3>
                      <p className="mt-3 text-sm leading-6 text-on-surface-variant">{value}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-12 flex justify-end">
              <Link
                href={`/admin/architects/${id}/edit`}
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Editar Arquiteto
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
