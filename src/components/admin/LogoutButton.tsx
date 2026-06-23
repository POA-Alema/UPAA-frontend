'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuthSession, getAuthSession } from '@/lib/auth-storage';

export function LogoutButton() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getAuthSession()?.user.email ?? null);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="mt-6 border-t border-outline-variant/10 pt-4">
      {email && (
        <p className="mb-3 truncate text-xs text-on-surface-variant" title={email}>
          {email}
        </p>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-lg">logout</span>
        Sair
      </button>
    </div>
  );
}
