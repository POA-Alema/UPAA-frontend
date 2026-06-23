'use client';

import type { ReactNode } from 'react';

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-high p-6 shadow-2xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <h2
              id="confirmation-modal-title"
              className="font-headline text-xl font-bold text-on-surface"
            >
              {title}
            </h2>
            <div className="mt-2 text-sm leading-6 text-on-surface-variant">
              {description}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded-lg border border-outline-variant/30 px-5 py-2.5 font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-headline text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">
              {isConfirming ? 'hourglass_empty' : 'delete'}
            </span>
            {isConfirming ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
