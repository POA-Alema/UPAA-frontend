'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STATUS_MESSAGES: Record<string, string> = {
  created: 'Edificação criada com sucesso!',
  updated: 'Edificação atualizada com sucesso!',
  deleted: 'Edificação removida com sucesso!',
};

const TOAST_DURATION_MS = 3_000;

export default function StatusToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');

    if (status && STATUS_MESSAGES[status]) {
      setMessage(STATUS_MESSAGES[status]);
      setVisible(true);

      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      router.replace(url.pathname, { scroll: false });

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setVisible(false);
      }, TOAST_DURATION_MS);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!visible || !message) return null;

  return (
    <div
      className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-lg border border-green-700/50 bg-green-900/90 px-5 py-3 text-green-200 shadow-2xl backdrop-blur-sm animate-in slide-in-from-right"
      role="status"
    >
      <span className="material-symbols-outlined text-lg text-green-400">check_circle</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 text-green-400/60 transition-colors hover:text-green-200"
        aria-label="Fechar"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}
