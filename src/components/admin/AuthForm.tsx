'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { saveAuthSession } from '@/lib/auth-storage';
import { loginAdmin } from '@/services/auth';

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const auth = await loginAdmin({ email, password });

      saveAuthSession(auth, password);
      router.push('/admin');
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível conectar ao servidor de autenticação.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-8 shadow-xl">
        <div className="mb-8">
          <span className="font-label text-[0.65rem] uppercase tracking-[0.3em] text-primary">
            Painel Administrativo
          </span>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Entrar
          </h1>
          <div className="mt-4 h-[1px] w-16 bg-primary opacity-40" />
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-on-surface">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={160}
              className="rounded-lg border border-outline-variant/20 bg-background px-4 py-3 text-on-surface shadow-inner outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
              placeholder="admin@poaalema.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-on-surface">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              maxLength={128}
              className="rounded-lg border border-outline-variant/20 bg-background px-4 py-3 text-on-surface shadow-inner outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
              placeholder="admin123"
            />
          </label>

          {errorMessage && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-xl transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">
              {isSubmitting ? 'hourglass_empty' : 'login'}
            </span>
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
