import { MapCTA } from '@/features/home/components/map-cta';
import type { Metadata } from 'next';
import { PageSection } from '@/components/layout/page-section';
import { AccessibleContentPanel } from '@/features/accessible-content/components/accessible-content-panel';

export const metadata: Metadata = {
  title: 'Conteúdo Acessível | UPAA Frontend',
  description: 'Estrutura inicial da área de conteúdo acessível.'
};

export default function AccessibleContentPage() {
  return (
    <main className="page-shell">
      <MapCTA />
      <PageSection
        eyebrow="Acessibilidade"
        title="Conteúdo acessível"
        description="Descrição"
      >
        <AccessibleContentPanel />
      </PageSection>
    </main>
  );
}
