import type { Building } from "@/data/buildings";
import { BuildingMaterialsSection } from "./building-materials-section";

type BuildingDetailPanelProps = {
  building: Building;
};

export function BuildingDetailPanel({ building }: BuildingDetailPanelProps) {
  return (
    <div className="content-grid">
      {/* TODO: Implement dynamic data fetching for building details */}
      <article className="info-card">
        <p className="meta-line">
          {building.location} - {building.constructionPeriod}
        </p>
        <h3>Edificacao</h3>
        <p>{building.description}</p>
      </article>
      <article className="info-card">
        <h3>Mapa</h3>
        <p>
          Integracao com o mapa sera conectada assim que a feature
          correspondente estiver disponivel.
        </p>
      </article>
      <div className="content-grid__full">
        <BuildingMaterialsSection materials={building.materials} />
      </div>
    </div>
  );
}
