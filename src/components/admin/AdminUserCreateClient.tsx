'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminUserForm } from '@/components/admin/AdminUserForm';
import { createAdminUser } from '@/services/adminUsers';
import type { AdminUserFormData } from '@/types/adminUser';

export function AdminUserCreateClient() {
  const router = useRouter();

  const handleSubmit = async (data: AdminUserFormData) => {
    await createAdminUser(data);
    router.push('/admin/users?status=created');
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
            Novo Usuário
          </h1>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
        </div>

        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-8 shadow-xl">
          <AdminUserForm onSubmit={handleSubmit} />
        </div>
      </div>
    </section>
  );
}
