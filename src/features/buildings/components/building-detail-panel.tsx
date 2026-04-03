import type { Building } from '@/data/buildings';

type BuildingDetailPanelProps = {
  building: Building;
};

export function BuildingDetailPanel({ building }: BuildingDetailPanelProps) {
  return (
    <div className="content-grid">
      {/* TODO: Implement dynamic data fetching for building details */}
      <article className="info-card">
        <p className="meta-line">
          {building.district} - {building.yearLabel}
        </p>
        <h3>Edificação</h3>
        <p>{building.summary}</p>
      </article>
      <article className="info-card">
        <h3>Mapa</h3>
        <p>Descrição</p>
      </article>
    </div>
  );
}
