import type { Metadata } from 'next';
import { PageSection } from '@/components/layout/page-section';
import { BuildingList } from '@/features/buildings/components/building-list';

export const metadata: Metadata = {
  title: 'Edificações | UPAA Frontend',
  description: 'Estrutura inicial das páginas de edificações.'
};

export default function BuildingsPage() {
  return (
    <main className="page-shell">
      <PageSection
        eyebrow="Edificações"
        title="Edificações"
        description="Descrição"
      >
        <BuildingList />
      </PageSection>
    </main>
  );
}
