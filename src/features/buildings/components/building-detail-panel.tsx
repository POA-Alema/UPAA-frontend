import type { Building } from "@/data/buildings";

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
        <h3>Edificação</h3>
        <p>{building.description}</p>
      </article>
      <article className="info-card">
        <h3>Mapa</h3>
        <p>Integração com o mapa será conectada assim que a feature correspondente estiver disponível.</p>
      </article>
    </div>
  );
}
