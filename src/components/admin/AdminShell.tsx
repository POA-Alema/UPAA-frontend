'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';
import { LogoutButton } from '@/components/admin/LogoutButton';

const AUTH_ROUTES = new Set(['/admin/login']);

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isAuthRoute = Boolean(pathname && AUTH_ROUTES.has(pathname));

  if (isAuthRoute) {
    return (
      <main className="min-h-screen bg-background text-on-background font-body">
        {children}
      </main>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-background text-on-background font-body md:flex-row">
        <aside className="w-full border-b border-outline-variant/10 bg-surface-container-high/30 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
          <h1 className="mb-4 font-headline text-xl font-bold text-primary md:mb-10">
            Admin
          </h1>

          <AdminSidebarNav />
          <LogoutButton />
        </aside>

        <main className="w-full flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
