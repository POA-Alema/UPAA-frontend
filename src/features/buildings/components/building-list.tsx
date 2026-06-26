import Link from "next/link";
import { listBuildings } from "@/features/buildings/data/buildings";

export async function BuildingList() {
  const buildings = await listBuildings();

  if (buildings.length === 0) {
    return (
      <p className="text-sm text-on-surface/70">
        Nenhuma edificação cadastrada.
      </p>
    );
  }

  return (
    <div className="content-grid">
      {buildings.map((building) => (
        <article className="info-card" key={building.id}>
          {building.eyebrow ? <p className="meta-line">{building.eyebrow}</p> : null}
          <h3>{building.title}</h3>
          <p>{building.summary}</p>
          <Link
            className="text-link"
            href={`/buildings/${building.slug || building.id}`}
          >
            Ver página
          </Link>
        </article>
      ))}
    </div>
  );
}
