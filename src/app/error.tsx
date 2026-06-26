"use client";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-on-background">
      <span className="material-symbols-outlined text-4xl text-error">error</span>
      <p className="font-headline text-lg font-bold">Não foi possível carregar a página</p>
      <p className="text-sm text-on-surface-variant">Tente novamente em instantes.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-6 py-2 text-sm font-bold uppercase tracking-widest text-on-primary"
      >
        Tentar novamente
      </button>
    </div>
  );
}
