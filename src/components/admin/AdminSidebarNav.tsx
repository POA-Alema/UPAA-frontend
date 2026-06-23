'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthSession } from '@/lib/auth-storage';
import type { AdminRole } from '@/types/auth';

export function AdminSidebarNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    setRole(getAuthSession()?.user.role ?? null);
  }, []);

  const links = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: 'dashboard',
      exact: true,
    },
    {
      href: '/admin/buildings',
      label: 'Edificações',
      icon: 'domain',
      exact: false,
    },
    {
      href: '/admin/landing-page',
      label: 'Landing Page',
      icon: 'title',
      exact: false,
    },
    ...(role === 'ADMIN'
      ? [
          {
            href: '/admin/users',
            label: 'Usuários',
            icon: 'manage_accounts',
            exact: false,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname?.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin');

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
              isActive
                ? 'bg-primary/15 text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
              {link.icon}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
