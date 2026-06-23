'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthSession } from '@/lib/auth-storage';

const AUTH_ROUTES = new Set(['/admin/login']);
const ADMIN_ONLY_PREFIXES = ['/admin/users', '/admin/register'];

type AdminAuthGuardProps = {
  children: ReactNode;
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (pathname && AUTH_ROUTES.has(pathname)) {
      if (getAuthSession()) {
        router.replace('/admin');
        return;
      }

      setIsReady(true);
      return;
    }

    const session = getAuthSession();

    if (!session) {
      setIsReady(false);
      router.replace('/admin/login');
      return;
    }

    if (
      pathname &&
      ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
      session.user.role !== 'ADMIN'
    ) {
      setIsReady(false);
      router.replace('/admin');
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-on-background">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">hourglass_empty</span>
          Carregando
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
