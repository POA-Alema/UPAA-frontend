import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-background font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant/10 bg-surface-container-high/30 p-6">
        <h1 className="font-headline font-bold text-xl text-primary mb-10">
          Admin
        </h1>

        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>

          <Link
            href="/admin/edificacoes"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
          >
            <span className="material-symbols-outlined">domain</span>
            Edificações
          </Link>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1">{children}</main>
    </div>
  );
}