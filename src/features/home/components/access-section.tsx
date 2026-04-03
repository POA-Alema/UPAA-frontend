import Link from 'next/link';
import { PageSection } from '@/components/layout/page-section';

export function AccessSection() {
  return (
    // TODO: Implement dynamic data fetching for accessible content section
    <PageSection
      eyebrow="Conteúdo"
      title="Conteúdo acessível"
      description="Descrição"
    >
      <div className="section-actions">
        <Link className="text-link" href="/conteudo-acessivel">
          Acessar conteúdo
        </Link>
      </div>
    </PageSection>
  );
}
