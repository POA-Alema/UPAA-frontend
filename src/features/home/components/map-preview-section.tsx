import { PageSection } from "@/components/layout/page-section";
import { FeatureAction } from "@/components/ui/feature-action";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";

export function MapPreviewSection() {
  return (
    <PageSection className="home-flow__section" eyebrow="Mapa" title="Mapa" description="Descrição">
      <MapPlaceholder />
      <div className="section-actions">
        <FeatureAction icon="map" label="Abrir mapa" variant="secondary" />
      </div>
    </PageSection>
  );
}
