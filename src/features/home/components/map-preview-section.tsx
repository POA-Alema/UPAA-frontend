import Link from 'next/link';
import { PageSection } from '@/components/layout/page-section';
import { MapPlaceholder } from '@/features/map/components/map-placeholder';

export function MapPreviewSection() {
  return (
    // to do: implementar dados dinamicos
    <PageSection eyebrow="Mapa" title="Mapa" description="Descrição">
      <MapPlaceholder />
      <div className="section-actions">
        <Link className="text-link" href="/edificacoes">
          Edificações
        </Link>
      </div>
    </PageSection>
  );
}
