'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ConfirmationModal } from '@/components/admin/ConfirmationModal';
import { deleteAdminUser, getAdminUsers } from '@/services/adminUsers';
import type { AdminUser } from '@/types/adminUser';

const STATUS_MESSAGES: Record<string, string> = {
  created: 'Usuário cadastrado com sucesso!',
  updated: 'Usuário atualizado com sucesso!',
  deleted: 'Usuário removido com sucesso!',
};

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const statusMessage = useMemo(() => {
    const status = searchParams.get('status');
    return status ? STATUS_MESSAGES[status] : null;
  }, [searchParams]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setUsers(await getAdminUsers());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar usuários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;

    setDeletingId(userToDelete.id);
    setErrorMessage(null);

    try {
      await deleteAdminUser(userToDelete.id);
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao remover usuário.');
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
              Usuários
            </h1>
            <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
          </div>

          <Link
            href="/admin/register"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Novo Usuário
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
          <p className="text-on-surface-variant">Carregando usuários...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-6 shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                      <span className="material-symbols-outlined text-sm">
                        {user.role === 'ADMIN' ? 'admin_panel_settings' : 'edit_document'}
                      </span>
                      {user.role === 'ADMIN' ? 'Admin' : 'Gerenciador de conteúdo'}
                    </span>
                    <h2 className="font-headline text-xl font-bold text-on-surface">{user.name}</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">{user.email}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="rounded-lg bg-surface-container-high p-2 transition-colors hover:bg-surface-container-high/70"
                    aria-label="Editar usuário"
                  >
                    <span className="material-symbols-outlined text-on-surface">edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setUserToDelete(user)}
                    disabled={deletingId === user.id}
                    className="rounded-lg bg-red-500/10 p-2 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    aria-label="Remover usuário"
                  >
                    <span className="material-symbols-outlined text-red-500">
                      {deletingId === user.id ? 'hourglass_empty' : 'delete'}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={userToDelete !== null}
          title="Remover usuário?"
          description={
            <>
              O usuário{' '}
              <strong className="text-on-surface">{userToDelete?.name ?? 'selecionado'}</strong>{' '}
              perderá acesso ao painel administrativo.
            </>
          }
          confirmLabel="Remover"
          isConfirming={deletingId === userToDelete?.id}
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </section>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense>
      <AdminUsersContent />
    </Suspense>
  );
}
