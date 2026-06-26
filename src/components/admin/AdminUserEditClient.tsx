'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminUserForm } from '@/components/admin/AdminUserForm';
import { getAdminUser, updateAdminUser } from '@/services/adminUsers';
import type { AdminUser, AdminUserFormData } from '@/types/adminUser';

type AdminUserEditClientProps = {
  id: string;
};

export function AdminUserEditClient({ id }: AdminUserEditClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAdminUser(id)
      .then((nextUser) => {
        if (active) setUser(nextUser);
      })
      .catch((error) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : 'Usuário não encontrado.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (data: AdminUserFormData) => {
    await updateAdminUser(id, data);
    router.push('/admin/users?status=updated');
    router.refresh();
  };

  return (
    <section className="min-h-screen bg-background px-8 pb-20 pt-16 font-body text-on-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <Link
            href="/admin/users"
            className="mb-4 inline-flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar para Usuários
          </Link>
          <span className="font-label block text-[0.65rem] uppercase tracking-[0.3em] text-primary">
            Painel Administrativo
          </span>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            Editar Usuário
          </h1>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
        </div>

        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-8 shadow-xl">
          {isLoading && <p className="text-sm text-on-surface-variant">Carregando usuário...</p>}
          {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
          {user && <AdminUserForm initialData={user} onSubmit={handleSubmit} />}
        </div>
      </div>
    </section>
  );
}
