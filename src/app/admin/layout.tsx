import type { ReactNode } from "react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Alterado para flex-col no mobile e flex-row no desktop (md:)
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-on-background font-body">
      
      {/* Sidebar / Topbar Responsiva */}
      {/* No mobile: vira uma barra no topo (w-full). No desktop: volta a ser a barra lateral (md:w-64 md:min-h-screen) */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-outline-variant/10 bg-surface-container-high/30 p-4 md:p-6">
        {/* mb-4 no mobile para não ocupar espaço vertical sagrado, mb-10 no desktop */}
        <h1 className="font-headline font-bold text-xl text-primary mb-4 md:mb-10">
          Admin
        </h1>

        <AdminSidebarNav />
      </aside>

      {/* Conteúdo Principal */}
      {/* w-full garante que ele ocupe a largura certa no mobile, e overflow-y-auto garante o scroll livre para baixo */}
      <main className="flex-1 w-full overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}