import Link from "next/link";
import { buildings } from "@/data/buildings";

export function BuildingList() {
  return (
    <div className="content-grid">
      {/* TODO: Implement dynamic data fetching for building list */}
      {buildings.map((building) => (
        <article className="info-card" key={building.id}>
          <p className="meta-line">
            {building.location} - {building.constructionPeriod}
          </p>
          <h3>{building.title}</h3>
          <p>{building.description}</p>
          <Link className="text-link" href={`/buildings/${building.id}`}>
            Ver página
          </Link>
        </article>
      ))}
    </div>
  );
}
