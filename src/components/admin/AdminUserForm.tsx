'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import type { AdminRole } from '@/types/auth';
import type { AdminUser, AdminUserFormData } from '@/types/adminUser';

type AdminUserFormProps = {
  initialData?: AdminUser;
  onSubmit: (data: AdminUserFormData) => Promise<void>;
};

const ROLE_OPTIONS: Array<{ value: AdminRole; label: string; description: string }> = [
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Gerencia usuários e conteúdos. Tem todos os poderes.',
  },
  {
    value: 'CONTENT_MANAGER',
    label: 'Gerenciador de conteúdo',
    description: 'Gerencia conteúdos como edificações e landing page.',
  },
];

export function AdminUserForm({ initialData, onSubmit }: AdminUserFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>(initialData?.role ?? 'CONTENT_MANAGER');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialData);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        await onSubmit({
          name,
          email,
          password: password || undefined,
          role,
        });

        setMessage({
          type: 'success',
          text: isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!',
        });

        if (!isEditing) {
          setName('');
          setEmail('');
          setPassword('');
          setRole('CONTENT_MANAGER');
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao salvar usuário.',
        });
      }
    });
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-green-700/50 bg-green-900/20 text-green-200'
              : 'border-red-700/50 bg-red-900/20 text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <label className="grid gap-2 text-sm font-medium text-on-surface">
        Nome
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={120}
          className="rounded-lg border border-outline-variant/20 bg-background px-4 py-3 text-on-surface shadow-inner outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
          placeholder="Nome do usuário"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-on-surface">
        E-mail
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={160}
          className="rounded-lg border border-outline-variant/20 bg-background px-4 py-3 text-on-surface shadow-inner outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
          placeholder="usuario@poaalema.com"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-on-surface">
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required={!isEditing}
          minLength={isEditing && password.length === 0 ? undefined : 6}
          maxLength={128}
          className="rounded-lg border border-outline-variant/20 bg-background px-4 py-3 text-on-surface shadow-inner outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
          placeholder={isEditing ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'}
        />
      </label>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium text-on-surface">Role</legend>
        <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Role do usuário">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                role="radio"
                aria-checked={selected}
                className={`group relative min-h-32 rounded-lg border p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99] ${
                  selected
                    ? 'border-accent bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(209,166,91,0.42),0_16px_36px_rgba(0,0,0,0.28)]'
                    : 'border-outline-variant/20 bg-surface-container-high/40 text-on-surface hover:border-accent/60 hover:bg-surface-container-high/70 hover:shadow-lg'
                }`}
              >
                <span
                  className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                    selected
                      ? 'border-accent bg-accent text-black'
                      : 'border-outline-variant/30 text-transparent group-hover:border-accent/60'
                  }`}
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined text-base">check</span>
                </span>

                <span className="mb-3 flex items-center gap-3 pr-10 font-headline text-sm font-bold uppercase tracking-widest">
                  <span
                    className={`material-symbols-outlined text-2xl transition-colors ${
                      selected ? 'text-accent' : 'text-on-surface group-hover:text-accent'
                    }`}
                  >
                    {option.value === 'ADMIN' ? 'admin_panel_settings' : 'edit_document'}
                  </span>
                  {option.label}
                </span>
                <span className="block max-w-[28rem] text-xs leading-5 text-on-surface-variant">
                  {option.description}
                </span>
                <span
                  className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 font-headline text-[9px] font-bold uppercase tracking-widest transition-all ${
                    selected
                      ? 'border-accent/50 bg-accent/20 text-accent'
                      : 'border-transparent bg-transparent text-transparent'
                  }`}
                >
                  Selecionado
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-lg">
            {isPending ? 'hourglass_empty' : 'check'}
          </span>
          {isEditing ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
        </button>
      </div>
    </form>
  );
}
