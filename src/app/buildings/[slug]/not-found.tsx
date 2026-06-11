"use client";

import { useSearchParams } from "next/navigation";
import { FeatureAction } from "@/components/ui/feature-action";
import { buildingLabels } from "@/features/buildings/data/building-labels";
import { resolveBuildingLanguage } from "@/features/buildings/data/buildings";

export default function BuildingNotFound() {
  const searchParams = useSearchParams();
  const labels = buildingLabels[resolveBuildingLanguage(searchParams.get("lang") ?? undefined)];

  return (
    <main className="building-page building-flow">
      <section
        aria-labelledby="building-not-found-title"
        className="building-section building-flow__section"
        data-testid="building-not-found"
      >
        <div className="building-section__inner">
          <div className="section-heading">
            <p className="eyebrow">{labels.unavailable}</p>
            <h1
              className="building-section__headline"
              id="building-not-found-title"
            >
              {labels.notFoundTitle}
            </h1>
          </div>

          <p className="rich-text rich-text--muted">
            {labels.notFoundDescription}
          </p>

          <div className="section-actions">
            <FeatureAction
              href="/mapa"
              icon="map"
              label={labels.backToMap}
              variant="primary"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
