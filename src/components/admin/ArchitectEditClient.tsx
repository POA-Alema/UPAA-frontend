'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArchitectForm } from '@/components/admin/ArchitectForm';
import { getAdminArchitect, updateAdminArchitect } from '@/services/architects';
import type { AdminArchitect, ArchitectFormData } from '@/types/adminArchitect';

type ArchitectEditClientProps = {
  id: string;
};

export function ArchitectEditClient({ id }: ArchitectEditClientProps) {
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

  const handleSubmit = async (data: ArchitectFormData) => {
    await updateAdminArchitect(id, data);
  };

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <Link
            href="/admin/architects"
            className="mb-4 inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar para Arquitetos
          </Link>
          <span className="font-label block text-[0.65rem] uppercase tracking-[0.3em] text-primary">
            Painel Administrativo
          </span>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            Editar Arquiteto
          </h1>
          <p className="mt-2 text-on-surface/70">ID: {id}</p>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
        </div>

        {isLoading && <p className="text-sm text-on-surface-variant">Carregando arquiteto...</p>}
        {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
        {architect && <ArchitectForm initialData={architect} onSubmit={handleSubmit} />}
      </div>
    </section>
  );
}
