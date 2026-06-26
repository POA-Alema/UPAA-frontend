import type { Metadata } from 'next';
import { BuildingsPageSection } from '@/features/buildings/components/buildings-page-section';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Edificações | UPAA Frontend',
  description: 'Estrutura inicial das páginas de edificações.'
};

export default function BuildingsPage() {
  return (
    <main className="page-shell">
      <BuildingsPageSection />
    </main>
  );
}
